import _ from 'lodash';

import {old_rules} from './old_rules';
import {weight} from './physics';


export const rules = {

    old_rules: { name: 'Rules ', text: 'Rule Text',
        locked: state => false,
        onTick: state => _.reduce(old_rules, (sum, rule) => rule.onTick ? rule.onTick(sum) : sum, state)
    },

    H2_rule: {name: 'H2 merge', text: 'Rule Text',
        locked: state => state.hydrogen === 0,
        onTick: (state) => {
            if (state.hydrogen >= 5) {
                state.H2 += 1;
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

    new_galaxy: { name: 'New Galaxy', text: 'Rule Text',
        locked: state => state.H2 === 0,
        onTick: state => {
            if (_.random(1, 100) === 1 && weight({'H2': state.H2, 'He': state.He}) > 1000) {
                let H2 = Math.ceil(Math.sqrt(state.H2));
                let He = Math.ceil(Math.sqrt(state.He));
                state.H2 -= H2;
                state.He -= He;
                state.universe.push({name: 'Galaxy ' + (state.universe.length + 1), mater: {'H2': H2, 'He': He}, systems: []});
            }
            return state;
        }
    },

    new_system: { name: 'New System', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                if (_.random(1, 100) === 1 && weight({'H2': galaxy.mater.H2, 'He': galaxy.mater.He}) > 100) {
                    let H2 = Math.ceil(Math.sqrt(galaxy.mater.H2));
                    let He = Math.ceil(Math.sqrt(galaxy.mater.He));
                    state.universe[galaxy_key].mater.H2 -= H2;
                    state.universe[galaxy_key].mater.He -= He;
                    state.universe[galaxy_key].systems.push({name: 'System ' + (galaxy.systems.length + 1), mater: {'H2': H2, 'He': He}, stars: [], planets: []});
                }
            });
            return state;
        }
    },

    new_star: { name: 'New Star', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                _.each(galaxy.systems, (system, system_key) => {
                    if (_.random(1, 10) === 1 && weight({'H2': system.mater.H2, 'He': system.mater.He}) > 100) {
                        let H2 = Math.ceil(5 * Math.sqrt(system.mater.H2));
                        let He = Math.ceil(5 * Math.sqrt(system.mater.He));
                        state.universe[galaxy_key].systems[system_key].mater.H2 -= H2;
                        state.universe[galaxy_key].systems[system_key].mater.He -= He;
                        state.universe[galaxy_key].systems[system_key].stars.push({name: 'Star ' + (system.stars.length + 1),  mater: {'H2': H2, 'He': He}});
                    }
                });
            });
            return state;
        }
    },

    new_planet: { name: 'New Planet', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                _.each(galaxy.systems, (system, system_key) => {
                    if (_.random(1, 100) === 1 && weight({'H2': system.mater.H2, 'He': system.mater.He}) > 10) {
                        let H2 = Math.ceil(Math.sqrt(system.mater.H2));
                        let He = Math.ceil(Math.sqrt(system.mater.He));
                        state.universe[galaxy_key].systems[system_key].mater.H2 -= H2;
                        state.universe[galaxy_key].systems[system_key].mater.He -= He;
                        state.universe[galaxy_key].systems[system_key].planets.push({name: 'Planet ' + (system.planets.length + 1),  mater: {'H2': H2, 'He': He}});
                    }
                });
            });
            return state;
        }
    },

    proton_proton_chain_reaction: { name: 'Proton Proton Chain Reaction', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                _.each(galaxy.systems, (system, system_key) => {
                    _.each(system.stars, (star, star_key) => {
                        if (star.mater.H2 >= 2 && state.electrons >= 1) {
                            let count = Math.min(state.electrons, Math.ceil(star.mater.H2 / 100));
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.H2 -= count * 2;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.He += count;
                            state.electrons -= count;
                            state.neutrino += count;
                        }
                    });
                });
            });
            return state;
        }
    },

    triple_alpha_process: { name: 'Triple-alpha process', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                _.each(galaxy.systems, (system, system_key) => {
                    _.each(system.stars, (star, star_key) => {
                        if (star.mater.He >= 3) {
                            let count = Math.ceil(star.mater.He / 100);
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.He -= count * 3;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.carbon += count;
                            state.photons += count * 2;
                        }
                    });
                });
            });
            return state;
        }
    },

    carbon_fusion: { name: 'Carbon fusion', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                _.each(galaxy.systems, (system, system_key) => {
                    _.each(system.stars, (star, star_key) => {
                        if (star.mater.carbon >= 2) {
                            let count = Math.ceil(star.mater.carbon / 100);
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.He += count;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.neon += count;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.carbon -= count * 2;
                            state.photons += count;
                        }
                    });
                });
            });
            return state;
        }
    },

    neon_fusion: { name: 'Neon fusion', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                _.each(galaxy.systems, (system, system_key) => {
                    _.each(system.stars, (star, star_key) => {
                        if (star.mater.neon >= 1) {
                            let count = Math.ceil(star.mater.neon / 100);
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.neon -= count;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.He += count;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.oxygen += count;
                            state.photons += count;
                        }
                    });
                });
            });
            return state;
        }
    },

    oxygen_fusion: { name: 'Oxygen fusion', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                _.each(galaxy.systems, (system, system_key) => {
                    _.each(system.stars, (star, star_key) => {
                        if (star.mater.oxygen >= 2) {
                            let count = Math.ceil(star.mater.neon / 100);
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.oxygen -= count * 2;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.silicon += count;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.He += count;
                            state.photons += count;
                        }
                    });
                });
            });
            return state;
        }
    },



};

