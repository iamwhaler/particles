import _ from 'lodash';

import {old_rules} from './old_rules';
import {weight} from './physics';
import {fluctuators} from "./fluctuators";


const radiate_helper = (state, system_key, count) => {
    _.each(state.systems[system_key].planets, (planet, key) => {
        state.systems[system_key].planets[key].temperature += (Math.ceil(count / (key + 2)));
    });
    return state;
};

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
        isDisabled: state => weight({'hydrogen': state.storage.hydrogen, 'helium': state.storage.helium}) < 1000,
        onClick: state => {
            if (weight({'hydrogen': state.storage.hydrogen, 'helium': state.storage.helium}) < 1000) return state;

            state.systems.push({name: 'System ' + (state.systems.length + 1), mater: _.clone(state.storage), stars: [], planets: []});

            state.storage = {
                hydrogen: 0,
                helium: 0,
                carbon: 0,
                oxygen: 0,
                nitrogen: 0,
                neon: 0,
                silicon: 0,
                ferrum: 0,
            };
            return state;
        }
    },

    new_star: { name: 'New Star', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                if (_.random(1, 10) === 1 && weight(system.mater) > 1000) {
                    let new_mater = {};
                    _.each(system.mater, (count, key) => {
                        let transfer = Math.ceil(count / _.random(1.24, 1.42));
                        new_mater[key] = transfer;
                        state.systems[system_key].mater[key] -= transfer;
                    });
                    state.systems[system_key].stars.push({name: 'Star ' + (system.stars.length + 1), temperature: 0, mater: new_mater});
                }
            });
            return state;
        }
    },

    new_planet: { name: 'New Planet', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
                _.each(state.systems, (system, system_key) => {
                    if (system.stars.length > 1 && _.random(1, 100) === 1 && weight(system.mater) > 100) {
                        let new_mater = {};
                        _.each(system.mater, (count, key) => {
                            let transfer = Math.ceil(count / _.random(3.3, 4.2));
                            new_mater[key] = transfer;
                            state.systems[system_key].mater[key] -= transfer;
                        });
                        state.systems[system_key].planets.push({name: 'Planet ' + (system.planets.length + 1), temperature: 0, mater: new_mater});
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
                    if (star.mater.hydrogen >= 4 && (weight({'hydrogen': star.mater.hydrogen}) > (weight(star.mater) * 0.4) )) {
                        let count = Math.ceil(star.mater.hydrogen / 1000);
                        state.systems[system_key].stars[star_key].mater.hydrogen -= count * 4;
                        state.systems[system_key].stars[star_key].mater.helium += count;

                        let radiation = Math.ceil(count * 10);
                        state.systems[system_key].stars[star_key].temperature += radiation;
                        state = radiate_helper(state, system_key, count);

                        state.space.neutrino += count;

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
                    if (star.mater.helium >= 3 && (weight({'helium': star.mater.helium}) > (weight(star.mater) * 0.3) )) {
                        let count = Math.ceil(star.mater.helium / 500);
                        state.systems[system_key].stars[star_key].mater.helium -= count * 3;
                        state.systems[system_key].stars[star_key].mater.carbon += count;

                        let radiation = Math.ceil(count * 25);
                        state.systems[system_key].stars[star_key].temperature += radiation;
                        state = radiate_helper(state, system_key, count);

                        state.space.photons += count * 2;
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
                    if (star.mater.carbon >= 2 && (weight({'carbon': star.mater.carbon}) > (weight(star.mater) * 0.2) )) {
                        let count = Math.ceil(star.mater.carbon / 250);
                        state.systems[system_key].stars[star_key].mater.helium += count;
                        state.systems[system_key].stars[star_key].mater.neon += count;
                        state.systems[system_key].stars[star_key].mater.carbon -= count * 2;

                        let radiation = Math.ceil(count * 50);
                        state.systems[system_key].stars[star_key].temperature += radiation;
                        state = radiate_helper(state, system_key, count);

                        state.space.photons += count;
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
                    if (star.mater.neon >= 1 && (weight({'neon': star.mater.neon}) > (weight(star.mater) * 0.1) )) {
                        let count = Math.ceil(star.mater.neon / 200);
                        state.systems[system_key].stars[star_key].mater.neon -= count;
                        state.systems[system_key].stars[star_key].mater.helium += count;
                        state.systems[system_key].stars[star_key].mater.oxygen += count;

                        let radiation = Math.ceil(count * 100);
                        state.systems[system_key].stars[star_key].temperature += radiation;
                        state = radiate_helper(state, system_key, count);

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
                    if (star.mater.oxygen >= 2 && (weight({'oxygen': star.mater.oxygen}) > (weight(star.mater) * 0.05) )) {
                        let count = Math.ceil(star.mater.neon / 100);
                        state.systems[system_key].stars[star_key].mater.oxygen -= count * 2;
                        state.systems[system_key].stars[star_key].mater.silicon += count;
                        state.systems[system_key].stars[star_key].mater.helium += count;

                        let radiation = Math.ceil(count * 200);
                        state.systems[system_key].stars[star_key].temperature += radiation;
                        state = radiate_helper(state, system_key, count);

                        state.space.photons += count;
                    }
                });
            });
            return state;
        }
    },



};

