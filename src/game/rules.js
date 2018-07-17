import _ from 'lodash';
import toastr from 'toastr';
import {getStarName, getStarColor, nuclearReaction} from './stars';
import checkAchievement from './achievements';

export const rules = {
    achievement_rule: {
        onFrame: (state) => {
            checkAchievement(state, state.strings);
            checkAchievement(state, state.up_quarks);
            checkAchievement(state, state.hydrogen);
            checkAchievement(state, state.helium);
            checkAchievement(state, state.H2);
            checkAchievement(state, state.He2);

            if (state.H2 === 1) {
                state.achievements.push('H2');
               /* toastr.info("You've discovered Hydrogen molecules", 'Congratulations!', {
                    timeOut: 6000,
                    closeButton: true,
                    preventDuplicates: true,
                    extendedTimeOut: 4000,
                    escapeHtml: false
                }); */
            }
            if (state.He2 === 1) {
                state.achievements.push('He2')
            }

            return state;
        },

        onTick: (state) => {

            if (state.temperature > 2000 && !state.temperature) { //!state.temperature izmenit
                toastr.error('It will block you from further growth', 'Temperature of your universe is too high!', {
                    timeOut: 150000,
                    closeButton: false,
                    preventDuplicates: true,
                    extendedTimeOut: 500000,
                    escapeHtml: false
                });

            }
            return state;

        }
    },

    temperature_rule: {
        onTick: (state) => {
            if(!state.achievements.includes('strings')) {
                state.temperature -= _.random(50, 100);
                toastr.info("Your universe is cooling down, please wait a little", 'Welcome to the Game!', {
                    timeOut: 15000,
                    closeButton: true,
                    preventDuplicates: true,
                    extendedTimeOut: 15000,
                    escapeHtml: false
                });
            }
            else {state.temperature += _.random(5, 10) + state.stars.length}

            // clearInterval(state.timerID);
            // state.game_paused = true;
            //  state.frame_rate = state.temperature;
            //  state.game_paused = false;

            return state;
        }
    },

    strings_rule: {
        onTick: (state) => {
            state.strings++;

        state.hydrogen+=10; state.down_quarks += 10; state.up_quarks += 10; state.electrons += 10; state.protons +=10; state.neutrons+=10;// for test purposes
            if (state.fluctuating) {

                let randomNumber = Math.random() * (100 - 1) + 1;

                if (randomNumber < 33.3) {
                    state.up_quarks += 1
                }
                else if (randomNumber < 66.6 && randomNumber > 33.3) {
                    state.down_quarks += 1
                }
                else if(randomNumber>66.6){
                    state.electrons += 1
                }

                state.strings--;

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
            if(state.helium >= 5){
                state.He2 += state.helium/10;
                state.helium-= state.helium/5;
            }
            return state;
        }
    },

    hydrogen_stars_rule: {
        onTick: (state) => {
            if(state.H2>20 && state.H2 !== 0 && state.temperature<2000) {
                    state.H2 -= _.random(1, state.H2/10);
                    state.hydrogen_stars += (state.H2 / 333.33) / state.H2 * 10;
            }

            if (state.hydrogen_stars >= 1) {
                state.hydrogen_stars--;
                let star_name = getStarName();
                let parameters = {
                    star: {
                        name: star_name,
                        type: 'Hydrogen',
                        diameter: 0, // this will be used to describe what's going on inside the star (all h2 turned into other more weight elements
                        color: getStarColor('Hydrogen'),
                        mass: _.random(1, state.H2 ,true),
                        born: state.tick,
                        hydrogen: _.random(10, state.H2*10),
                        carbon: 0,
                    }
                };
                //  let pushed_value = JSON.stringify(parameters);
                state.stars.push(parameters);
            }

            nuclearReaction('Hydrogen', state);


            if (state.stars.length>30 && state.hydrogen_stars>0) {
                state.hydrogen_stars -= (state.hydrogen_stars - (state.H2/100) );
                state.H2 -= _.random(state.hydrogen_stars, state.H2);
                state.stars.splice(0, _.random(1, state.H2/10));
                toastr.warning("Your planets were sucked by the blackhole", 'Too low level of galaxy!', {
                    timeOut: 5000,
                    closeButton: true,
                    preventDuplicates: true,
                    extendedTimeOut: 4000,
                    escapeHtml: false
                });
            }

          /*  if (state.H2>150 && state.temperature>3000) {
                state.stars.splice(0, _.random(0, state.H2/100));
            }

            */ // too fucked

            return state;
        }
    },

    helium_stars_rule: {

        onTick: (state) => {
            if(state.helium>5) {
                state.helium_stars += state.He2 / 3333.33;
            }

            if (state.helium_stars >= 1) {
                state.helium_stars--;
                state.He2 -= _.random(3, state.stars.length);
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

                if (state.stars.length>30 && state.helium_stars>0) {
                    state.helium_stars -= (state.helium_stars - (state.He2/100) );
                    state.He2 -= _.random(state.helium_stars, state.He2);
                    state.stars.splice(0, _.random(1, state.He2));
                    toastr.warning("Your planets were sucked by the blackhole", 'Too low level of galaxy!', {
                        timeOut: 5000,
                        closeButton: true,
                        preventDuplicates: true,
                        extendedTimeOut: 4000,
                        escapeHtml: false
                    });
                }

            }

            return state;
        }
    }
};

