
import checkAchievement from './achievements';

export const old_rules = {

    achievement_rule: {
        onTick: (state) => {
            checkAchievement(state, state.strings);
            checkAchievement(state, state.up_quarks);
            checkAchievement(state, state.down_quarks);
            checkAchievement(state, state.neutrons);
            checkAchievement(state, state.protons);
            checkAchievement(state, state.photons);
            checkAchievement(state, state.electrons);
            checkAchievement(state, state.hydrogen);
            checkAchievement(state, state.helium);
            checkAchievement(state, state.H2);
            checkAchievement(state, state.He);
            checkAchievement(state, state.C2);
            checkAchievement(state, state.carbon);
            checkAchievement(state, state.nitrogen);


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

