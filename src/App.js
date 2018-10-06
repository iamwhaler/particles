import React, {Component} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import Footer from './footer.js'

import './css/App.css';
import './css/particles.css'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {game_name} from './game/app_config';
import {getDefaultState} from './game/default_state';
import {tick} from './game/tick';
import {rules} from './game/rules';
import {data} from './game/data';
import {clickers} from './game/clickers';
import {fluctuators} from './game/fluctuators';
import {terraformers} from './game/terraformers';
import {difficulty} from './game/difficulty';
import Popup from "./utils/Popup/Popup";
import {Line} from 'rc-progress';
import {Circle} from 'react-shapes';
import Switch from "react-switch";

import Bubble from './utils/bubbles.js'

import { Orchestrator } from './game/orchestrator';

// import {ToastContainer} from 'react-toastr';
import confirm from './components/confirm_launch';
// import toastr from "toastr";

import {weight} from './game/physics';
import {calcLifeFormProbability} from './game/biology';
import {isEnough, chargeCost, drawCost} from './utils/bdcgin';


class App extends Component {
    constructor(props) {
        super(props);

        this.timerID = null;

        this.playGame = this.playGame.bind(this);
        this.pauseGame = this.pauseGame.bind(this);
        this.setGameSpeed = this.setGameSpeed.bind(this);
        this.tick = this.tick.bind(this);
        this.newGame = this.newGame.bind(this);
        this.createPopup = this.createPopup.bind(this);

        this.state = getDefaultState();
    }


    componentDidMount() {
        console.log('App ' + game_name + ' componentDidMount');
        var app_state = JSON.parse(localStorage.getItem(game_name + "_app_state"));
        if (!app_state) {
            getDefaultState();
        }
        else {
            this.setState(app_state)
        }
        this.playGame();
    }

    playGame(speed_multiplier = false) {
        clearInterval(this.timerID);
        this.timerID = setInterval(
            () => this.tick(),
            Math.floor(this.state.game_speed / (speed_multiplier ? speed_multiplier : this.state.game_speed_multiplier))
        );
        this.setState({game_paused: false});
    }

    pauseGame() {
        clearInterval(this.timerID);
        this.setState({game_paused: true});
    }

    setGameSpeed(speed) {
        if (!this.state.game_paused) this.playGame(speed);
        this.setState({game_speed_multiplier: speed});
    }

    newGame() {
        this.pauseGame();
        confirm('Do you want to fully reset the game?').then(
            () => {
                localStorage.setItem(game_name + "_app_state", null);
                let new_state = getDefaultState();
                new_state.chat.unshift({header: "Welcome to the Game!", text: "Your universe is cooling down, please wait a little"});
                this.setState(new_state);
                this.playGame(new_state.game_speed_multiplier);
            },

            () => {
                this.playGame();
                return false;
            });
    }

    tick() {
        let state = tick(this.state);
        state.tick++;
        localStorage.setItem(game_name + "_app_state", JSON.stringify(state));
        this.setState(state);
    }


    onClickWrapper(item) {
        if (item.cost) {
            let cost = _.isFunction(item.cost) ? item.cost(this.state) : item.cost;
            if (isEnough(this.state, cost)) {
                if (item.onClick) this.setState(item.onClick(chargeCost(this.state, cost)));
            }
            else {
                return false;
            }
        }
        else {
            if (item.onClick) this.setState(item.onClick(this.state));
        }
    }

    createPopup(state, component) {
        this.popupHandler.createPopup(``, component);
    }


    roundNumber(number) {
        let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
            decimal;

        for(let i=units.length-1; i>=0; i--) {
            decimal = Math.pow(1000, i+1);

            if(number <= -decimal || number >= decimal) {
                return +(number / decimal).toFixed(3) + units[i];
            }
        }
        return Math.round(number);
    }

