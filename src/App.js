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
import {data, info, epochs} from './game/data';
import {oneclickers} from './game/oneclickers';
import {clickers} from './game/clickers';
import {fluctuators} from './game/fluctuators';
import {difficulty} from './game/difficulty';
import Popup from "./utils/Popup/Popup";
import {Line} from 'rc-progress';
import {Circle} from 'react-shapes';
import Switch from "react-switch";


import { Orchestrator } from './game/orchestrator';

import {ToastContainer} from 'react-toastr';
import confirm from './components/confirm_launch';
import toastr from "toastr";

import {weight} from './game/physics';
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
                <button style={{padding: '4px 4px', width: '30%'}}
                        className={(item.isDisabled && item.isDisabled(this.state)) ? 'disabled' : (item.cost ? isEnough(this.state, item.cost) ? '' : 'disabled' : '')}
                        onClick={() => {
                            this.onClickWrapper(item);
                        }}>
                    {item.name}
                </button>
        };

        const details = (item) =>
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

                    {_.map(_.isFunction(item.cost) ? item.cost(this.state) : item.cost, (value, resource_key) =>
                        (!item.cost)
                            ? ''
                            :
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
                {[1, 4, 16].map((speed, index) => {
                    return <span key={index}>
                                {this.state.game_speed_multiplier === speed
                                    ? <button className="" style={{width: 42, height: 28}}>
                                    <u>{{0: 'x1', 1: 'x4', 2: 'x16'}[index]}</u></button>
                                    : <button style={{width: 42, height: 28}}
                                              onClick={() => {
                                                  this.setGameSpeed(speed);
                                              }}>{{0: 'x1', 1: 'x4', 2: 'x16'}[index]}
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
                    <span className="flex-element" onClick={() =>
                        this.state.music_paused ? this.state.music_paused=false : this.state.music_paused=true}> Sound
                     <Orchestrator state={this.state}/></span>
                </div>
            </div>;

        const particles_subcomponent =
            <div className="flex-container-row flex-element" style={{ paddingBottom: '5px', paddingTop: '5px'}}>
                <span className="flex-element"> </span>
                {_.map(state.space, (item, key) =>
                    <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                       {data.basic_particles[key] ? data.basic_particles[key].name : 'resource'}
                    </div>
                )}
            </div>;

        const atoms_subcomponent =
            <div className="flex-container-row flex-element" style={{ paddingBottom: '5px', paddingTop: '5px'}}>
                <span className="flex-element"> </span>
                {_.map(state.dust, (item, key) =>
                    <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                        {data.atoms[key] ? data.atoms[key].name : 'resource'}
                    </div>
                )}
            </div>;

        const space_subcomponent =
                <div className="flex-container-row flex-element" style={{ paddingBottom: '5px', paddingTop: '5px'}}>
                    <span className="flex-element" style={{textAlign: 'left'}}>Space</span>
                        {_.map(state.space, (item, key) =>
                                 <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                                       <div style={{textAlign:'center'}}>{state.space[key] ?
                                           this.roundNumber(state.space[key]) : '0'}
                                        </div>
                                    </div>
                        )}
                </div>;

        const field_subcomponent =
                <div className="flex-element flex-container-row" style={{ paddingBottom: '5px', paddingTop: '5px'}}>
                    <span className="flex-element" style={{textAlign: 'left'}}>Field</span>
                    {_.map(state.field, (item, key) =>
                            <div className="flex-element clickers" style={{textAlign: 'center'}} key={key}>
                                <div style={{textAlign:'center'}}>{state.field[key] ?
                                    this.roundNumber(state.field[key]) : '0'}
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
                                className={(clickers.field.cost ? isEnough(this.state, _.isFunction(clickers.field.cost) ? clickers.field.cost(this.state) : clickers.field.cost) ? 'flex-element field' : 'flex-element field disabled' : 'flex-element field')}
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
                <span className="flex-element" style={{textAlign: 'left'}}>Dust</span>
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
                <span className="flex-element" style={{textAlign: 'left'}}>Storage</span>
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
                                                <div> {item.name}</div>

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


        const assemblers_subcomponent =
                <div className="flex-element flex-container-row">
                    {_.map(fluctuators.assemblers, (item, key) =>
                        <div className="flex-element" key={key}>
                            {(item.locked && item.locked(this.state))
                                ? <div className="flex-element"> </div>
                                : <div key={key}>
                                    <OverlayTrigger delay={150} placement="left"
                                                    overlay={tooltip(this.state, item)}>
                                        <div className="fluctuators">
                                            <div> {item.name}</div>

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

        const rules_subcomponent =
        <div className="flex-container-column">
            <h3>Rules</h3>
            <div className="info-block">
            {_.map(rules, (item, key) => (item.locked && item.locked(this.state))
                ? ''
                :
                item.name
                ?
                    <div key={key} className="flex-container-column-reverse">
                <div className="panel" key={key} style={{color: 'black'}}>
                    <h5>{item.name}</h5>
                    <p>{item.text}</p>
                </div>
                    </div>: '')}
            </div>
        </div>;


        const object_drawer = (obj) =>
        <div>
            <h3> Object </h3>
            <div className="panel info-block" style={{color: 'black'}}>
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
                        <div className="info-block">
                            {_.map(state.systems, (system, key) =>
                                <div onClick={() => {
                                    let state = this.state;
                                    state.selected_system = key;
                                    state.selected_star = null;
                                    state.selected_planet = null;
                                    this.setState(state);
                                }}
                                     className="flex-element panel" key={key} style={{color: 'black'}}>
                                    <p>{system.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    : ''
                }
            </div>;

        const sustem_subcomponent =
            <div className="flex-element flex-container-row">

                <div className="flex-element">
                    {state.selected_system !== null ?
                        <div className="flex-element">
                            <div className="flex-container-row">
                            {_.map(state.systems[state.selected_system].stars, (star, key) =>
                                    <div onClick={() => {
                                        let state = this.state;
                                        state.selected_star = key;
                                        state.selected_planet = null;
                                        this.setState(state);
                                    }}
                                         className="flex-element panel" key={key} style={{color: 'black'}}>
                                        <p>{star.name}</p>
                                        <span><Circle r={Math.sqrt(weight(star.mater))/9} fill={{color: '#470407'}} stroke={{color: 'black'}} strokeWidth={3} /></span>

                                    </div>
                                )}
                                {_.map(state.systems[state.selected_system].planets, (planet, key) =>
                                    <div onClick={() => {
                                        let state = this.state;
                                        state.selected_star = null;
                                        state.selected_planet = key;
                                        this.setState(state);
                                    }}
                                         className="flex-element panel" key={key} style={{color: 'black'}}>
                                        <p>{planet.name}</p>
                                        <span key={key}><Circle r={Math.sqrt(weight(planet.mater))/7} fill={{color: 'indigo'}} stroke={{color: 'black'}} strokeWidth={3}/></span>
                                    </div>
                                )}
                            </div>
                        </div> : ''}
                </div>
            </div>;

        const molecules_arts = <div>
             <ul className='atoms set'>
                 <li className='atom O'></li>
                 <li className='atom H'></li>
                 <li className='atom C'></li>
                 <li className='atom N'></li>
                 <li className='atom Cl'></li>
             </ul>
             <ul className='molecules set'>
                 <li className='molecule-wrap'>
                     <div className='info'>water (H<sub>2</sub>O)</div>
                     <ul className='molecule H2O'>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom O'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>carbon dioxide (CO<sub>2</sub>)</div>
                     <ul className='molecule CO2'>
                         <li className='atom C'></li>
                         <li className='atom O'></li>
                         <li className='atom O'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>hydrogen cyanide (HCN)</div>
                     <ul className='molecule HCN'>
                         <li className='atom H'></li>
                         <li className='atom C'></li>
                         <li className='atom N'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>ammonia (NH<sub>3</sub>)</div>
                     <ul className='molecule NH3'>
                         <li className='atom N'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>methane (CH<sub>4</sub>)</div>
                     <ul className='molecule CH4'>
                         <li className='atom C'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>formaldehyde (CH<sub>2</sub>O)</div>
                     <ul className='molecule CH2O'>
                         <li className='atom C'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom O'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>carbon tetrachloride (CCl<sub>4</sub>)</div>
                     <ul className='molecule CCl4'>
                         <li className='atom C'></li>
                         <li className='atom Cl'></li>
                         <li className='atom Cl'></li>
                         <li className='atom Cl'></li>
                         <li className='atom Cl'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>methyl chloride (CH<sub>3</sub>Cl)</div>
                     <ul className='molecule CH3Cl'>
                         <li className='atom C'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom Cl'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>acetylene (C<sub>2</sub>H<sub>2</sub>)</div>
                     <ul className='molecule C2H2'>
                         <li className='atom C'></li>
                         <li className='atom C'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>ethylene (C<sub>2</sub>H<sub>4)</sub></div>
                     <ul className='molecule C2H4'>
                         <li className='atom C'></li>
                         <li className='atom C'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                     </ul>
                 </li>
                 <li className='molecule-wrap'>
                     <div className='info'>ethane (C<sub>2</sub>H<sub>6)</sub></div>
                     <ul className='molecule C2H6'>
                         <li className='atom C'></li>
                         <li className='atom C'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                         <li className='atom H'></li>
                     </ul>
                 </li>
             </ul></div>;

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
                                <img style={{width: '200px', height: '200px', border: '4px solid #B7B7B7'}} src={val.img} />
                                <p>{val.text}</p>
                                <GinButton className="dialog-button" item={val}/>
                            </div>)}
                    </div>
                </div>
            </div>;

        const basic_particles_info =
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
                                            {space_subcomponent}
                                             <div className="line" />
                                            {field_subcomponent}
                                            {upgrade_field_subcomponent}
                                            </div>

                                            <div className="info-block">
                                            <h4>{automation_info} Machinery</h4>
                                            {modules_subcomponent}
                                            </div>
                                        </div>
                                        <div className="flex-element dust-block">
                                            <div className="info-block">
                                            {atoms_subcomponent}
                                            {dust_subcomponent}
                                            <div className="line" />
                                            {storage_subcomponent}
                                            {upgrade_storage_subcomponent}
                                            </div>

                                            <div className="info-block">
                                            <h4>{automation_info} Assemblers</h4>
                                            {assemblers_subcomponent}
                                            </div>
                                        </div>
                                        <div className="flex-element">
                                            <h4>Systems</h4>
                                            {systems_subcomponent}
                                            <div>
                                                <GinButton item={rules.new_system}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-container-column">
                                        <div className="flex-element">
                                            <h4>Selected System</h4>
                                            {sustem_subcomponent}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-container-row flex-element info-container">
                                            <div className="flex-element">
                                                <h4>Info</h4>
                                                    {object_subcomponent()}
                                            </div>
                                </div>
                            </div>

                            <Popup ref={(p) => this.popupHandler = p}/>

                            <div style={{height: '130px', width: '100%'}}></div>

                        </div>
                    }
                </div>
                <Footer newGame={this.newGame}/>
            </div>);
    }
}

export default App;
