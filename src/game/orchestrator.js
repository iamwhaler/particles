import React from 'react';
import Sound from 'react-sound';
import {getDefaultState} from "./default_state";

const SOUNDBANK = {
    calm: './sound/wormhole.mp3',
    lit: './sound/ripple-ether.mp3',
    speed: ''
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
            return SOUNDBANK.lit;
        }

    }

    render() {
        return <Sound url={this.getTrack(this.props.state)}
                      playStatus={this.props.state.music_paused ? Sound.status.PAUSED: Sound.status.PLAYING}
                      playbackRate={-this.props.state.protons}
                      onFinishedPlaying={Sound.status.STOPPED && Sound.status.PLAYING}

    />; // Check props in next section
    }
}