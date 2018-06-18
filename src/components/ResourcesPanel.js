import React, { Component } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';

import './css/App.css';

import {game_name} from './game/app_config';
import {getDefaultState} from './game/default_state';
import {frame} from './game/frame';
import {tick} from './game/tick';
import {data} from './game/data';
import {oneclickers} from './game/oneclickers';
import {clickers} from './game/clickers';
import {automators} from './game/automators';
import {modes} from './game/modes';
import {modules} from './game/modules';
import {upgrades} from './game/upgrades';
import Popup from "./utils/Popup/Popup";

class ResourcesPanel extends Component {
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

    render() {
        let state = this.state;


        const tooltip = (state, item) =>
            <Tooltip id="tooltip">
                <div className="col-lg-12 infoBar">
                    {item.name}
                    <br />
                    {item.text ? item.text : ''}
                </div>

                {_.map(item.cost, (value, resource_key) => {
                    return <div className="row" key={resource_key}>
                        <div className="col-sm-6 infoBar">{resource_key}</div>
                        <div className="col-sm-6 infoBar">{state[resource_key]} / {value}</div>
                    </div>
                })}
            </Tooltip>;

        return (
            <div>
            <div className="flex-container-row">
                <div className="flex-element">
                    <h3>Resources</h3>
                    { _.map(data, (item, key) =>
                        <div key={key}>
                            {item.name}: {state[key]}
                        </div>
                    )}
                </div>

                <div className="flex-element">
                    <h3>OneClickers</h3>
                    {_.map(oneclickers, (item, key) =>
                        (item.locked && item.locked(this.state))
                            ? ''
                            :
                            <div key={key}>
                                <OverlayTrigger delay={150} placement="right" overlay={tooltip(this.state, item)}>
                                    {this.state[key]
                                        ? <span className="badge">{item.name}</span>
                                        :
                                        <button
                                            className={(item.cost ? this.isEnough(this.state, item.cost) ? '' : 'disabled' : '')}
                                            onClick={() => { this.onClickWrapper(item); }}>
                                            {item.name}
                                        </button>}
                                </OverlayTrigger>
                            </div>
                    )}
                </div>
                <div className="flex-element">
                    <h3>Clickers</h3>
                    {_.map(clickers, (item, key) =>
                        (item.locked && item.locked(this.state))
                            ? ''
                            :
                            <div key={key}>
                                <OverlayTrigger delay={150} placement="right" overlay={tooltip(this.state, item)}>
                                    <button
                                        className={(item.cost ? this.isEnough(this.state, item.cost) ? '' : 'disabled' : '')}
                                        onClick={() => { this.onClickWrapper(item); }}>
                                        {item.name}
                                    </button>
                                </OverlayTrigger>
                            </div>
                    )}
                </div>
                <div className="flex-element">
                    <h3>Automation</h3>
                    {_.map(automators, (item, key) =>
                        (item.locked && item.locked(this.state))
                            ? ''
                            :
                            <div key={key}>
                                <OverlayTrigger delay={150} placement="left" overlay={tooltip(this.state, item)}>
                                        <span>
                                            {state[key] ? <span>{item.name}: {state[key]}</span> : ''}
                                            {<button
                                                className={(item.cost ? this.isEnough(this.state, item.cost) ? '' : 'disabled' : '')}
                                                onClick={() => { this.onClickWrapper(item); }}>
                                                Buy {item.name}
                                            </button>}
                                        </span>
                                </OverlayTrigger>
                            </div>
                    )}
                </div>
            </div>

            <div className="flex-container-row">

            <div className="flex-element flex-container-column" style={{height: '100%'}}>
    <div className="flex-element flex-container-row">
            {_.map(modules, (item, key) =>
                (item.locked && item.locked(this.state))
                    ? ''
                    :
                    <div className="flex-element flex-container-column" key={key}>
                        <div className="flex-element">
                            <OverlayTrigger delay={150} placement="right" overlay={tooltip(this.state, item)}>
                                {<button
                                    className={classNames(
                                        this.state[key].current_state === 'stopped' ? 'btn-danger' : this.state[key].next_command === 'start' ? 'btn-success' : 'btn-warning',
                                        item.cost ? this.isEnough(this.state, item.cost) ? '' : 'disabled' : ''
                                    )}
                                    onClick={() => { this.onClickWrapper(item); }}>
                                    {item.name}
                                </button>}
                            </OverlayTrigger>
                        </div>
                        <div className="flex-element">
                            Cooldown: {state[key].cooldown_timer} / {state[key].cooldown}
                        </div>
                        <div className="flex-element">
                            State: {state[key].current_state}
                        </div>
                        <div className="flex-element">
                            Next: {state[key].next_command}
                        </div>
                    </div>
            )}
    </div>
        <div className="flex-element flex-container-row">
            {_.map(upgrades, (item, key) =>
                (item.locked && item.locked(this.state))
                    ? ''
                    :
                    <div className="flex-element" key={key}>
                        <div className="flex-container-column">
                            {state[key] ? <span className="flex-element">{item.name}: {state[key]}</span> : ''}
                            {
                                <span className="flex-element">
                                                    <OverlayTrigger delay={150} placement="bottom" overlay={tooltip(this.state, item)}>
                                                        <button
                                                            className={(item.cost ? this.isEnough(this.state, item.cost) ? '' : 'disabled' : '')}
                                                            onClick={() => { this.onClickWrapper(item); }}>
                                                Buy {item.name}
                                            </button></OverlayTrigger>
                                                </span>
                            }
                        </div>

                    </div>
            )}
        </div>
    </div>

    </div>
            </div>)
    }
