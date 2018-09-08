import _ from 'lodash';
// import toastr from "toastr";
import {info} from '../game/data.js'

// onClick effect costs item.cost

export let fluctuators = {};

fluctuators = {
    modules: {
        pump: {
            name: 'Particle Pump',
            text: 'Sucks Protons and Neutrons from Cosmos',
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
                if(state.toggle.pump && state.space.protons>state.pump && state.space.neutrons>state.pump) {
                    let protons_count = Math.round(_.random(state.pump/4 , state.pump));
                    let neutrons_count = Math.round(_.random(state.pump/3.2 , state.pump));
                    state.field.protons += protons_count;
                    state.space.protons -= protons_count;

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
                if (state.toggle.riddle && state.riddle >= 1 && state.space.electrons>state.pump && state.space.photons>state.pump) {
                    let electrons_count = Math.round(_.random(state.riddle/3, state.riddle));
                    let photons_count = Math.round(_.random(state.riddle/4, state.riddle));
                    state.field.electrons += electrons_count;
                    state.space.electrons -= electrons_count;

                    state.field.photons += photons_count;
                    state.space.photons += photons_count;
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
                if (state.toggle.hydrogen_assembler && state.hydrogen_assembler >= 1) {
                    let count = state.hydrogen_assembler * 2;
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
                    'storage.helium': Math.floor(Math.pow(1.7, state.helium_assembler - 1) * 20),
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
                if (state.toggle.helium_assembler && state.helium_assembler >= 1 && state.tick % Math.floor(info.helium.mass) === 0) {
                    let count = (state.helium_assembler * 2);
                    state.storage.helium += count;
                    state.field.protons -= count*2;
                    state.field.neutrons -= count*2;
                    state.field.electrons -= count*2;
                    state.field.photons -= count*2;

                }
                return state;

            }
        },

    }
};