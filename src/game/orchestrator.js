import React from 'react';
import Sound from 'react-sound';
import _ from 'lodash';
import classNames from "classnames";

export let SOUNDBANK = [
     {
        path: './sound/wormhole.mp3',
        speed: '',
        volume: ''
    },
    {
        path: './sound/postintro.mp3',
        speed: '',
        volume: ''
    },

     {
        path: './sound/ripple-ether.mp3'
    },

    {
        path: './sound/speed.mp3'
    },

    {
        path: './sound/miracle.mp3'
    },

];




export class Orchestrator extends React.Component {
    constructor(props) {
        super(props);
    }

    getTrack(track) {
        _.map(SOUNDBANK, (item, key) => {

        })

    }

    render() {
        let current_track = SOUNDBANK[this.props.state.track_playing];

        return (
        <span className="flex-element">
            <span
                className={classNames('glyphicon', (this.props.state.music_paused ? 'glyphicon-play' : 'glyphicon-pause'))}
                style={{width: 28, height: 28}}> </span>
            <Sound url={current_track.path}
                volume={this.props.state.achievements.length*20}
                playStatus={this.props.state.music_paused ? Sound.status.PAUSED: Sound.status.PLAYING}
                playbackRate={1.02-(this.props.state.field.electrons/Math.pow(10,14))}
                onFinishedPlaying={() => {if(this.props.state.track_playing>3){this.props.state.track_playing=0} else{this.props.state.track_playing++}}}/>
        </span>);
    }
}