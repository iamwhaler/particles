import _ from 'lodash';
// import toastr from "toastr";
import {info} from '../game/data.js';

import {isEnough, chargeCost} from '../utils/bdcgin';
import {weight} from "./physics";

// onClick effect costs item.cost

const toggle_helper = (state, name) => {
    (state.toggle[name])
        ? state.toggle[name] = false
        : state.toggle[name] = true;
    return state;
};

const buy_assembler_helper = (state, name) => {
    state.assemblers[name]++;
    return state;
};

const assemble_helper = (state, name) => {
    let mass = Math.round(info[name].mass);

    if (state.tick % mass !== 0) return state;

    let [photons, electrons, protons, neutrons] = [0, 0, 0, 0];
    let level = state.assemblers[name];

    if (level === 0) return state;
    if (state.toggle[name] === false) return state;

    if (mass === 1) {
        photons = 1 * level;
        electrons = 1 * level;
        protons = 1 * level;
    }
    else {
        let half = Math.round(mass / 2);
        photons = half * level;
        electrons = half * level;
        protons = half * level;
        neutrons = half * level;
    }

    let cost = {'field.photons': photons, 'field.electrons': electrons, 'field.protons': protons, 'field.neutrons': neutrons};

    if (state.storage_capacity < weight(cost) + weight(state.storage)) state.toggle[name] = false;

    if (isEnough(state, cost)) {
        state = chargeCost(state, cost);
        state.storage[name]++;
    }
    else {
        state.toggle[name] = false;
    }

    // console.log(name, mass, level, cost);

    return state;
};



