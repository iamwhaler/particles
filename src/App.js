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
import Popup from "./utils/Popup/Popup";
import {Circle} from 'react-shapes';

import { Orchestrator } from './game/orchestrator';

import {ToastContainer} from 'react-toastr';
import confirm from './components/confirm_launch';
import toastr from "toastr";

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

                toastr.info("Your universe is cooling down, please wait a little", 'Welcome to the Game!', {
                    timeOut:           15000,
                    closeButton:       true,
                    preventDuplicates: true,
                    extendedTimeOut:   15000,
                    escapeHtml:        false
                });
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

    /*
    drawCost(cost) {
        let text = '';
        _.each(cost, (value, resource) => {
            if (value > 0) {
                text += resource + ': ' + value + ' ';
            }
        });
        return text;
    }

    isEnough(state, cost) {
        let enough = true;
        _.each(cost, (value, resource_key) => {
            if (_.get(state, resource_key) < value) enough = false;
        });
        return enough;
    }

    chargeCost(state, cost) {
        if (!this.isEnough(state, cost)) return false;
        _.each(cost, (value, resource_key) => {
            let result = _.get(state, resource_key) - value;
            _.set(state, resource_key, result);
        });
        return state;
    }
    */

    createPopup(state, component) {
        //TODO REMOVE Used only for demonstrational purposes
        this.info = "Your universe size:" + state.universe_size;
        this.popupHandler.createPopup(`${this.info}`, component);
    }


    roundNumber(number) {
        let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
            decimal;

        for(let i=units.length-1; i>=0; i--) {
            decimal = Math.pow(1000, i+1);

            if(number <= -decimal || number >= decimal) {
                return +(number / decimal).toFixed(4) + units[i];
            }
        }
        return Math.round(number);
    }


    render() {
        let state = this.state;
        let gradient = (state) => {
            if (state.temperature < 10000) {
                return '127'
            }
            else {
                return '0'
            }
        };

        const temperatureStyle = {
            color: 'rgb(' + state.temperature / 100 + ',' + gradient(state) + ', 0)'
        };

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
                <div>
                    <div className="flex-container-column">
                        <div className="flex-container-row">
                            <div className="flex-element">
                                <span>{!item.name ? '' :item.name }</span>
                            </div>
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

                    {item.temperature_effect
                        ?
                        <div className="row temperature_effect">
                            <div className="col-sm-6 infoBar">Temperature effect</div>
                            <div className="col-sm-6 infoBar">
                                <span className="glyphicon glyphicon-arrow-up"> </span> {item.temperature_effect(state)}
                            </div>
                        </div>
                        : ''
                    }

                </div>
                </div>
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


        const temperature_subcomponent =
            <div className="flex-element flex-container-row">
                <h5 className="flex-element"
                    style={temperatureStyle}>
                    Temperature: {Math.floor(state.temperature)} K
                </h5>
            </div>;

        const header_subcomponent =
            <div className="flex-element flex-container-row header">
                <div className="flex-element">
                    {temperature_subcomponent}
                </div>

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
                        this.state.music_paused ? this.state.music_paused=false : this.state.music_paused=true
                    }> Sound
                     <Orchestrator state={this.state}/></span>
                </div>
            </div>;


        const space_subcomponent =
            <div className="flex-element">
                <div className="flex-container-row" style={{maxWidth: '250px', paddingBottom: '5px', paddingTop: '5px'}}>
                    <div className="flex-container-column info-block">
                        {_.map(state.space, (item, key) =>
                            <div className="flex-container-row" key={key}>

                                    <div className="clickers">
                                            <div className="flex-element" style={{textAlign: 'left'}} key={key}>
                                                            <span className="flex-element">
                                                            {data.basic_particles[key] ? data.basic_particles[key].name : 'resource'}: {state.space[key] ?
                                                                this.roundNumber(state.space[key]) : 'quantity'}
                                                            </span>
                                            </div>
                                    </div>

                                    <div>
                                        <OverlayTrigger delay={150} placement="right"
                                                        overlay={tooltip(this.state, item)} trigger="focus">
                                            <div>
                                                <button className="info">
                                                    i
                                                </button>
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>;

        const field_subcomponent =
                <div className="flex-element flex-container-row" style={{maxWidth: '250px', paddingBottom: '5px', paddingTop: '5px'}}>
                    <div className="flex-container-column info-block">
                        {_.map(state.field, (item, key) =>
                            <div className="flex-container-row" key={key}>
                                <div className="clickers flex-element" style={{textAlign: 'left'}}>
                                    {data.basic_particles[key] ? data.basic_particles[key].name : 'resource'}: {state.field[key] ?
                                        this.roundNumber(state.field[key]) : '0'}
                                </div>
                                <div>
                                    <OverlayTrigger delay={150} placement="right"
                                                    overlay={tooltip(this.state, {name: key})} trigger="focus">
                                            <button className="info">
                                                i
                                            </button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        )}
                    </div></div>;

        const dust_subcomponent =
            <div className="flex-element">
                <div className="flex-container-row info-block" style={{maxWidth: '250px', paddingBottom: '5px', paddingTop: '5px'}}>
                    <div className="flex-container-column">
                        {_.map(state.dust, (item, key) =>
                            <div className="flex-container-row  clickers" key={key}>
                                    <div className="flex-element" style={{textAlign: 'left'}} key={key}>
                                        {data.atoms[key] ? data.atoms[key].name : 'resource'}: {state.dust[key] ?
                                            this.roundNumber(state.dust[key]) : '0'}
                                    </div>

                                <div>
                                    <OverlayTrigger delay={150} trigger="focus" placement="right"
                                                    overlay={tooltip(this.state, {name: item})}>
                                            <button className="info">
                                                i
                                            </button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>;

        const storage_subcomponent =
            <div className="flex-element">
                <div className="flex-container-row info-block" style={{maxWidth: '250px', paddingBottom: '5px', paddingTop: '5px'}}>
                    <div className="flex-container-column">
                        {_.map(state.storage, (item, key) =>
                            <div className="flex-container-row clickers" key={key}>
                                    <div className="flex-element" style={{textAlign: 'left'}} key={key}>
                                        {data.atoms[key] ? data.atoms[key].name : 'resource'}: {state.storage[key] ?
                                            this.roundNumber(state.storage[key]) : '0'}
                                    </div>

                                <div>
                                    <OverlayTrigger delay={150} trigger="focus" placement="right"
                                                    overlay={tooltip(this.state, item)}>
                                            <button className="info">
                                                i
                                            </button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>;


        const modules_subcomponent =
            <div className="flex-element">
                <div className="flex-container-column info-block">
                        {_.map(fluctuators.modules, (item, key) =>
                            <div key={key}>
                                {(item.locked && item.locked(this.state))
                                    ? <div className="flex-element"> </div>
                                    : <div className="flex-container-row automation">
                                        <OverlayTrigger delay={150} placement="left"
                                                        overlay={tooltip(this.state, item)}>
                                            <div className="flex-element fluctuators">
                                                <button //style={{minWidth: '50px', maxHeight: '110px'}}
                                                        className={(item.cost ? isEnough(this.state, _.isFunction(item.cost) ? item.cost(this.state) : item.cost) ? '' : 'disabled' : '')}
                                                        onClick={() => {
                                                            this.onClickWrapper(item);
                                                        }}>
                                                <span>
                                                    {state[key] > 0
                                                        ? 'Upgrade'
                                                        : 'Buy'}
                                                </span>
                                                </button>
                                                {(item.toggle && state[key] > 0)
                                                    ?
                                                    <button className={state.toggle[key] ? 'switchOn' : ''}
                                                            onClick={() => this.setState(item.toggle(this.state))}>{state.toggle[key] ? 'Off' : 'On'}</button>
                                                    : ''}
                                                <span> {item.name}: {state[key]} </span>
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                }
                            </div>
                        )}
                </div>
            </div>;


        const assemblers_subcomponent =
            <div className="flex-element">
                <div className="flex-container-column info-block">
                    {_.map(fluctuators.assemblers, (item, key) =>
                        <div key={key}>
                            {(item.locked && item.locked(this.state))
                                ? <div className="flex-element"> </div>
                                : <div className="flex-container-row automation">
                                    <OverlayTrigger delay={150} placement="left"
                                                    overlay={tooltip(this.state, item)}>
                                        <div className="flex-element fluctuators">
                                            <button //style={{minWidth: '40px', maxHeight: '110px'}}
                                                    className={(item.cost ? isEnough(this.state, _.isFunction(item.cost) ? item.cost(this.state) : item.cost) ? '' : 'disabled' : '')}
                                                    onClick={() => {
                                                        this.onClickWrapper(item);
                                                    }}>
                                                <span>
                                                    {state.assemblers[key]>0
                                                        ? 'Upgrade' : 'Buy'}
                                                </span>
                                            </button>
                                            {(item.toggle && state.assemblers[key] > 0)
                                                ?
                                                <button className={state.toggle[key] ? 'switchOn' : ''}
                                                        onClick={() => this.setState(item.toggle(this.state))}>{state.toggle[key] ? 'Off' : 'On'}</button>
                                                : ''}
                                            <span> {item.name + ': ' + state.assemblers[key]} </span>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            }
                        </div>
                    )}
                </div>
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
                                        {_.map(planet.mater, (item, key)=>{
                                            let sum = 0;
                                            sum+=item;
                                            if(sum>100) {
                                                sum = sum / 1000000;
                                            }

                                           return <Circle r={sum} fill={{color: 'indigo'}} stroke={{color: 'black'}} strokeWidth={3}/>
                                        })}
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
                <p>Particles: the game about music, nuclear and quantum physics, astronomy and evolution.</p>
                <p>We want to create a kind of simulation-encyclopedia.</p>
                <GinButton item={{
                    name:    'Start Game',
                    onClick: state => {
                        state.game_started = true;
                        state.game_paused = false;
                        return state;
                    }
                }}/>
                <p>Disclaimer the game on the early stages of development, bugs are possible!</p>
                <p>Developers will be grateful if in case of any problem you write to the Support.</p>
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
                    {!state.game_started ? disclaimer
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
                                        <div className="flex-element">
                                            <h4>{basic_particles_info} Space</h4>
                                            {space_subcomponent}

                                            <h4>{atoms_info} Dust</h4>
                                            {dust_subcomponent}
                                        </div>
                                        <div className="flex-element">
                                            <h4>{basic_particles_info} Field</h4>
                                            {field_subcomponent}
                                            <h4>{atoms_info} Storage</h4>
                                            {storage_subcomponent}
                                        </div>
                                        <div className="flex-element">
                                            <h4>{automation_info} Machinery</h4>
                                            {modules_subcomponent}
                                            <h4>{automation_info} Assemblers</h4>
                                            {assemblers_subcomponent}
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
