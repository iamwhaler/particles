import React from 'react';
import Sound from 'react-sound';
import classNames from "classnames";

const SOUNDBANK = {
    calm: {
        path:'./sound/wormhole.mp3',
        speed: '',
        volume: ''
    },
    lit: {
        path: './sound/ripple-ether.mp3'
    },
    speed: {
        path: './sound/speed.mp3'
    }
};




export class Orchestrator extends React.Component {
    constructor(props) {
        super(props);
    }

    getTrack() {
        return this.props.state.down_quarks_fluctuator>10 && this.props.state.electrons_fluctuator>15
            ? SOUNDBANK.speed
            :
                this.props.state.hydrogen<10 ?
                SOUNDBANK.calm : SOUNDBANK.lit
    }

    render() {
        let current_track = this.getTrack();
        return (
        <div>
        <span
            className={classNames('glyphicon', (this.props.state.music_paused ? 'glyphicon-play' : 'glyphicon-pause'))}
            style={{width: 28, height: 28}}> </span>
        <Sound url={current_track.path}
                      volume={this.props.state.achievements.length/1.4}
                      playStatus={this.props.state.music_paused ? Sound.status.PAUSED: Sound.status.PLAYING}
                      playbackRate={1.02-(this.props.state.strings/Math.pow(10,14))}
                      loop={true}
               onBufferChange={true}/>
        </div>);
    }
}