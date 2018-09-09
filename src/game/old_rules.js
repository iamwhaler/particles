
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

};

