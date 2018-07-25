import React, {Component} from 'react';
import {Circle} from 'react-shapes';
import classNames from 'classnames';
import _ from 'lodash';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import Footer from './footer.js'

import './css/App.css';

import {game_name} from './game/app_config';
import {getDefaultState} from './game/default_state';
import {frame} from './game/frame';
import {tick} from './game/tick';
import {data, info} from './game/data';
import {oneclickers} from './game/oneclickers';
import {clickers} from './game/clickers';
import {automators} from './game/automators';
import Popup from "./utils/Popup/Popup";

import {ToastContainer} from 'react-toastr';
import confirm from './components/confirm_launch';


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
        this.setState(app_state ? app_state : getDefaultState());
        this.playGame();
    }

    playGame(speed_multiplier = false) {
        clearInterval(this.timerID);
        this.timerID = setInterval(
            () => this.frame(),
            Math.floor(this.state.game_speed / this.state.frame_rate / (speed_multiplier ? speed_multiplier : this.state.game_speed_multiplier))
        );
        this.setState({game_paused: false});
    }

    pauseGame() {
        clearInterval(this.timerID);
        this.setState({game_paused: true});
    }


    newGame() {
        confirm('Do you want to fully reset the game?').then(
            () => {
                localStorage.setItem(game_name+"_app_state", null);
                let new_state = getDefaultState();
                this.setState(new_state);
                this.playGame(new_state.game_speed_multiplier);
            },

            () => {
                return false;
            });


    }

    setGameSpeed(speed) {
        if (!this.state.game_paused) this.playGame(speed);
        this.setState({game_speed_multiplier: speed});
    }

    frame() {
        let state = frame(this.state);
        state.frame++;

        let frame_rate = state.mode === "slow" ? state.frame_rate * 2
            : state.mode === "fast" ? Math.round(state.frame_rate / 2)
                : state.frame_rate;

        if (state.frame % frame_rate === 0) {
            state = this.tick(state);
            state.tick++;
        }
        this.setState(state);
    }

    tick(initial_state) {
        let state = tick(initial_state);
        localStorage.setItem(game_name + "_app_state", JSON.stringify(state));
        return state;
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
    };

    isEnough(state, cost) {
        let enough = true;
        _.each(cost, (value, resource_key) => {
            if (state[resource_key] < value) enough = false;
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
                        <img src={item.image} style={{marginLeft: '20px', width: '60px', height: '70px'}} />
                    </div>
                    <div className="flex-element flex-container-column">
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
                {(!item.text)
                    ? ''
                    :
                    <div>
                        <span>{item.name}</span>
                        <br/>
                        <span style={{fontSize: '11px'}}> {item.text ? item.text : ''}</span>
                    </div>
                }


                {_.map(_.isFunction(item.cost) ? item.cost(this.state) : item.cost, (value, resource_key) =>
                    (!item.cost)
                        ? ''
                        :
                        <div className="row" key={resource_key}>
                            <div className="col-sm-6 infoBar">{resource_key}</div>
                            <div className="col-sm-6 infoBar"
                                 style={(value > state[resource_key]) ? {color: '#982727'} : {color: ''}}>
                                {value} / {state[resource_key].toFixed(0)}
                            </div>
                        </div>
                )}
                </div>

            </Tooltip>;


        return (
            <div className="App">
                {/* <Popup ref={(p) => this.popupHandler = p} /> -->
                <button onClick={() => this.createPopup()}>MakeNewPopup</button> */}
                <div className="flex-container-column header" style={{backgroundImage: "url(https://steamuserimages-a.akamaihd.net/ugc/867361404264636705/B43EE084571441E838F65B6CB2E94F26C0D985FB/)"}}>
                   <div className="flex-container-row">
                    <h5 className="flex-element"
                        style={(state.temperature < -(1000)) ? {color: '#515F90'}
                        : (state.temperature > 4000)
                                ? {color: '#FC2200'} : (state.temperature > 2000)
                                    ? {color: '#982727'} : {color: ''}}>
                        Temperature: {state.temperature.toFixed(0)}
                    </h5>
                    <div className="flex-element">
                        <h5>Years: {this.state.tick}k</h5></div>
                   </div>

                        <ToastContainer className="toast-top-right"/>
                </div>


                <div className="flex-container-row resources">
                    <div className="flex-element">
                        <h6>Basic particles</h6>

                        <OverlayTrigger delay={250} placement="bottom" overlay={details(info.basic_particles)}>
                        <img alt="" className="overlay resource-icon" src={"./img/basic_particles.png"}/>
                        </OverlayTrigger>

                        <div className="flex-container-row resource-tab">

                            <div className="flex-element">
                                {_.map(data.basic_particles, (item, key) =>
                                    (item.locked && item.locked(this.state))
                                        ? ''
                                        :
                                        <div className="flex-element" style={{width: '150px'}} key={key}>
                                            <span className="flex-element">{item.name}: {state[key].toFixed(0)}</span>
                                        </div>
                                )}
                            </div>

                            <div className="flex-element col-xs clickers">
                                {_.map(clickers.basic_particles, (item, key) =>
                                    (item.locked && item.locked(this.state))
                                        ? ''
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
                    </div>


                    <div className="flex-element">
                        <h6>Atoms</h6>
                        <img alt="" className="overlay resource-icon" src={"./img/atoms.png"}/>
                        <div className="flex-container-row resource-tab">

                            <div className="flex-element">
                                {_.map(data.atoms, (item, key) =>
                                    (item.locked && item.locked(this.state))
                                        ? ''
                                        :
                                        <div className="flex-element" style={{width: '150px'}} key={key}>
                                            <span className="flex-element">{item.name}: {state[key].toFixed(0)}</span>
                                        </div>
                                )}
                            </div>

                            <div className="flex-element col-xs clickers">
                                {_.map(clickers.atoms, (item, key) =>
                                    (item.locked && item.locked(this.state))
                                        ? ''
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
                    </div>


                    <div className="flex-element">
                        <h6>Simple molecules</h6>
                        <img alt="" className="overlay resource-icon" src={"./img/simple_molecules.png"}/>
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
                    </div>

                    {(state.achievements.includes('hydrogen') || state.achievements.includes('helium'))
                        ?
                        <div className="flex-element">
                            <h6>Stars</h6>
                            <img alt="" className="overlay star-icon" src={"./img/star.png"}/>
                            {_.map(data.stars, (item, key) =>
                                <div className="flex-element" key={key}>
                                    {item.name}: {state[key].toFixed(2)}
                                </div>
                            )}
                        </div>

                        : ''}


                    {(state.achievements.includes('H2') || state.achievements.includes('He2'))
                        ?
                        <div className="flex-element">
                            <h6> Your stars: {state.stars.length} </h6>
                            <div className="your-stars" style={{backgroundImage: 'url(./img/stars-tab.png)'}}>
                                {_.map(state.stars, (item, key) =>
                                    (item)
                                    ?
                                    <div key={key} style={{border: '0px solid #BDBDBD'}} className="flex-container-row">
                                        <OverlayTrigger delay={150} placement="left"
                                                        overlay={starTooltip(this.state, item)}>
                                        <div className="flex-element star-circle">
                                                <Circle r={1 + (5*Math.asin((this.state.tick - item.star.born)/130))} fill={{color: '#4E4E9A'}}
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
                        : ''}

                </div>

                <div className="flex-container-row">

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

                        {_.map(automators.converters, (item, key) =>
                            (item.locked && item.locked(this.state))
                                ? ''
                                : <div key={key} className="flex-container-row automation">
                                    <div className="flex-element">
                                        <div className="col-sm-6"
                                             style={{textAlign: "right"}}>{item.name}: {state[key]}</div>
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

                    </div>


                    <div className="flex-element">
                        <h3>Synthesizers</h3>
                        <img alt="" className="overlay" src={"./img/automation.png"}
                             style={{width: '25px', height: '25px'}}/>
                        <div className="flex-container-column">

                            {_.map(automators.miners, (item, key) =>
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
                        </div>
                    </div>


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
                    </div>

                </div>


                <Footer newGame={this.newGame}/>
            </div>
        );
    }
}

export default App;
