import _ from 'lodash';
import {stars, star_names} from './stars';
import {frame} from "./frame";

export const rules = {

    strings_rule: {
        onTick: (state) => {
            state.strings++;

            state.down_quarks+=5; state.up_quarks+=5; state.electrons+=5/// for test purposes
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
            if(state.hydrogen>=10) {
                state.H2 += state.hydrogen / 4;
                state.hydrogen -= 2;
            }
            return state;
        }
    },

    hydrogen_stars_rule: {

        onTick: (state) => {
            state.hydrogen_stars += state.H2 / 333.33;

            if(state.hydrogen_stars>=1){
                state.hydrogen_stars--;
                    let parameters = {
                        name: star_names[_.random(0, star_names.length)],
                        diameter: _.random(0,10),
                        density: _.random(0,stars.length-1)
                    };
                  //  let pushed_value = JSON.stringify(parameters);
                    stars.push(parameters);
                    console.log(stars);
            }
            return state;
        }
    }
};

