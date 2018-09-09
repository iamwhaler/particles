import _ from 'lodash';
// import toastr from "toastr";
import {info} from '../game/data.js';

// onClick effect costs item.cost

export const fluctuators = {
    modules: {
        pump: {
            name: 'Particle Pump',
            text: 'Sucks Protons and Neutrons from space',
            cost: (state) => {
                return{ 'field.protons': Math.floor(Math.pow(1.1, state.pump -1) *4)}
            },
            locked: (state) => false,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.19, state.pump - 1) * 12);
            },

            toggle: (state) => {
                (state.toggle.pump)
                    ? state.toggle.pump=false
                    : state.toggle.pump=true;
                return state;
            },

            onClick: (state) => {
                state.pump++;
                return state;
            },
            onTick: (state) => {
                let protons_count = Math.round(_.random(state.pump/4 , state.pump));
                let neutrons_count = Math.round(_.random(state.pump/3.2 , state.pump));
                if(state.toggle.pump && state.space.protons>protons_count && state.space.neutrons>neutrons_count) {
                    state.field.protons += protons_count;
                    state.space.protons -= protons_count;
                    state.storage.hydrogen += protons_count;

                    state.field.neutrons += neutrons_count;
                    state.space.neutrons -= neutrons_count;

                }
                return state;
            }
        },

        riddle: {
            name: 'Riddle',
            text: 'Attracts Electrons and Photons from space',
            cost: (state) => {
                return {
                    'field.electrons': Math.floor(Math.pow(1.2, state.riddle - 1) * 4),
                    'field.photons': Math.floor(Math.pow(1.5, state.riddle - 1) * 2)}
            },

            locked: (state) => false,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.3, state.riddle - 1) * 10);
            },

            toggle: (state) => {
                (state.toggle.riddle)
                    ? state.toggle.riddle=false
                    : state.toggle.riddle=true;

                return state;
            },
            onClick: (state) => {
                state.riddle++;
                return state;
            },
            onTick: (state) => {
                let electrons_count = Math.round(_.random(state.riddle/3, state.riddle));
                let photons_count = Math.round(_.random(state.riddle/4, state.riddle));
                if (state.space.electrons > electrons_count && state.space.photons>photons_count
                    && state.toggle.riddle && state.riddle >= 1
                    && state.space.electrons>state.pump
                    && state.space.photons>state.pump) {
                    state.field.electrons += electrons_count;
                    state.space.electrons -= electrons_count;

                    state.field.photons += photons_count;
                    state.space.photons -= photons_count;
                }

                return state;
            }
        },


        protonator: {
            name: 'Protonator',
            text: 'Converts Neutron and Neutrino into Electron and Proton',
            cost: (state) => {
                return {
                    'field.neutrons': Math.floor(Math.pow(1.2, state.protonator - 1) * 4),
                    'field.neutrino': Math.floor(Math.pow(1.5, state.protonator - 1) * 2)}
            },

            locked: (state) => false,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.3, state.protonator - 1) * 10);
            },

            toggle: (state) => {
                (state.toggle.protonator)
                    ? state.toggle.protonator=false
                    : state.toggle.protonator=true;

                return state;
            },
            onClick: (state) => {
                state.protonator++;
                return state;
            },
            onTick: (state) => {
                let electrons_count = state.protonator *2;
                let protons_count = state.protonator *2;
                if (state.field.neutrino> electrons_count && state.field.neutrons > protons_count
                    && state.toggle.protonator && state.protonator >= 1
                    && state.space.electrons>state.protonator
                    && state.space.photons>state.protonator) {
                    state.field.electrons += electrons_count;
                    state.field.protons += protons_count;

                    state.field.neutrino -= electrons_count;
                    state.field.neutrons -= protons_count;
                }

                return state;
            }
        },


    },

    assemblers: {
        hydrogen_assembler: {
            name: 'H2 Assembler',
            text: 'Synths Hydrogen consuming elementary particles',
            cost: (state) => {
                return {
                    'storage.hydrogen': Math.floor(Math.pow(1.7, state.hydrogen_assembler - 1) * 20),
                };
            },
            locked: (state) => false,
            toggle: (state) => {
                (state.toggle.hydrogen_assembler)
                    ? state.toggle.hydrogen_assembler=false
                    : state.toggle.hydrogen_assembler=true;
                return state;
            },
            onClick: (state) => {
                state.hydrogen_assembler++;
                return state;
            },
            onTick: (state) => {
                let count = state.hydrogen_assembler * 2;
                if (state.field.photons > count && state.field.electrons > count
                    && state.field.neutrons > count && state.field.protons > count && state.toggle.hydrogen_assembler
                    && state.hydrogen_assembler >= 1) {
                    state.storage.hydrogen += count;
                    state.field.protons -= count;
                    state.field.neutrons -= count;
                    state.field.electrons -= count;
                    state.field.photons -= count;

                }
                return state;

            }
        },

        helium_assembler: {
            name: 'Helium Assembler',
            text: 'Synths Helium from existing particles',
            cost: (state) => {
                return {
                    "storage.helium": Math.floor(Math.pow(1.7, state.helium_assembler - 1) * 20),
                };
            },
            locked: (state) => false,
            toggle: (state) => {
                (state.toggle.helium_assembler)
                    ? state.toggle.helium_assembler=false
                    : state.toggle.helium_assembler=true;
                return state;
            },
            onClick: (state) => {
                state.helium_assembler++;
                return state;
            },
            onTick: (state) => {
                let count = (state.helium_assembler * 2);
                if (state.field.protons > count*2 && state.field.photons > count*2
                    && state.field.electrons > count*2
                    && state.field.neutrons > count*2
                    && state.toggle.helium_assembler && state.helium_assembler >= 1
                    && state.tick % Math.floor(info.helium.mass) === 0) {
                    state.storage.helium += count;
                    state.field.protons -= count*2;
                    state.field.neutrons -= count*2;
                    state.field.electrons -= count*2;
                    state.field.photons -= count*2;

                }
                return state;

            }
        },

        carbon_assembler: {
            name: 'Carbon Assembler',
            text: 'Synths Carbon from existing particles',
            cost: (state) => {
                return {
                    "storage.carbon": Math.floor(Math.pow(1.7, state.carbon_assembler - 1) * 20),
                };
            },
            locked: (state) => false,
            toggle: (state) => {
                (state.toggle.carbon_assembler)
                    ? state.toggle.carbon_assembler=false
                    : state.toggle.carbon_assembler=true;
                return state;
            },
            onClick: (state) => {
                state.carbon_assembler++;
                return state;
            },
            onTick: (state) => {
                let count = (state.carbon_assembler * 2);
                if (state.field.protons > count*6 && state.field.photons > count*6
                    && state.field.electrons > count*6
                    && state.field.neutrons > count*6
                    && state.toggle.carbon_assembler && state.carbon_assembler >= 1
                    && state.tick % Math.floor(info.carbon.mass) === 0) {
                    state.storage.carbon += count;
                    state.field.protons -= count*6;
                    state.field.neutrons -= count*6;
                    state.field.electrons -= count*6;
                    state.field.photons -= count*6;
                }
                return state;

            }
        },

    }
};