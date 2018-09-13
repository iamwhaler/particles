import React, { Component } from 'react';
import './css/footer.css';
import {social_links} from './game/app_config';


class Footer extends Component {

    render() {
        return (
            <div className="flex-container-row footer">
                <div className="flex-element">
                <span className="pull-left"><a onClick={this.props.newGame}>New game</a></span>
                </div>
                <div className="flex-container-row">
                &nbsp;
                <a target="_blank" rel="noopener noreferrer" href={social_links.telegram}>
                    <img alt="" src="https://sagacoin.net/img/social_telegram.png" style={{width: '20px'}}/>
                    &nbsp;
                    Telegram
                </a>
                &nbsp;&nbsp;&nbsp;
                <a target="_blank" rel="noopener noreferrer" href={social_links.wiki}>
                    <img alt="" src="https://static.filehorse.com/icons-web/educational-software/wikipedia-icon-32.png" />
                    &nbsp;
                    Wiki
                </a>
                &nbsp;&nbsp;&nbsp;
                <a target="_blank" className="flex-element" rel="noopener noreferrer" href={social_links.reddit}>
                    <img alt="" src="https://images-na.ssl-images-amazon.com/images/I/418PuxYS63L.png" />
                    &nbsp;
                    Reddit
                </a>
                &nbsp;&nbsp;&nbsp;
                <a rel="noopener noreferrer" href="javascript:void($zopim.livechat.window.show())">
                    <img alt="" src="https://www.intraworlds.com/wp-content/uploads/2015/01/IntraWorlds_icon_Solutions_Dedicated-Client-Support.png"/>
                    &nbsp;
                    Support
                </a>
                </div>

            </div>
        )
    }

}

export default Footer