    render() {
        let state = this.state;

        const GinButton = (props) => {
            let item = props.item;
            //console.log(item);
            return (item.isLocked && item.isLocked(this.state))
                ? ''
                :
                    <button style={{padding: '4px 4px', width: '50%'}}
                        className={(item.isDisabled && item.isDisabled(this.state)) ? 'disabled' :''}
                        onClick={() => {
                            this.onClickWrapper(item);
                        }}>
                        {item.name}
                    </button>
        };

        const ConsumableGinButton = (props) => <GinButton item={{
            name: props.item.name,
            isDisabled: (state) => !state.terraformers[props.item.key],
            onClick: (state) => { state.terraformers[props.item.key] -= 1; return props.item.onLaunch(this.state, props.system_id, props.target_id); } }} />;


        /* const details = (item) =>
            <Tooltip id="tooltip">
                <div className="flex-container-row">
                    <div className="flex-element flex-container-column">
                        <img src={item.image} alt="tooltip illustration" style={{marginLeft: '20px', width: '60px', height: '70px'}}/>
                    </div>
                    <div className="flex-element flex-container-column">
                        <h6>{item.name}</h6>
                        {(!item.info)
                            ? ''
                            :
                            <div className="flex-element infoBar">
                                <p>{item.info}</p>
                            </div>
                        }
                    </div>

                </div>
            </Tooltip>;
            */

        const tooltip = (state, item) =>
            <Tooltip id="tooltip">
                <div className="flex-container-row">
                    <span className="flex-element">
                        {!item.name ? '' : item.name}
                    </span>
                </div>
                <div className="flex-element">
                    {(!item.text)
                        ? ''
                        :
                        <span style={{fontSize: '11px'}}>{item.text}</span>}
                </div>

                {item.cost
                    ?
                    <div>
                        <div className="flex-element">Cost</div>
                        {_.map(_.isFunction(item.cost) ? item.cost(this.state) : item.cost, (value, resource_key) =>
                            <div className="flex-container-row" key={resource_key}>
                                <div className="flex-element" style={{textAlign: 'left', justifyContent: 'flex-start'}}>
                                    <span>{resource_key}: </span>
                                </div>
                                <div className="flex-element" style={{textAlign: 'right', justifyContent: 'flex-end'}}>
                                    <span
                                        style={(value > _.get(state, resource_key)) ? {color: '#982727'} : {color: ''}}>
                                        {this.roundNumber(value)}
                                        / {this.roundNumber(_.get(state, resource_key))}
                                        {(value > _.get(state, resource_key)) ?
                                            <span> ({this.roundNumber(-(_.get(state, resource_key) - value))} left)</span> : ''}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    : ''}


            </Tooltip>;

        const time_subcomponent =
            <div className="flex-container-row time-machine">
                    <span onClick={() => {
                        if (this.state.game_paused) {
                            this.playGame();
                        } else {
                            this.pauseGame();
                        }
                    }}>
                        <span
                            className={classNames('glyphicon', (this.state.game_paused ? 'glyphicon-play' : 'glyphicon-pause'))}
                            style={{width: 28, height: 28}}> </span>
                            </span>
                {[1, 2, 5].map((speed, index) => {
                    return <span key={index}>
                                {this.state.game_speed_multiplier === speed
                                    ? <button className="" style={{width: 42, height: 28}}>
                                    <u>{{0: 'x1', 1: 'x2', 2: 'x5'}[index]}</u></button>
                                    : <button style={{width: 42, height: 28}}
                                              onClick={() => {
                                                  this.setGameSpeed(speed);
                                              }}>{{0: 'x1', 1: 'x2', 2: 'x5'}[index]}
                                </button>}
                            </span>
                })}

            </div>;


        const header_subcomponent =
            <div className="flex-element flex-container-row header">
                <div className="flex-element flex-container-row">
                    <div className="flex-element">
                        <h5>Years: {this.state.tick}k</h5>
                    </div>
                    <div className="flex-element">
                        <button className="btn btn-sm" onClick={()=> this.createPopup(state, chat_subcomponent)}>
                            History
                        </button>
                    </div>
                </div>

                <div className="flex-element">
                    {time_subcomponent}
                </div>

                <div className="flex-element flex-container-row">
                    <div className="upgrades-button">
                            <span className="flex-element" onClick={() =>{
                                if(this.state.music_paused)
                                {this.setState({music_paused: false})}
                                else{this.setState({music_paused: true})}
                            }}> Sound
                     <Orchestrator state={this.state}/></span>
                    </div>
                </div>
            </div>;

        const particles_subcomponent =
            <div className="resource-info flex-container-row flex-element">
                {_.map(state.space, (item, key) =>
                    <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                        <div style={{marginBottom:'10px'}}><img alt="" className="particle-icon" src={'./particles/particle.png'} /> </div>
                        <div style={{opacity:'0.6'}}>{data.basic_particles[key] ? data.basic_particles[key].name : 'resource'}</div>
                    </div>
                )}
            </div>;

        const atoms_subcomponent =
            <div className="resource-info flex-container-row flex-element">
                {_.map(state.dust, (item, key) =>
                    <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                        <div style={{marginBottom:'10px'}}><img alt="" className="particle-icon" src={'./atoms/'+key +'.png'} /> </div>
                        <div style={{opacity:'0.6'}}>{data.atoms[key] ? data.atoms[key].name : 'resource'}</div>
                    </div>
                )}
            </div>;

        const space_subcomponent =
                <div className="flex-container-row flex-element" style={{ paddingBottom: '5px', paddingTop: '5px'}}>
                    <span className="flex-element" style={{textAlign: 'left', fontWeight: 'bold'}}>Space</span>
                        {_.map(state.space, (item, key) =>
                                 <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                                       <div style={{textAlign:'center'}}>{state.space[key] ?
                                           this.roundNumber(state.space[key]) : '0'}
                                        </div>
                                    </div>
                        )}
                    {console.log(state)}
                </div>;

        const field_subcomponent =
                <div className="flex-element flex-container-row" style={{ paddingBottom: '5px', paddingTop: '5px'}}>
                    {_.map(state.field, (item, key) =>
                            <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                                <div style={{textAlign:'center'}}>{
                                    this.roundNumber(_.get(state.field, key))}
                                </div>
                            </div>
                    )}
                </div>;

        const upgrade_field_subcomponent =
            <div className="flex-element flex-container-row">
                <div className="flex-element" style={{fontSize: '12px'}}>
                    Load:
                    <Line percent={(weight(state.field)/state.field_capacity)*100}
                          trailWidth="3" trailColor="#a8a8a8" strokeWidth="3" strokeColor={(weight(state.field)/state.field_capacity)>=1 ? "red" : "#D3D3D3"}/>
                    <span className={state.field_capacity > weight(state.field) ? '' : 'red'}>
                {' ' + this.roundNumber(weight(state.field))} / {this.roundNumber(state.field_capacity)}
                    </span>
                </div>

                <div className="flex-element">
                 <OverlayTrigger delay={150} placement="right"
                                   overlay={tooltip(this.state, clickers.field)}>

                      <div className="flex-container-row upgrades-button">
                         <span className="flex-element">{state.field_level}</span>
                          <span style={state.field_level > 0
                              ? {borderTopRightRadius: "80px",
                                  borderBottomRightRadius: "80px"}
                              : {borderRadius: "80px"}}
                                className={(clickers.field.cost ? isEnough(this.state, _.isFunction(clickers.field.cost) ? clickers.field.cost(this.state) : clickers.field.cost) ? 'plus-span flex-element field' : 'plus-span flex-element field disabled' : 'plus-span flex-element field')}
                                onClick={() => {
                                    this.onClickWrapper(clickers.field);
                                }}>
                                 <span className="flex-element">Upgrade</span>
                            </span>
                               </div>
                </OverlayTrigger>
                </div>
            </div>;


        const dust_subcomponent =
            <div className="flex-element flex-container-row" style={{ paddingBottom: '5px', paddingTop: '5px'}}>
                <span className="flex-element" style={{textAlign: 'left', fontWeight: 'bold'}}>Dust</span>
                {_.map(state.dust, (item, key) =>
                    <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                        <div style={{textAlign:'center'}}>{state.dust[key] ?
                            this.roundNumber(state.dust[key]) : '0'}
                        </div>
                    </div>
                )}
            </div>;

        const storage_subcomponent =
            <div className="flex-element flex-container-row" style={{ paddingBottom: '5px', paddingTop: '5px'}}>
                {_.map(state.storage, (item, key) =>
                    <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                        <div style={{textAlign:'center'}}>{state.storage[key] ?
                            this.roundNumber(state.storage[key]) : '0'}
                        </div>
                    </div>
                )}
            </div>;


        const upgrade_storage_subcomponent =
            <div className="flex-element flex-container-row">
                <div className="flex-element" style={{fontSize: '12px'}}>
                    Load:
                    <Line percent={(weight(state.storage)/state.storage_capacity)*100}
                          trailWidth="3" trailColor="#a8a8a8" strokeWidth="3" strokeColor={(weight(state.storage)/state.storage_capacity)>=1 ? "red" : "#D3D3D3"}/>
                    <span className={state.storage_capacity > weight(state.storage) ? '' : 'red'}>
                {' ' + this.roundNumber(weight(state.storage))} / {this.roundNumber(state.storage_capacity)}
                    </span>
                </div>

                <div className="flex-element">
                 <OverlayTrigger delay={150} placement="right"
                                 overlay={tooltip(this.state, clickers.storage)}>
                    <div className="flex-container-row upgrades-button">
                         <span className="flex-element">{state.storage_level}</span>
                          <span style={state.storage_level > 0
                              ? {borderTopRightRadius: "80px",
                                  borderBottomRightRadius: "80px"}
                              : {borderRadius: "80px"}}
                                className={(clickers.storage.cost ? isEnough(this.state, _.isFunction(clickers.storage.cost) ? clickers.storage.cost(this.state) : clickers.storage.cost) ? 'plus-span flex-element field' : 'plus-span flex-element field disabled' : 'plus-span flex-element field')}
                                onClick={() => {
                                    this.onClickWrapper(clickers.storage);
                                }}>
                                 <span className="flex-element">Upgrade</span>
                            </span>
                               </div>
                </OverlayTrigger>
                </div>
            </div>;


        const modules_subcomponent =
                <div className="flex-element flex-container-row">
                        {_.map(fluctuators.modules, (item, key) =>
                            <div className="flex-element" key={key}>
                                {(item.locked && item.locked(this.state))
                                    ? <div className="flex-element"> </div>
                                    : <div>
                                        <OverlayTrigger delay={150} placement="right"
                                                        overlay={tooltip(this.state, item)}>
                                            <div className="fluctuators">
                                                <div className="item-name"> {item.name}</div>

                                                <div className="flex-container-row modules-button">
                                                    {state.modules[key] > 0
                                                        ? <span className="flex-element">{state.modules[key]}</span>
                                                        : ''}
                                                    <span style={state.modules[key] > 0
                                                        ? {borderTopRightRadius: "80px",
                                                            borderBottomRightRadius: "80px"}
                                                        : {borderRadius: "80px"}}
                                                        className={(item.cost ? isEnough(this.state, _.isFunction(item.cost) ? item.cost(this.state) : item.cost) ? 'flex-element plus-span' : 'flex-element plus-span disabled' : 'flex-element plus-span')}
                                                        onClick={() => {
                                                            this.onClickWrapper(item);
                                                        }}>
                                                        <span className="flex-element">
                                                        {state.modules[key] > 0
                                                            ? '+'
                                                            : <span>Buy</span>}
                                                        </span>
                                                    </span>
                                                </div>

                                                {(item.toggle && state.modules[key] > 0)
                                                    ?
                                                    <div className="switch">
                                                        <Switch onChange={() => this.setState(item.toggle(this.state))}
                                                                checked={this.state.toggle[key]} onColor="#d4d4d4" onHandleColor="#FFFFFF"
                                                                handleDiameter={8} uncheckedIcon={false} checkedIcon={false} height={4}
                                                                width={28}
                                                        />
                                                    </div>
                                                    : ''}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                }
                            </div>
                        )}
                </div>;


        const assemblers_subcomponent =
                <div className="flex-element flex-container-row">

                    {_.map(fluctuators.assemblers, (item, key) =>
                        <div className="flex-element" key={key}>
                            {(item.locked && item.locked(this.state))
                                ? <div className="flex-element"> </div>
                                : <div key={key}>
                                    <div style={{marginBottom:'10px'}}>
                                        {state.toggle[key] && state.assemblers[key]>0
                                            ?
                                        <Bubble /> : ''}

                                        <img alt="" className="particle-icon" src={'./atoms/'+ item.name +'.png'} />
                                    </div>

                                    <OverlayTrigger delay={150} placement="left"
                                                    overlay={tooltip(this.state, item)}>

                                        <div className="fluctuators">
                                            <div className="item-name"> {item.name}</div>

                                            <div className="flex-container-row modules-button">
                                                {state.assemblers[key] > 0
                                                    ? <span className="flex-element">{state.assemblers[key]}</span>
                                                    : ''}
                                                <span style={state.assemblers[key] > 0
                                                    ? {borderTopRightRadius: "80px",
                                                        borderBottomRightRadius: "80px"}
                                                    : {borderRadius: "80px"}}
                                                      className={(item.cost ? isEnough(this.state, _.isFunction(item.cost) ? item.cost(this.state) : item.cost) ? 'flex-element plus-span' : 'flex-element plus-span disabled' : 'flex-element plus-span')}
                                                      onClick={() => {
                                                          this.onClickWrapper(item);
                                                      }}>
                                                        <span className="flex-element">
                                                        {state.assemblers[key] > 0
                                                            ? '+'
                                                            : <span>Buy</span>}
                                                        </span>
                                                    </span>
                                            </div>
                                            {(item.toggle && state.assemblers[key] > 0)
                                                ?
                                                <div className="switch">
                                                    <Switch onChange={() => this.setState(item.toggle(this.state))}
                                                            checked={this.state.toggle[key]} onColor="#d4d4d4" onHandleColor="#FFFFFF"
                                                            handleDiameter={8} uncheckedIcon={false} checkedIcon={false} height={4}
                                                            width={28}
                                                    />
                                                </div>
                                                : ''}
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            }
                        </div>
                    )}
                    </div>;

        const chat_subcomponent =
            <div className="flex-element">
                <h3> History </h3>
                <div className="flex-container-column history info-block">
                    {_.map(state.chat, (item, key) =>
                        <div className="flex-element panel" key={key} style={{color: 'black'}}>
                            <p>{item.header} {item.text}</p>
                        </div>
                    )}
                </div>
            </div>;


        const object_drawer = (obj) =>
        <div>
            <h3> Object </h3>
            <div>
                <h4> {obj.name} </h4>
                <p>
                    {state.selected_system !== null ? state.systems[state.selected_system].name : ''}
                </p>
                <p>
                    Type: {obj.type}
                </p>
                {obj.temperature ? <p>
                    Temperature: {obj.temperature}
                </p> : ''}
                <p>
                    Mass: {weight(obj.mater)}
                </p>
                <p>
                    {drawCost(obj.mater)}
                </p>
                {obj.type === 'Proto-Planet' || obj.type === 'Planet' ?
                    <div>
                        <p>Life Forms probability: {calcLifeFormProbability(state, obj, state.systems[state.selected_system])}</p>
                        {_.map(obj.lifeforms, (lifeform, key) =>
                            <div key={key}>
                                Name: {lifeform.name} DNA: {lifeform.DNA}
                            </div>)}
                    </div> : ''}
            </div>
        </div>;

        const object_subcomponent = () => {
            if (state.selected_planet !== null) return object_drawer(state.systems[state.selected_system].planets[state.selected_planet]);
            if (state.selected_star !== null)   return object_drawer(state.systems[state.selected_system].stars[state.selected_star]);
            if (state.selected_system !== null) return object_drawer(state.systems[state.selected_system]);
            return '';
        };


        const systems_subcomponent =
            <div className="flex-element">
                {state.systems.length ?
                    <div className="flex-container-column">
                            {_.map(state.systems, (system, key) =>
                                <div onClick={() => {
                                    let state = this.state;
                                    state.selected_system = key;
                                    state.selected_star = null;
                                    state.selected_planet = null;
                                    this.setState(state);
                                }}
                                     className="flex-element system-selector" key={key}
                                     style={state.selected_system===key ? {backgroundColor:'rgba(255, 255, 255, 0.3)'} : {backgroundColor:'rgba(0,0,0,0.4)'}}>
                                    <span style={{display: 'block', textAlign:'left'}}>{system.name}</span>

                                    {_.map(state.systems[key].stars, (star, key) =>
                                            <Circle r={Math.sqrt(Math.sqrt(weight(star.mater) * 11))/10} fill={{color: 'white'}} stroke={{color: 'black'}} strokeWidth={3} />
                                    )}

                                </div>
                                )}
                    </div>
                    : ''
                }
            </div>;

        const terraformers_subcomponent =
            <div className="flex-element flex-container-row">
                {_.map(terraformers, (item, key) =>
                    <div className="flex-element" key={key}>
                        {(item.locked && item.locked(this.state))
                            ? <div className="flex-element"> </div>
                            : <div key={key}>
                            <OverlayTrigger delay={150} placement="left"
                                            overlay={tooltip(this.state, item)}>
                                <div className="fluctuators">
                                    <div className="item-name"> {item.name}</div>

                                    <div className="flex-container-row modules-button">
                                        {state.terraformers[key] > 0
                                            ? <span className="flex-element">{state.terraformers[key]}</span>
                                            : ''}
                                        <span style={state.terraformers[key] > 0
                                            ? {borderTopRightRadius: "80px",
                                            borderBottomRightRadius: "80px"}
                                            : {borderRadius: "80px"}}
                                              className={(item.cost ? isEnough(this.state, _.isFunction(item.cost) ? item.cost(this.state) : item.cost) ? 'flex-element plus-span' : 'flex-element plus-span disabled' : 'flex-element plus-span')}
                                              onClick={() => {
                                                  this.onClickWrapper(item);
                                              }}>
                                                        <span className="flex-element">
                                                        {state.terraformers[key] > 0
                                                            ? '+'
                                                            : <span>Buy</span>}
                                                        </span>
                                                    </span>
                                    </div>
                                    {(item.toggle && state.terraformers[key] > 0)
                                        ?
                                        <div>
                                            <Switch onChange={() => this.setState(item.toggle(this.state))}
                                                    checked={this.state.toggle[key]} onColor="#d4d4d4" onHandleColor="#FFFFFF"
                                                    handleDiameter={8} uncheckedIcon={false} checkedIcon={false} height={4}
                                                    width={28}
                                            />
                                        </div>
                                        : ''}
                                </div>
                            </OverlayTrigger>
                        </div>
                        }
                    </div>
                )}
            </div>;

        const sustem_subcomponent =
            <div className="flex-element flex-container-column">

                    {state.selected_system !== null ?
                        <div>
                        <div className="flex-element flex-container-row">
                            <h5 className="heading">Stars</h5>
                            {_.map(state.systems[state.selected_system].stars, (star, key) =>
                                    <div onClick={() => {
                                        let state = this.state;
                                        state.selected_star = key;
                                        state.selected_planet = null;
                                        this.setState(state);
                                    }}
                                         className="flex-element" key={key}>
                                        <p>{star.name}</p>
                                        <span><Circle r={Math.sqrt(Math.sqrt(weight(star.mater) * 11))} fill={{color: '#470407'}} stroke={{color: 'black'}} strokeWidth={3} /></span>

                                    </div>
                                )}
                        </div>

                        <div className="flex-element flex-container-row">
                            <h5 className="heading">Planets</h5>
                                {_.map(state.systems[state.selected_system].planets, (planet, key) =>
                                    <div onClick={() => {
                                        let state = this.state;
                                        state.selected_star = null;
                                        state.selected_planet = key;
                                        this.setState(state);
                                    }}
                                         className="flex-element" key={key}>
                                        <p>{planet.name}</p>
                                        <span key={key}><Circle r={Math.sqrt(Math.sqrt(weight(planet.mater) * 19))} fill={{color: 'indigo'}} stroke={{color: 'black'}} strokeWidth={3}/></span>
                                    </div>
                                )}
                        </div>
                        </div>: ''}
                </div>;


        const disclaimer =
            <div>
                <div className="panel" style={{color: 'black', margin: '100px', padding: '100px'}}>
                    <p>In the distant future, the Milky Way Galaxy and the nearest satellites are colonized. The expansion is stopped by intergalactic distances.</p>
                    <p>New directions of expansion were discovered by Star Engineering: the technology of creating stellar systems.</p>
                    <GinButton className="dialog-button" item={{
                        name:    'Start Game',
                        onClick: state => {
                            state.game_started = true;
                            return state;
                        }
                    }}/>
                    <p>Disclaimer: the game on the early stages of development, bugs are possible!</p>
                    <p>Developers will be grateful if in case of any problem you write to the Support.</p>
                </div>
            </div>;

        const select_difficulty =
            <div>
                <div className="panel-wrapper" style={{color: 'black', margin: '100px', padding: '100px'}}>
                    <h3>Select Difficulty</h3>
                    <div className="flex-container-row">
                        {_.map(difficulty, (val, key) =>
                            <div key={key} className="flex-element panel">
                                <img alt="" style={{width: '200px', height: '200px', border: '4px solid #B7B7B7'}} src={val.img} />
                                <p>{val.text}</p>
                                <GinButton className="dialog-button" item={val}/>
                            </div>)}
                    </div>
                </div>
            </div>;

        /* const basic_particles_info =
            <OverlayTrigger delay={250} placement="bottom" overlay={details(info.basic_particles)}>
                <img alt="" className="overlay resource-icon" src={"./img/basic_particles.png"}/>
            </OverlayTrigger>;

        const atoms_info =
            <OverlayTrigger delay={250} placement="bottom" overlay={details(info.atoms)}>
                <img alt="" className="overlay resource-icon" src={"./img/atoms.png"}/>
            </OverlayTrigger>;

        const automation_info =
            <OverlayTrigger delay={250} placement="bottom" overlay={details(info.automation)}>
                <img alt="" className="overlay resource-icon" src={"./img/automation.png"}/>
            </OverlayTrigger>;
            */

        return (
            <div>
                <div className="App">
                    {state.difficulty === false ?
                        state.game_started === false ? disclaimer : select_difficulty
                        :
                        <div className="wrapper">
                            <div className="flex-container-row">
                                <div className="flex-element">
                                    {header_subcomponent}
                                </div>
                            </div>

                            <div className="flex-container-row">
                                <div className="flex-element">
                                    <div className="flex-container-row">
                                        <div className="flex-element space-block">
                                            <div className="info-block">
                                                {particles_subcomponent}
                                                <div className="line"/>
                                                {field_subcomponent}
                                                {upgrade_field_subcomponent}
                                            </div>

                                            <div className="info-block">
                                                <h5 className="heading">Machinery</h5>
                                                {modules_subcomponent}
                                            </div>
                                        </div>
                                        <div className="flex-element dust-block">
                                            <div className="info-block">
                                                {atoms_subcomponent}
                                                <div className="line"/>
                                                {storage_subcomponent}
                                                {upgrade_storage_subcomponent}
                                            </div>

                                            <div className="info-block">
                                                <h5 className="heading">Assemblers</h5>
                                                {assemblers_subcomponent}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="flex-element flex-container-row">
                                        <div className="flex-element systems-block">
                                            <div className="flex-container-row">
                                            <h3 className="flex-element tab-title">Galaxy</h3>
                                            <div className="flex-element"><GinButton item={rules.new_system}/></div>
                                            </div>

                                            {systems_subcomponent}
                                        </div>

                                        <div className="flex-element info-block current-system">
                                            <h5 className="heading">Terraformers</h5>
                                            {terraformers_subcomponent}
                                            <h5 className="heading">Selected System</h5>
                                            {sustem_subcomponent}
                                        </div>
                                    </div>

                                </div>

                                <div className="flex-container-row flex-element info-container">
                                            <div className="flex-element">
                                                <h4>Information</h4>
                                                    {object_subcomponent()}
                                            </div>
                                </div>
                            </div>

                            <Popup ref={(p) => this.popupHandler = p}/>

                            <div style={{height: '130px', width: '100%'}}> </div>

                        </div>
                    }
                </div>
                <Footer newGame={this.newGame}/>
            </div>);
    }
}

export default App;
