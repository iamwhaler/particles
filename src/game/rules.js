import _ from 'lodash';

import {old_rules} from './old_rules';
import {weight} from './physics';
import {fluctuators} from "./fluctuators";


export const rules = {

    old_rules: {
        locked: state => false,
        onTick: state => _.reduce(old_rules, (sum, rule) => rule.onTick ? rule.onTick(sum) : sum, state)
    },


    universe_size_rule: {
        name: 'Universe Expansion', text: 'Universe is expanding on the lower temperatures',
        locked: false,
        onTick: (state) => {
            state.universe_size+= Math.pow(1, state.temperature)/(1 + 0.01 *state.temperature);
            return state;
        }
    },

    temperature_effect_rule: {
        name: 'Temperature fluctuation',
        text: 'Fluctuators slightly increase your temperature',
        onTick: (state) => {
            _.map(fluctuators.fluctuators, (value, resource_key) =>
                value.temperature_effect && state.toggle[resource_key] ? state.temperature += value.temperature_effect(state)
                    : false);
            return state
        }
    },


    protons_rule: {name: 'Protons Merge', text: 'Protons form from existing quarks',
        locked: state => state.protons === 0,
        onTick: (state) => {
            if (state.up_quarks >= 5 && state.down_quarks >= 5) {
                state.up_quarks -= 2;
                state.down_quarks -= 1;
                state.protons += 1;
            }
            return state;
        }
    },

    neutrons_rule: {name: 'Neutrons Merge', text: 'Neutrons form from existing quarks',
        locked: state => state.neutrons === 0,
        onTick: (state) => {
            if (state.up_quarks >= 5 && state.down_quarks >= 5) {
                state.up_quarks -= 1;
                state.down_quarks -= 2;
                state.neutrons += 1;
            }
            return state;
        }
    },

    hydrogen_rule: {name: 'hydrogen merge', text: 'Hydrogen forms a molecule once appeared',
        locked: state => state.hydrogen === 0,
        onTick: (state) => {
            if (state.hydrogen >= 5) {
                state.hydrogen += 1;
                state.hydrogen -= 2;
            }
            return state;
        }
    },

    /*
    clean_rule: { name: 'Rules ', text: 'Rule Text',
         locked: state => true,
         onTick: state => false ? ({...state, state}) : state
    },
    */

    new_system: { name: 'New System', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onClick: state => {
            let hydrogen = Math.ceil(13 * Math.sqrt(state.storage.hydrogen));
            let helium = Math.ceil(9 * Math.sqrt(state.storage.helium));
            state.storage.hydrogen -= hydrogen;
            state.storage.helium -= helium;
            state.systems.push({name: 'System ' + (state.systems.length + 1), mater: {'hydrogen': hydrogen, 'helium': helium}, stars: [], planets: []});
            return state;
        }
    },

    new_star: { name: 'New Star', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                if (_.random(1, 10) === 1 && weight({'hydrogen': system.mater.hydrogen, 'helium': system.mater.helium}) > 1000) {
                    let hydrogen = Math.ceil(9 * Math.sqrt(system.mater.hydrogen));
                    let helium = Math.ceil(7 * Math.sqrt(system.mater.helium));
                    state.systems[system_key].mater.hydrogen -= hydrogen;
                    state.systems[system_key].mater.helium -= helium;
                    state.systems[system_key].stars.push({name: 'Star ' + (system.stars.length + 1),  mater: {'hydrogen': hydrogen, 'helium': helium}});
                }
            });
            return state;
        }
    },

    new_planet: { name: 'New Planet', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
                _.each(state.systems, (system, system_key) => {
                    if (_.random(1, 100) === 1 && weight({'hydrogen': system.mater.hydrogen, 'helium': system.mater.helium}) > 100) {
                        let hydrogen = Math.ceil(Math.sqrt(system.mater.hydrogen));
                        let helium = Math.ceil(Math.sqrt(system.mater.helium));
                        state.systems[system_key].mater.hydrogen -= hydrogen;
                        state.systems[system_key].mater.helium -= helium;
                        state.systems[system_key].planets.push({name: 'Planet ' + (system.planets.length + 1),  mater: {'hydrogen': hydrogen, 'helium': helium}});
                    }
                });
            return state;
        }
    },

    proton_proton_chain_reaction: { name: 'Proton Proton Chain Reaction', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if (star.mater.hydrogen >= 2 && state.electrons >= 1) {
                        let count = Math.min(state.electrons, Math.ceil(star.mater.hydrogen / 100));
                        state.systems[system_key].stars[star_key].mater.hydrogen -= count * 2;
                        state.systems[system_key].stars[star_key].mater.helium += count;
                        state.electrons -= count;
                        state.neutrino += count;
                    }
                });
            });
            return state;
        }
    },

    triple_alpha_process: { name: 'Triple-alpha process', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if (star.mater.helium >= 3) {
                        let count = Math.ceil(star.mater.helium / 100);
                        state.systems[system_key].stars[star_key].mater.helium -= count * 3;
                        state.systems[system_key].stars[star_key].mater.carbon += count;
                        state.photons += count * 2;
                    }
                });
            });
            return state;
        }
    },

    carbon_fusion: { name: 'Carbon fusion', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if (star.mater.carbon >= 2) {
                        let count = Math.ceil(star.mater.carbon / 100);
                        state.systems[system_key].stars[star_key].mater.helium += count;
                        state.systems[system_key].stars[star_key].mater.neon += count;
                        state.systems[system_key].stars[star_key].mater.carbon -= count * 2;
                        state.photons += count;
                    }
                });
            });
            return state;
        }
    },

    neon_fusion: { name: 'Neon fusion', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if (star.mater.neon >= 1) {
                        let count = Math.ceil(star.mater.neon / 100);
                        state.systems[system_key].stars[star_key].mater.neon -= count;
                        state.systems[system_key].stars[star_key].mater.helium += count;
                        state.systems[system_key].stars[star_key].mater.oxygen += count;
                        state.photons += count;
                    }
                });
            });
            return state;
        }
    },

    oxygen_fusion: { name: 'Oxygen fusion', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if (star.mater.oxygen >= 2) {
                        let count = Math.ceil(star.mater.neon / 100);
                        state.systems[system_key].stars[star_key].mater.oxygen -= count * 2;
                        state.systems[system_key].stars[star_key].mater.silicon += count;
                        state.systems[system_key].stars[star_key].mater.helium += count;
                        state.photons += count;
                    }
                });
            });
            return state;
        }
    },



};