export const fluctuators = {
    modules: {

        polarizer: {
            name: 'Polarizer',
            text: 'Attracts Electrons and Protons from space',
            cost: (state) => {
                return {
                    'field.protons': Math.floor(Math.pow(1.5, state.polarizer) * 100)}
            },

            locked: (state) => false,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.3, state.polarizer - 1) * 10);
            },

            toggle: (state) => toggle_helper(state, 'polarizer'),

            onClick: (state) => {
                state.polarizer++;
                return state;
            },
            onTick: (state) => {
                const name = 'polarizer';
                if (state.toggle[name] === false) return state;
                let electrons_count = Math.round(_.random(state.polarizer/3, state.polarizer));
                let protons_count = Math.round(_.random(state.polarizer/4, state.polarizer));

                if (state.space.electrons > electrons_count && state.space.protons > protons_count
                    && state.toggle[name] && state.polarizer >= 1) {
                    if (state.field_capacity < weight({electrons: electrons_count, protons: protons_count}) + weight(state.field)) state.toggle[name] = false;
                    state.field.electrons += electrons_count;
                    state.space.electrons -= electrons_count;
                    state.field.protons += protons_count;
                    state.space.protons -= protons_count;
                }
                else {
                    state.toggle[name] = false;
                }

                return state;
            }
        },

        protonator: {
            name: 'Protonator',
            text: 'Converts Neutron and Neutrino into Electron and Proton',
            cost: (state) => {
                return {'field.photons': Math.floor(Math.pow(1.5, state.protonator) * 250)}
            },

            locked: (state) => false,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.3, state.protonator - 1) * 10);
            },

            toggle: (state) => toggle_helper(state, 'protonator'),
            onClick: (state) => {
                state.protonator++;
                return state;
            },
            onTick: (state) => {
                const name = 'protonator';
                if (state.toggle[name] === false) return state;
                let electrons_count = state.protonator *2;
                let protons_count = state.protonator *2;
                if (state.field.neutrino > electrons_count && state.field.neutrons > protons_count
                    && state.protonator >= 1) {
                    if (state.field_capacity < weight({electrons: electrons_count, protons: protons_count}) + weight(state.field)) state.toggle[name] = false;
                    state.field.electrons += electrons_count;
                    state.field.protons += protons_count;
                    state.field.neutrino -= electrons_count;
                    state.field.neutrons -= protons_count;
                }
                else {
                    state.toggle[name] = false;
                }

                return state;
            }
        },

        panel: {
            name: 'Panel',
            text: 'Attracts Photons and Neutrino from space',
            cost: (state) => {
                return{ 'field.neutrino': Math.floor(Math.pow(1.5, state.panel) * 100)}
            },
            locked: (state) => false,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.13, state.panel - 1) * 2);
            },

            toggle: (state) => toggle_helper(state, 'panel'),

            onClick: (state) => {
                state.panel++;
                return state;
            },
            onTick: (state) => {
                const name = 'panel';
                if (state.toggle[name] === false) return state;
                let photons_count = state.panel;
                let neutrino_count = state.panel/2;
                if (state.space.photons > photons_count ) {
                    if (state.field_capacity < weight({photons: photons_count, neutrino: neutrino_count}) + weight(state.field)) state.toggle[name] = false;
                    state.field.photons+=photons_count;
                    state.space.photons-=photons_count;

                }
                else if(state.space.neutrino > neutrino_count){
                    state.field.neutrino+=neutrino_count;
                    state.space.neutrino-=neutrino_count;
                }

                else{state.toggle[name] = false}
                return state;
            }
        },

        neutronator: {
            name: 'Neutronator',
            text: 'Converts Electron and Proton into Neutron and Neutrino',
            cost: (state) => {
                return {'field.neutrino': Math.floor(Math.pow(1.5, state.neutronator) * 250)}
            },

            locked: (state) => false,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.3, state.protonator - 1) * 10);
            },
            toggle: (state) => toggle_helper(state, 'neutronator'),
            onClick: (state) => {
                state.neutronator++;
                return state;
            },
            onTick: (state) => {
                const name = 'neutronator';
                if (state.toggle[name] === false) return state;
                let electrons_count = state.neutronator *2;
                let protons_count = state.neutronator *2;
                if (state.field.electrons > electrons_count && state.field.protons > protons_count
                    && state.neutronator >= 1) {

                    if (state.field_capacity < weight({electrons: electrons_count, protons: protons_count}) + weight(state.field)) state.toggle[name] = false;
                    state.field.electrons -= electrons_count;
                    state.field.protons -= protons_count;
                    state.field.neutrino += electrons_count;
                    state.field.neutrons += protons_count;
                }
                else {
                    state.toggle[name] = false;
                }

                return state;
            }
        },

        pump: {
            name: 'Matter Pump',
            text: 'Sucks Neutrons and atoms from space',
            cost: (state) => {
                return{ 'field.neutrons': Math.floor(Math.pow(1.5, state.pump) * 100)}
            },
            locked: (state) => false,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.13, state.pump - 1) * 2);
            },

            toggle: (state) => toggle_helper(state, 'pump'),

            onClick: (state) => {
                state.pump++;
                return state;
            },
            onTick: (state) => {
                const name = 'pump';
                if (state.toggle[name] === false) return state;

                if (state.space.neutrons > 0 || _.sum(_.values(state.dust)) > 0 ) {
                    let count = state.pump;

                    if (_.random(0,2) === 0 && state.field_capacity > weight({neutrons: count}) + weight(state.field)) {

                        state.field.neutrons += count;
                        state.space.neutrons -= count;
                    }

                    else {
                        let matter = _.sample(_.keys(state.dust));

                        let obj = {};
                        obj[matter] = count;

                        if (state.storage_capacity < weight(obj) + weight(state.storage)
                            && state.field_capacity < weight({neutrons: count}) + weight(state.field)) state.toggle[name] = false;

                        if(state.dust[matter]>count){
                            state.storage[matter] += count;
                            state.dust[matter] -= count;
                        }
                    }
                }
                else {
                    state.toggle[name] = false;
                }

                return state;
            }
        },
    },

    assemblers: {
        hydrogen: {
            name: 'Hydrogen Assembler',
            text: 'Synths Hydrogen consuming elementary particles',
            cost: (state) => {return {'storage.hydrogen': Math.floor(Math.pow(1.5, state.assemblers.hydrogen) * 1000)};},
            locked: (state) => false,
            toggle: (state) => toggle_helper(state, 'hydrogen'),
            onClick: (state) => buy_assembler_helper(state, 'hydrogen'),
            onTick: (state) => assemble_helper(state, 'hydrogen')
        },
        
        helium: {
            name: 'Helium Assembler',
            text: 'Synths Helium consuming elementary particles',
            cost: (state) => {return {'storage.helium': Math.floor(Math.pow(1.6, state.assemblers.helium) * 1000)};},
            locked: (state) => false,
            toggle: (state) => toggle_helper(state, 'helium'),
            onClick: (state) => buy_assembler_helper(state, 'helium'),
            onTick: (state) => assemble_helper(state, 'helium')
        },

        carbon: {
            name: 'Carbon Assembler',
            text: 'Synths Carbon consuming elementary particles',
            cost: (state) => {return {'storage.carbon': Math.floor(Math.pow(1.7, state.assemblers.carbon) * 1000)};},
            locked: (state) => false,
            toggle: (state) => toggle_helper(state, 'carbon'),
            onClick: (state) => buy_assembler_helper(state, 'carbon'),
            onTick: (state) => assemble_helper(state, 'carbon')
        },

        oxygen: {
            name: 'Oxygen Assembler',
            text: 'Synths Oxygen consuming elementary particles',
            cost: (state) => {return {'storage.oxygen': Math.floor(Math.pow(1.8, state.assemblers.oxygen) * 1000)};},
            locked: (state) => false,
            toggle: (state) => toggle_helper(state, 'oxygen'),
            onClick: (state) => buy_assembler_helper(state, 'oxygen'),
            onTick: (state) => assemble_helper(state, 'oxygen')
        },
        
        nitrogen: {
            name: 'Nitrogen Assembler',
            text: 'Synths Nitrogen consuming elementary particles',
            cost: (state) => {return {'storage.nitrogen': Math.floor(Math.pow(1.9, state.assemblers.nitrogen) * 1000)};},
            locked: (state) => false,
            toggle: (state) => toggle_helper(state, 'nitrogen'),
            onClick: (state) => buy_assembler_helper(state, 'nitrogen'),
            onTick: (state) => assemble_helper(state, 'nitrogen')
        },
        
        aluminium: {
            name: 'Aluminium Assembler',
            text: 'Synths Aluminium consuming elementary particles',
            cost: (state) => {return {'storage.aluminium': Math.floor(Math.pow(2, state.assemblers.aluminium) * 1000)};},
            locked: (state) => false,
            toggle: (state) => toggle_helper(state, 'aluminium'),
            onClick: (state) => buy_assembler_helper(state, 'aluminium'),
            onTick: (state) => assemble_helper(state, 'aluminium')
        },
        
        silicon: {
            name: 'Silicon Assembler',
            text: 'Synths Silicon consuming elementary particles',
            cost: (state) => {return {'storage.silicon': Math.floor(Math.pow(2.1, state.assemblers.silicon) * 1000)};},
            locked: (state) => false,
            toggle: (state) => toggle_helper(state, 'silicon'),
            onClick: (state) => buy_assembler_helper(state, 'silicon'),
            onTick: (state) => assemble_helper(state, 'silicon')
        },
        
        ferrum: {
            name: 'Ferrum Assembler',
            text: 'Synths Ferrum consuming elementary particles',
            cost: (state) => {return {'storage.ferrum': Math.floor(Math.pow(2.2, state.assemblers.ferrum) * 1000)};},
            locked: (state) => false,
            toggle: (state) => toggle_helper(state, 'ferrum'),
            onClick: (state) => buy_assembler_helper(state, 'ferrum'),
            onTick: (state) => assemble_helper(state, 'ferrum')
        },

    }
};