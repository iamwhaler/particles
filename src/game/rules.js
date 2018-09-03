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
            if (_.random(1, 100) === 1 && weight({'H2': state.H2, 'He2': state.He2}) > 1000) {
                let H2 = Math.ceil(Math.sqrt(state.H2));
                let He2 = Math.ceil(Math.sqrt(state.He2));
                state.H2 -= H2;
                state.He2 -= He2;
                state.universe.push({name: 'Galaxy ' + (state.universe.length + 1), mater: {'H2': H2, 'He2': He2}, systems: []});
            }
            return state;
        }
    },

    new_system: { name: 'New System', text: 'Rule Text',
        locked: state => state.universe.length === 0,
        onTick: state => {
            console.log(state.universe);
            _.each(state.universe, (galaxy, galaxy_key) =>  {
                if (_.random(1, 100) === 1 && weight({'H2': galaxy.mater.H2, 'He2': galaxy.mater.He2}) > 100) {
                    let H2 = Math.ceil(Math.sqrt(galaxy.mater.H2));
                    let He2 = Math.ceil(Math.sqrt(galaxy.mater.He2));
                    state.universe[galaxy_key].mater.H2 -= H2;
                    state.universe[galaxy_key].mater.He2 -= He2;
                    state.universe[galaxy_key].systems.push({name: 'System ' + (galaxy.systems.length + 1), mater: {'H2': H2, 'He2': He2}, stars: [], planets: []});
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
                    if (_.random(1, 10) === 1 && weight({'H2': system.mater.H2, 'He2': system.mater.He2}) > 100) {
                        let H2 = Math.ceil(5 * Math.sqrt(system.mater.H2));
                        let He2 = Math.ceil(5 * Math.sqrt(system.mater.He2));
                        state.universe[galaxy_key].systems[system_key].mater.H2 -= H2;
                        state.universe[galaxy_key].systems[system_key].mater.He2 -= He2;
                        state.universe[galaxy_key].systems[system_key].stars.push({name: 'Star ' + (system.stars.length + 1),  mater: {'H2': H2, 'He2': He2}});
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
                    if (_.random(1, 100) === 1 && weight({'H2': system.mater.H2, 'He2': system.mater.He2}) > 10) {
                        let H2 = Math.ceil(Math.sqrt(system.mater.H2));
                        let He2 = Math.ceil(Math.sqrt(system.mater.He2));
                        state.universe[galaxy_key].systems[system_key].mater.H2 -= H2;
                        state.universe[galaxy_key].systems[system_key].mater.He2 -= He2;
                        state.universe[galaxy_key].systems[system_key].planets.push({name: 'Planet ' + (system.planets.length + 1),  mater: {'H2': H2, 'He2': He2}});
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
                        if (star.mater.H2 > 2 && state.electrons > 1) {
                            let H2 = Math.ceil(star.mater.H2 / 100) * 2;
                            let He2 = Math.ceil(H2 / 2);
                            let electrons = Math.min(state.electrons, He2);
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.H2 -= electrons * 2;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.He2 += electrons;
                            state.electrons -= electrons;
                            state.neutrino += electrons;
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
                        if (star.mater.He2 > 3) {
                            let carbon = Math.ceil(star.mater.He2 / 100);
                            let He2 = carbon * 3;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.He2 -= He2;
                            state.universe[galaxy_key].systems[system_key].stars[star_key].mater.carbon += carbon;
                            state.photons -= carbon * 2;
                        }
                    });
                });
            });
            return state;
        }
    },



};

