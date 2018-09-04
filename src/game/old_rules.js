import _ from 'lodash';
import {fluctuators} from "./fluctuators";
import toastr from 'toastr';
import checkAchievement from './achievements';

export const old_rules = {
    universe_size_rule: {
        onTick: (state) => {
            state.universe_size+= Math.pow(1, state.temperature)/(1 + 0.01 *state.temperature);
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
            checkAchievement(state, state.He);
            checkAchievement(state, state.C2);
            checkAchievement(state, state.carbon);
            checkAchievement(state, state.nitrogen);
            checkAchievement(state, state.hydrogen_stars);


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

    H2_rule: {
        onTick: (state) => {
            if (state.hydrogen >= 10) {
                state.H2 += 1;
                state.hydrogen -= 2;
            }
            return state;
        }
    },

    He_rule: {
        onTick: (state) => {
            if(state.helium >= 5){
                state.He += state.helium/10;
                state.helium-= state.helium/5;
            }
            return state;
        }
    }
};

