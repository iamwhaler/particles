
import _ from 'lodash';

import {old_rules} from './old_rules';
import {weight} from './physics';


export const rules = {

    old_rules: {
        condition: state => true,
        onTick: state => _.reduce(old_rules, (sum, rule) => rule.onTick ? rule.onTick(sum) : sum, state)
    },

    clean_rule: {
         condition: state => true,
         onTick: state => false ? ({...state, state}) : state
    },

    new_galaxy: {
        condition: state => true,
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

    new_system: {
        condition: state => true,
        onTick: state => {
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

    new_star: {
        condition: state => true,
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
    new_planet: {
        condition: state => true,
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

};

