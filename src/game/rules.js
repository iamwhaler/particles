import _ from 'lodash';
import {getStarName, getStarColor} from './stars';

import {Popup} from '../utils/Popup/Popup';

export const rules = {

    strings_rule: {
        onTick: (state) => {
            state.strings++;

         // state.hydrogen+=10; state.down_quarks += 10; state.up_quarks += 10; state.electrons += 10 // for test purposes
            if (state.fluctuating) {

                let randomNumber = Math.random() * (100 - 1) + 1;

                if (randomNumber < 33.3) {
                    state.up_quarks += 1
                }
                else if (randomNumber < 66.6) {
                    state.down_quarks += 1
                }
                else {
                    state.electrons += 1
                }

            }
            else {
                return state
            }
            return state;

        }
    },

    up_quarks_rule: {
        onTick: (state) => {
            if (state.fluctuating) {
                if (state.strings > 4 && _.random(1, 2) === 1) {
                    state.strings -= 4;
                    state.up_quarks++;
                }
            }
            return state;
        }
    },

    temperature_rule: {
        onTick: (state) => {
            state.temperature += 3.33;

            // clearInterval(state.timerID);
            // state.game_paused = true;
            //  state.frame_rate = state.temperature;
            //  state.game_paused = false;

            return state;
        }
    },

    H2_rule: {
        onTick: (state) => {
            if (state.hydrogen >= 10) {
                state.H2 += 1;
                state.hydrogen -= 2;
            }
            return state;
        }
    },

    He2_rule: {
        onTick: (state) => {
            if(state.helium >= 2){
                state.He2 += state.helium/10;
                state.helium-= 2;
            }
            return state;
        }
    },

    hydrogen_stars_rule: {

        onTick: (state) => {
            if(state.H2>20 && state.H2 !== 0) {
                if(state.temperature<2000) {
                    state.H2 -= _.random(1, state.H2/10);
                    state.hydrogen_stars += (state.H2 / 333.33) / state.H2 * 10;
                }
            }

            if (state.hydrogen_stars >= 1) {
                state.hydrogen_stars--;
                let star_name = getStarName();
                let parameters = {
                    star: {
                        name: star_name,
                        type: 'Hydrogen',
                        color: getStarColor('Hydrogen'),
                        mass: _.random((1/state.temperature), state.H2 ,true)
                    }
                };
                //  let pushed_value = JSON.stringify(parameters);
                state.stars.push(parameters);
                console.log(state.stars);
            }

            if (state.stars.length>30 && state.hydrogen_stars>0) {
                state.hydrogen_stars -= (state.hydrogen_stars - (state.H2/100) );
                state.stars.splice(0, _.random(0, state.H2/10));
           //     this.popupHandler.createPopup('Blackhole', 'Your stars were sucked. Buy')
            }

            if (state.H2>150 && state.temperature>1000) {
                state.stars.splice(0, _.random(0, state.H2/10));
            }

            return state;
        }
    },

    helium_stars_rule: {

        onTick: (state) => {
            if(state.helium>9) {
                state.helium_stars += state.He2 / 333.33;
            }

            if (state.helium_stars >= 1) {
                state.helium_stars--;
                let star_name = getStarName();
                let parameters = {
                    star: {
                        name: star_name,
                        color: getStarColor('Helium'),
                        type: 'Helium',
                        diameter: _.random(1, 10),
                        mass: _.random(0.1, state.stars.length)
                    }
                };
                state.stars.push(parameters);
                console.log(state.stars);
            }

            return state;
        }
    }
};

