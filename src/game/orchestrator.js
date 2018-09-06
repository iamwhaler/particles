import React from 'react';
import Sound from 'react-sound';
import {getDefaultState} from "./default_state";

const SOUNDBANK = {
    calm: './sound/wormhole.mp3',
    lit: './sound/ripple-ether.mp3',
    speed: './sound/speed.mp3'
};




export class Orchestrator extends React.Component {
    constructor(props) {
        super(props);
    }

    getTrack(state) {
        if(state.hydrogen<30){
            return SOUNDBANK.calm;
        }
        else if(state.down_quarks_fluctuator>10 && state.electrons_fluctuator>15){
            return SOUNDBANK.speed;
        }

    }

    render() {
        return <Sound url={this.props.state.down_quarks_fluctuator>10 && this.props.state.electrons_fluctuator>15 ? SOUNDBANK.speed : SOUNDBANK.calm}
                      playStatus={this.props.state.music_paused ? Sound.status.PAUSED: Sound.status.PLAYING}
                      playbackRate={1-(this.props.state.strings/Math.pow(10,14))}
                      onFinishedPlaying={Sound.status.STOPPED && Sound.status.PLAYING}
                      loop={true}

    />; // Check props in next section
    }
}