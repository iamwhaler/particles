import _ from 'lodash';

import {old_rules} from './old_rules';
import {weight} from './physics';
import {info} from './data';


const radiate_helper = (state, system_key, count) => {
    _.each(state.systems[system_key].planets, (planet, key) => {
        state.systems[system_key].planets[key].temperature += (Math.ceil((count * 0.01) / (key + 2)));
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



    /*
    clean_rule: { name: 'Rules ', text: 'Rule Text',
         locked: state => true,
         onTick: state => false ? ({...state, state}) : state
    },
    */

    new_system: { name: 'New System', text: 'Rule Text',
        isDisabled: state => weight({'hydrogen': state.storage.hydrogen, 'helium': state.storage.helium}) < 1000000,
        onClick: state => {
            if (weight({'hydrogen': state.storage.hydrogen, 'helium': state.storage.helium}) < 1000000) return state;

            state.systems.push({name: 'System ' + (state.systems.length + 1), mater: _.clone(state.storage), stars: [], planets: []});

            state.storage = {
                hydrogen: 0,
                helium: 0,
                carbon: 0,
                oxygen: 0,
                nitrogen: 0,
                aluminium: 0,
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
                if (_.random(1, 50 * (system.stars.length + 1)) === 1 && weight(system.mater) > 100000) {
                    let new_mater = {};
                    _.each(system.mater, (count, key) => {
                        let transfer = Math.ceil(count / _.random(1.620, 4.2));
                        new_mater[key] = transfer;
                        state.systems[system_key].mater[key] -= transfer;
                    });
                    state.systems[system_key].stars.push({name: 'Star ' + (system.stars.length + 1), type: 'Proto-Star', temperature: 0, mater: new_mater});
                }
            });
            return state;
        }
    },

    new_planet: { name: 'New Planet', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
                _.each(state.systems, (system, system_key) => {
                    if (system.stars.length > 1 && _.random(1, 100 * (system.planets.length + 1)) === 1 && weight(system.mater) > 1000) {
                        let new_mater = {};
                        _.each(system.mater, (count, key) => {
                            let transfer = Math.ceil(count / _.random(4.2, 16.20));
                            new_mater[key] = transfer;
                            state.systems[system_key].mater[key] -= transfer;
                        });
                        state.systems[system_key].planets.push({name: 'Planet ' + (system.planets.length + 1), type: 'Proto-Planet', temperature: 0, mater: new_mater});
                    }
                });
            return state;
        }
    },

    accretion: { name: 'Accretion', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if (weight(system.mater) > 10000 && (weight(star.mater) < weight(system.mater))) {
                        _.each(star.mater, (count, key) => {
                            let accretioned = Math.ceil(count / _.random(420, 1620));
                            state.systems[system_key].stars[star_key].mater[key] += accretioned;
                            state.systems[system_key].mater[key] -= accretioned;
                            state.space.photons += accretioned;
                        });
                    }
                });
            });
            return state;
        }
    },

    cooling: { name: 'Cooling', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    state.systems[system_key].stars[star_key].temperature = Math.round(
                        state.systems[system_key].stars[star_key].temperature * 0.9
                        //state.systems[system_key].stars[star_key].temperature * (0.9 * (1 - 0.01 * Math.sqrt(weight(star.mater))))
                    );
                });
            });
            return state;
        }
    },

    nova: { name: 'Nova', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if ((weight(star.mater) > star.mater.hydrogen * 2) &&
                        (star.type !== 'Black Hole' && star.type !== 'Neutron Star' && star.type !== 'White Dwarf')
                    ) {

                        if (weight(star.mater) > 1000000) {
                            state.systems[system_key].stars[star_key].type = 'Black Hole';
                        } else if (weight(star.mater) > 100000) {
                            state.systems[system_key].stars[star_key].type = 'Neutron Star';
                        } else {
                            state.systems[system_key].stars[star_key].type = 'White Dwarf';
                        }

                        _.each(star.mater, (count, key) => {
                            let ejection = Math.ceil(count * (0.95 - 0.01 * info[key].mass));
                            state.dust[key] += ejection;
                            state.space.photons += Math.ceil(ejection * (info[key].mass));
                            state.systems[system_key].stars[star_key].mater[key] -= ejection;

                            if (state.systems[system_key].stars[star_key].type === 'Neutron Star') {
                                state.space.neutrino += Math.ceil(ejection * (info[key].mass));
                            }
                        });
                    }
                });
            });
            return state;
        }
    },

    proton_proton_chain_reaction: { name: 'Proton Proton Chain Reaction', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if (star.mater.hydrogen >= 4 && (weight({'hydrogen': star.mater.hydrogen}) > (weight(star.mater) * 0.33) )) {
                        let count = Math.ceil(weight(star.mater) / 10000);
                        state.systems[system_key].stars[star_key].mater.hydrogen -= count * 4;
                        state.systems[system_key].stars[star_key].mater.helium += count;

                        let radiation = Math.ceil(count * 10);
                        state.systems[system_key].stars[star_key].temperature += radiation * 10;
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
                    if (star.mater.helium >= 3 && (weight({'helium': star.mater.helium}) > (weight(star.mater) * 0.22) )) {
                        let count = Math.ceil(weight(star.mater) / 5000);
                        state.systems[system_key].stars[star_key].mater.helium -= count * 3;
                        state.systems[system_key].stars[star_key].mater.carbon += count;

                        let radiation = Math.ceil(count * 25);
                        state.systems[system_key].stars[star_key].temperature += radiation * 10;
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
                    if (star.mater.carbon >= 2 && (weight({'carbon': star.mater.carbon}) > (weight(star.mater) * 0.11) )) {
                        let count = Math.ceil(weight(star.mater) / 2500);
                        state.systems[system_key].stars[star_key].mater.helium += count * 2;
                        state.systems[system_key].stars[star_key].mater.oxygen += count;
                        state.systems[system_key].stars[star_key].mater.carbon -= count * 2;

                        let radiation = Math.ceil(count * 50);
                        state.systems[system_key].stars[star_key].temperature += radiation * 10;
                        state = radiate_helper(state, system_key, count);

                        state.space.photons += count;
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
                    if (star.mater.oxygen >= 2 && (weight({'oxygen': star.mater.oxygen}) > (weight(star.mater) * 0.055) )) {
                        let count = Math.ceil(weight(star.mater) / 1000);
                        state.systems[system_key].stars[star_key].mater.oxygen -= count * 2;
                        state.systems[system_key].stars[star_key].mater.silicon += count;
                        state.systems[system_key].stars[star_key].mater.helium += count;

                        let radiation = Math.ceil(count * 100);
                        state.systems[system_key].stars[star_key].temperature += radiation * 10;
                        state = radiate_helper(state, system_key, count);

                        state.space.photons += count;
                    }
                });
            });
            return state;
        }
    },

    silicon_fusion: { name: 'Silicon fusion', text: 'Rule Text',
        locked: state => state.systems.length === 0,
        onTick: state => {
            _.each(state.systems, (system, system_key) => {
                _.each(system.stars, (star, star_key) => {
                    if (star.mater.silicon >= 2 && (weight({'oxygen': star.mater.oxygen}) > (weight(star.mater) * 0.01) )) {
                        let count = Math.ceil(weight(star.mater) / 500);
                        state.systems[system_key].stars[star_key].mater.silicon -= count * 2;
                        state.systems[system_key].stars[star_key].mater.ferrum += count;
                        state.systems[system_key].stars[star_key].mater.helium += count;

                        let radiation = Math.ceil(count * 250);
                        state.systems[system_key].stars[star_key].temperature += radiation * 10;
                        state = radiate_helper(state, system_key, count);

                        state.space.photons += count;
                    }
                });
            });
            return state;
        }
    },



};

