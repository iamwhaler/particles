import _ from 'lodash';
import {fluctuators} from "./fluctuators";
import toastr from 'toastr';
import {getStarName, getStarColor, nuclearReaction} from './stars';
import checkAchievement from './achievements';

export const old_rules = {
    old_tick_test_rule: {
        onTick: (state) => {
            //console.log('old_tick_test');
            return state;
        }
    },

    universe_size_rule: {
        onTick: (state) => {
            state.universe_size+= Math.pow(1, state.temperature)/(1 + 0.01 *state.temperature);
            if(state.universe_size>=100){
                state.universe_size-=_.random(90,100);
                state.expansion_index++;
            }
            return state;
        }
    },

    temperature_effect_tule: {
        onTick: (state) => {
            _.map(fluctuators.miners, (value, resource_key) =>
                value.temperature_effect && state.toggle[resource_key] ? state.temperature += value.temperature_effect(state)
                    : false);
            return state
        }
    },

    achievement_rule: {
        onTick: (state) => {
            checkAchievement(state, state.strings);
            checkAchievement(state, state.up_quarks);
            checkAchievement(state, state.down_quarks);
            checkAchievement(state, state.neutrons);
            checkAchievement(state, state.protons);
            checkAchievement(state, state.electrons);
            checkAchievement(state, state.hydrogen);
            checkAchievement(state, state.helium);
            checkAchievement(state, state.H2);
            checkAchievement(state, state.He2);
            checkAchievement(state, state.C2);
            checkAchievement(state, state.carbon);
            checkAchievement(state, state.nitrogen);
            checkAchievement(state, state.hydrogen_stars);


            return state;
        }
    },

    wormhole_probability_rule: {
        onTick: (state) => {
            state.wormhole_probability=Math.pow(Math.sin(0.0092 * state.temperature) + Math.cos(10*state.temperature),2); // (sin^2 0.0092x + cos10x)*x^3/0.2x , x from 0 to 5000
            return state;
        }
    },

    temperature_rule: {
        onTick: (state) => {
            state.temperature = Math.floor(
                state.temperature *
                (1 / (1 + Math.pow(state.temperature * (0.00000001 * state.universe_size) * Math.pow(state.tick, 10), 0.01)))); // Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(state.temperature * 0.000000001))))))));
            return state;
        }
    },

    strings_rule: {
        onTick: (state) => {
       //  state.hydrogen+=10; state.helium+=10; state.down_quarks += 10; state.up_quarks += 10; state.electrons += 10; state.protons +=10; state.neutrons+=10;// for test purposes
               if(state.temperature<Math.pow(10, 4)) {

                   let randomNumber = Math.random() * (100 - 1) + 1;

                   if (randomNumber < 33.3) {
                       state.up_quarks += 1
                   }
                   else if (randomNumber < 66.6 && randomNumber > 33.3) {
                       state.down_quarks += 1
                   }
                   else if (randomNumber > 66.6) {
                       state.electrons += 1
                   }

                   state.strings--;
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
                          mass: _.random(state.H2/5, 30  ,true),
                        born: state.tick,
                        hydrogen: _.random(state.hydrogen, Math.max(state.H2, state.strings/100)),
                        helium: 0,
                    }
                };
                //  let pushed_value = JSON.stringify(parameters);
                state.stars.push(parameters);
            }

            nuclearReaction('Hydrogen', state);


            if (state.stars.length>1 && state.hydrogen_stars>0) {

                let starsToSuck = _.random(1, Math.min(state.stars.length, state.H2));
                let suckedStars = state.stars.splice(0, starsToSuck);
                state.black_hole = _.concat(state.black_hole, suckedStars);
                state.stars.splice(0, starsToSuck);
                state.hydrogen_stars -= (state.hydrogen_stars - (state.H2/100) );
                state.H2 -= _.random(state.hydrogen_stars, state.H2);
                toastr.warning("Your planets were sucked by the blackhole", 'Expansion index is too low!', {
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
            if(state.He2>20) {
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
                        born: state.tick,
                        mass: _.random(state.He2/6, state.stars.length, true),
                        helium: _.random(state.helium, state.He2),
                        carbon: 0
                    }
                };
                state.stars.push(parameters);

                if (state.stars.length>state.expansion_index/10 && state.helium_stars>0) {
                    let starsToSuck = _.random(1, Math.min(state.stars.length, state.He2));
                    let suckedStars = state.stars.splice(0, starsToSuck);
                    state.black_hole = _.concat(state.black_hole, suckedStars);
                    state.stars.splice(0, starsToSuck);
                    state.helium_stars -= (state.helium_stars - (state.He2/100));
                    state.He2 -= _.random(state.helium_stars, state.He2);
                    toastr.warning("Your planets were sucked by the blackhole", 'Expansion index is too low!', {
                        timeOut: 5000,
                        closeButton: true,
                        preventDuplicates: true,
                        extendedTimeOut: 4000,
                        escapeHtml: false
                    });
                }

            }

            nuclearReaction('Helium', state);

            return state;
        }
    },

    carbon_stars_rule: {

        onTick: (state) => {
            if(state.C2>10 && state.CH>10 && state.CN>10) {
                state.carbon_stars += state.C2 / 2333.33;
            }

            if (state.carbon_stars >= 1) {
                state.helium_stars--;
                state.C2 -= _.random(3, state.stars.length);
                let star_name = getStarName();
                let parameters = {
                    star: {
                        name: star_name,
                        color: getStarColor('Carbon'),
                        type: 'Carbon',
                        diameter: _.random(1, 10),
                        born: state.tick,
                        mass: _.random(state.He2/6, state.stars.length, true),
                        silicium: _.random(state.temperature, state.C2)
                    }
                };
                state.stars.push(parameters);

            }

            nuclearReaction('Helium', state);

            return state;
        }
    }
};

