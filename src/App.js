import React, {Component} from 'react';
import {Circle} from 'react-shapes';
import { Line, Circle as ProgressCircle}  from 'rc-progress';
import classNames from 'classnames';
import _ from 'lodash';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import Footer from './footer.js'

import './css/App.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {game_name} from './game/app_config';
import {getDefaultState} from './game/default_state';
import {tick} from './game/tick';
import {data, info} from './game/data';
import {oneclickers} from './game/oneclickers';
import {clickers} from './game/clickers';
import {automators} from './game/automators';
//import Popup from "./utils/Popup/Popup";

import {ToastContainer} from 'react-toastr';
import confirm, {startGame} from './components/confirm_launch';
import toastr from "toastr";




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
        console.log('App '+game_name+' componentDidMount');
        var app_state = JSON.parse(localStorage.getItem(game_name+"_app_state"));
        if(!app_state) {
            getDefaultState();
            this.state.universe_name = prompt('Enter your universe name');
        }
        else {this.setState(app_state)}
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
                localStorage.setItem(game_name+"_app_state", null);
                let new_state = getDefaultState();
                new_state.chat.unshift({header: "Welcome to the Game!", text: "Your universe is cooling down, please wait a little"});
                this.setState(new_state);
                this.playGame(new_state.game_speed_multiplier);
                this.state.universe_name = prompt('Enter your universe name');

                toastr.info("Your universe is cooling down, please wait a little", 'Welcome to the Game!', {
                    timeOut: 15000,
                    closeButton: true,
                    preventDuplicates: true,
                    extendedTimeOut: 15000,
                    escapeHtml: false
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
            if (this.isEnough(this.state, cost)) {
                if (item.onClick) this.setState(item.onClick(this.chargeCost(this.state, cost)));
            }
            else {
                return false;
            }
        }
        else {
            if (item.onClick) this.setState(item.onClick(this.state));
        }
    }

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
        if (!this.isEnough(this.state, cost)) return false;
        _.each(cost, (value, resource_key) => {
            state[resource_key] -= value;
        });
        return state;
    }

    createPopup() {
        //TODO REMOVE Used only for demonstrational purposes
        if (!this.i) {
            this.i = 0;
        }
        this.i = ++this.i;
        this.popupHandler.createPopup(`POPUP №${this.i}`, <div>{'This is... You guessed it. A POPUP!!!'}</div>);
    }

    render() {
            let state = this.state;
            let gradient = (state) => {
               if(state.temperature<10000) {
                   return '127'
               }
                   else {return '0'}
            };

            const temperatureStyle = {
                color: 'rgb('+state.temperature/100+',' + gradient(state) + ', 0)'
            };




            const starTooltip = (state, item) =>
                (item.star.type==='Hydrogen')
                    ?
                    (item)
                            ?
                            <Tooltip id="tooltip">
                                <div className="flex-container-column infoBar">
                                    <div className="flex element">
                                        <div className="col-md infoBar">
                                            <h6>{item.star.name}</h6>
                                        </div>

                                        <div className="col-md infoBar">
                                            Old: {this.state.tick-item.star.born}
                                        </div>

                                        <div className="col-md infoBar">
                                            Hydrogen: {item.star.hydrogen.toFixed(0)}
                                        </div>
                                        <div className="col-md infoBar">
                                            Carbon: {item.star.carbon.toFixed(0)}
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>
                        : ''
                    :
                    (item.star.type==='Helium')
                ?
                        (item)
                            ?
                            <Tooltip id="tooltip">
                                <div className="flex-container-column infoBar">
                                    <div className="flex element">
                                        <div className="col-md infoBar">
                                            <h6>{item.star.name}</h6>
                                        </div>

                                        <div className="col-md infoBar">
                                            Old: {this.state.tick-item.star.born}
                                        </div>

                                        <div className="col-md infoBar">
                                            Helium: {item.star.helium.toFixed(0)}
                                        </div>
                                        <div className="col-md infoBar">
                                            Nitrogen: {item.star.nitrogen.toFixed(0)}
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>
                            : ''
                        : '';

            const details = (item) =>
                <Tooltip id="tooltip">
                    <div className="flex-container-row">
                        <div className="flex-element flex-container-column">
                            <img src={item.image} alt="tooltip illustration" style={{marginLeft: '20px', width: '60px', height: '70px'}} />
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
                        <div className="flex-container-row">
                            <div className="flex-element">
                                <span>{item.name}</span>
                                <br/>
                                {(!item.text)
                                    ? ''
                                    :
                                <span style={{fontSize: '11px'}}> {item.text ? item.text : ''}</span>}
                            </div>
                        </div>



                    {_.map(_.isFunction(item.cost) ? item.cost(this.state) : item.cost, (value, resource_key) =>
                        (!item.cost)
                            ? ''
                            :
                            <div className="row" key={resource_key}>
                                <div className="col-sm-6 infoBar">{resource_key}</div>
                                    <div className="col-sm-6 infoBar"
                                         style={(value > state[resource_key]) ? {color: '#982727'} : {color: ''}}>
                                        {value} / {state[resource_key].toFixed(0)} {(value > state[resource_key]) ?
                                        <p>({-(state[resource_key] - value).toFixed(0)} left)</p> : ''}
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


                </Tooltip>;


            const universe_component =
                <div className="flex-container-column">
                    <div className="flex-container-row">
                        <div className="flex-element">
                             <div className="universe-size">
                            <Line strokeColor='#83B18F' percent={state.universe_size} />
                            <span style={{fontSize: '10px'}}>Expansion index: {state.universe_level}</span>
                            </div>
                        </div>
                        <div className="flex-element">
                            {state.universe_name}
                        </div>
                    </div>
                </div>;

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
                <div className="flex-container-row">
                    <h5 className="flex-element"
                        style={temperatureStyle}>
                        Temperature: {Math.floor(state.temperature).toFixed(0)} K
                    </h5>
                    <div className="flex-element">
                        <h5>Years: {this.state.tick}k</h5>
                    </div>
                </div>;


            const basic_particles_subcomponent =
                    <div className="flex-element">

                    <OverlayTrigger delay={250} placement="bottom" overlay={details(info.basic_particles)}>
                        <img alt="" className="overlay resource-icon" src={"./img/basic_particles.png"}/>
                    </OverlayTrigger>

                    <div className="flex-container-row resource-tab" style={{maxWidth: '250px', paddingBottom: '5px', paddingTop: '5px'}}>

                        <div className="flex-container-column">
                            {_.map(data.basic_particles, (item, key) =>
                                (item.locked && item.locked(this.state))
                                    ? <div className="flex-element" key={key}> </div>
                                    :
                                    <div className="flex-element" style={{width: '150px', textAlign: 'left'}} key={key}>
                                        <span className="flex-element">{item.name}: {state[key].toFixed(0)}</span>
                                    </div>
                            )}
                        </div>

                        <div className="flex-container-column clickers">
                            {_.map(clickers.basic_particles, (item, key) =>
                                    <div key={key}>
                                        {(item.locked && item.locked(this.state))
                                            ? <div className="flex-element"> </div>
                                            :
                                            <OverlayTrigger delay={150} placement="top"
                                                            overlay={tooltip(this.state, item)}>
                                                <div>
                                                    <button
                                                        className={(item.cost ? this.isEnough(this.state, item.cost) ? 'clickers' : 'clickers disabled' : 'clickers')}
                                                        onClick={() => {
                                                            this.onClickWrapper(item);
                                                        }}>
                                                        +1
                                                    </button>


                                                    {(state.micro_swiper)
                                                        ?
                                                        <button
                                                            className={(item.cost ? this.isEnough(this.state, item.cost) ? 'clickers' : 'clickers disabled' : 'clickers')}
                                                            onClick={() => {
                                                                for (let i = 0; i < 5; i++) {
                                                                    this.onClickWrapper(item)
                                                                }
                                                            }}>
                                                            +5
                                                        </button>
                                                        : ''
                                                    }
                                                </div>
                                            </OverlayTrigger>
                                        }
                                    </div>
                            )}
                        </div>

                    </div>
                </div>;

            const atoms_subcomponent =
                <div className="flex-element">
                    <OverlayTrigger delay={250} placement="bottom" overlay={details(info.atoms)}>
                    <img alt="" className="overlay resource-icon" src={"./img/atoms.png"}/>
                    </OverlayTrigger>

                    <div className="flex-container-row resource-tab" style={{maxWidth: '250px', paddingBottom: '5px', paddingTop: '5px'}}>

                        <div className="flex-container-column">
                            {_.map(data.atoms, (item, key) =>
                                (item.locked && item.locked(this.state))
                                    ? <div className="flex-element" key={key}> </div>
                                    :
                                    <div className="flex-element" style={{width: '150px', textAlign: 'left'}} key={key}>
                                        <span className="flex-element">{item.name}: {state[key].toFixed(0)}</span>
                                    </div>
                            )}
                        </div>

                        <div className="flex-container-column clickers">
                            {_.map(clickers.atoms, (item, key) =>
                                (item.locked && item.locked(this.state))
                                    ? <div className="flex-element" key={key}> </div>
                                    :
                                    <div key={key}>
                                        <OverlayTrigger delay={150} placement="right"
                                                        overlay={tooltip(this.state, item)}>
                                            <button
                                                className={(item.cost ? this.isEnough(this.state, item.cost) ? 'clickers' : 'clickers disabled' : 'clickers')}
                                                onClick={() => {
                                                    this.onClickWrapper(item);
                                                }}>
                                                +1
                                            </button>
                                        </OverlayTrigger>
                                    </div>
                            )}
                        </div>

                    </div>
                </div>;

            const simple_molecules_subcomponent =
                <div className="flex-element">
                    <OverlayTrigger delay={250} placement="bottom" overlay={details(info.simple_molecules)}>
                    <img alt="" className="overlay resource-icon" src={"./img/simple_molecules.png"}/>
                    </OverlayTrigger>
                    <div>
                        {_.map(data.simple_molecules, (item, key) =>
                            (item.locked && item.locked(this.state))
                                ? ''
                                :
                                <div className="flex-element" key={key}>
                                            <span className="flex-element">
                                        {item.name}: {state[key].toFixed(2)}
                                            </span>
                                </div>
                        )}
                    </div>
                </div>;

            const your_stars_subcomponent =
                <div className="flex-element">
                    <h3>Stars</h3>
                    <img alt="" className="overlay star-icon" src={"./img/star.png"}/>
                <div className="flex-element">
                    <span style={{textAlign: 'right', fontSize: '8px'}}> Your stars: {state.stars.length} </span>
                    {_.map(data.stars, (item, key) =>
                        <div className="flex-element" key={key}>
                            {item.name}: <ProgressCircle trailWidth={3} style=
                                                             {{width: '20px',
                                                                 height: '20px'
                                                             }}
                                                         percent={state[key] * 100} strokeWidth="9"
                                                         strokeColor={"#4E4E9A"}/>
                        </div>
                    )}

                    <div className="your-stars">
                        {_.map(state.stars, (item, key) =>
                            (item) ?
                                <div key={key} style={{border: '0px solid #BDBDBD'}} className="flex-container-row">
                                    <OverlayTrigger delay={150} placement="top"
                                                    overlay={starTooltip(this.state, item)}>
                                        <div className="flex-element star-circle">
                                            <Circle className="overlay" r={1 + item.star.mass/4} fill={{color: '#4E4E9A'}}
                                                    stroke={{color: item.star.color}} strokeWidth={4}/>
                                        </div>
                                    </OverlayTrigger>

                                    <div className="flex-element">
                                        {item.star.name}
                                        <br/>
                                        Type: {item.star.type}
                                        <br/>
                                        Mass: {item.star.mass.toFixed(2)}
                                    </div>
                                </div>
                                : ''
                        )}
                    </div>
                </div>
                </div>;

            const synthesizers_subcomponent =
                <div className="flex-element">
                    <h3>Synthesizers</h3>
                    <img alt="" className="overlay" src={"./img/automation.png"}
                         style={{width: '25px', height: '25px'}}/>
                    <div className="flex-container-row">
                        <div className="flex-element">
                            {_.map(automators.miners, (item, key) =>
                                (item.locked && item.locked(this.state))
                                    ? ''
                                    : <div key={key} className="flex-container-row automation">
                                    <div className="flex-element" style={{textAlign: 'left'}}>
                                        {item.name}: {state[key]}
                                    </div>

                                    <div className="flex-element" style={{textAlign: 'left'}}>
                                        <OverlayTrigger delay={150} placement="top"
                                                        overlay={tooltip(this.state, item)}>
                                            <div>
                                                { (item.toggle && state[key]>0)
                                                    ?
                                                    <button className={state.toggle[key] ? 'switchOn' : ''}
                                                            onClick={() => this.setState(item.toggle(this.state))}>{state.toggle[key] ? 'Off' : 'On'}</button>
                                                    : ''}
                                                <button
                                                    className={(item.cost ? this.isEnough(this.state, _.isFunction(item.cost) ? item.cost(this.state) : item.cost) ? '' : 'disabled' : '')}
                                                    onClick={() => {
                                                        this.onClickWrapper(item);
                                                    }}>
                                                    {state[key]>0 ? 'Upgrade' : 'Buy'}
                                                </button>
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            )}
                        </div>
                        {state.achievements.includes("hydrogen_star")
                            ?
                            <div className="flex-element">
                                {_.map(automators.converters, (item, key) =>
                                    (item.locked && item.locked(this.state))
                                        ? ''
                                        : <div key={key} className="flex-container-row automation">
                                        <div className="flex-element">
                                            <div className="col-sm-6"
                                                 style={{textAlign: "right"}}>
                                                {item.name}: {state[key]}
                                            </div>

                                            <div className="col-sm-6" style={{textAlign: 'left'}}>

                                                <OverlayTrigger delay={150} placement="top"
                                                                overlay={tooltip(this.state, item)}>
                                                    <div>
                                                        { (item.toggle && state[key]>0)
                                                            ?
                                                            <button className={state.toggle[key] ? 'switchOn' : ''}
                                                                    onClick={() => this.setState(item.toggle(this.state))}>{state.toggle[key] ? 'Off' : 'On'}</button>
                                                            : ''}

                                                        <button
                                                            className={(item.cost ? this.isEnough(this.state, _.isFunction(item.cost) ? item.cost(this.state) : item.cost) ? '' : 'disabled' : '')}
                                                            onClick={() => {
                                                                this.onClickWrapper(item);
                                                            }}>
                                                            {state[key]>0 ? 'Upgrade' : 'Buy'}
                                                        </button>
                                                    </div>

                                                </OverlayTrigger>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div> : ''}
                    </div>
                </div>;

         const research_subcomponent =
             <div className="flex-element">
                 <h3>Research</h3>
                 <img alt="" className="overlay" src={"./img/upgrades.png"}/>

                 {_.map(oneclickers, (item, key) =>
                     (item.locked && item.locked(this.state))
                         ? ''
                         :
                         <div key={key}>
                             <OverlayTrigger delay={150} placement="right" overlay={tooltip(this.state, item)}>
                                 {this.state[key]
                                     ? <span className="badge">{item.name}</span>
                                     :
                                     <button id={key} key={key}
                                             className={(item.cost ? this.isEnough(this.state, item.cost) ? '' : 'disabled' : '')}
                                             onClick={() => {
                                                 this.onClickWrapper(item);
                                             }}>
                                         {item.name}
                                     </button>}

                             </OverlayTrigger>
                         </div>
                 )}
             </div>;

            const planets_subcomponent =
                <div className="flex-element">
                    <div className="flex-container-row">
                        <div className="flex-element">
                            <h3>Planets</h3>
                        </div>
                    </div>

                    <div className="flex-container-row">

                        <div className="flex-element">
                            <img alt="" className="overlay" src={"./img/basic_particles.png"}/>

                        </div>

                        <div className="flex-element">
                            <img alt="" className="overlay" src={"./img/atom_nucleus.png"}/>
                        </div>

                        <div className="flex-element">
                            <img alt="" className="overlay" src={"./img/atoms.png"}/>
                        </div>
                    </div>
                </div>;


        const chat_subcomponent =
            <div className="flex-element">
                <h3> History </h3>
                {_.map(state.chat, (item, key) =>
                    <div className="panel" key={key}>
                        <h5>{item.header}</h5>
                        <p>{item.text}</p>
                    </div>
                )}
            </div>;


            return (
                <div className="App">
                    {/* <Popup ref={(p) => this.popupHandler = p} /> -->
                    <button onClick={() => this.createPopup()}>MakeNewPopup</button> */}
                    <div className="flex-container-column header">
                        <div className="flex-container-row">
                        <div className="flex-element universe-tab">
                           {universe_component}
                        </div>
                            <div className="flex-element">
                            </div>
                        </div>
                        <div className="flex-element">
                            {time_subcomponent}
                            {temperature_subcomponent}
                        </div>
                    </div>
                    <div>
                        <ToastContainer className="toast-top-right"/>
                    </div>

                    <div className="flex-container-row">
                        <div className="flex-element">
                            <h3> Resources </h3>
                            <div className="flex-container-row">
                                <div className="flex-element">
                                    {basic_particles_subcomponent}
                                    {state.temperature > 5000 ? '' : atoms_subcomponent }
                                </div>
                                {state.H2 < 5 ? '' : simple_molecules_subcomponent}
                            </div>
                        </div>

                        <div className="flex-element">
                            {synthesizers_subcomponent}
                            {state.planets.length < 1 ? '' : planets_subcomponent }
                        </div>

                        {(state.achievements.includes('hydrogen') || state.achievements.includes('helium'))
                                ? your_stars_subcomponent
                            : ''}

                        {chat_subcomponent}
                    </div>
                    <Footer newGame={this.newGame}/>
                    <div style={{height: '50px', width: '100%'}}> </div>
                </div>
            );
    }
}

export default App;
