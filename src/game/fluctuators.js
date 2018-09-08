import _ from 'lodash';
// import toastr from "toastr";

// onClick effect costs item.cost

export let fluctuators = {};

fluctuators = {
    modules: {
        pump: {
            name: 'Particle Pump',
            text: 'Sucks Protons and Neutrons from Cosmos',
            cost: (state) => {
                return{protons: Math.floor(Math.pow(1.1, state.pump -1) *4)}
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
                if(state.toggle.pump) {
                    state.protons += Math.round(_.random(state.pump/4 , state.pump));
                    state.neutrons += Math.round(_.random(state.pump/3.2 , state.pump));
                }
                return state;
            }
        },

        riddle: {
            name: 'Riddle',
            text: 'Attracts Electrons and Photons from space',
            cost: (state) => {
                return {
                    electrons: Math.floor(Math.pow(1.2, state.riddle - 1) * 4),
                    photons: Math.floor(Math.pow(1.5, state.riddle - 1) * 2)}
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
                if (state.toggle.riddle && state.riddle >= 1) {
                    state.electrons += Math.round(_.random(state.riddle/3, state.riddle));
                    state.photons += Math.round(_.random(state.riddle/4, state.riddle));
                }

                return state;
            }
        },


    },

    assemblers: {
        hydrogen_assembler: {
            name: 'H2 Assembler',
            text: 'Synths H2 consuming Hydrogen',
            cost: (state) => {
                return {
                    hydrogen: Math.floor(Math.pow(1.7, state.hydrogen_assembler - 1) * 20),
                };
            },
            locked: (state) => false,
            toggle: (state) => {
                (state.toggle.hydrogen_assembler)
                    ? state.toggle.H2_converter=false
                    : state.toggle.H2_converter=true;
                return state;
            },
            onClick: (state) => {
                state.hydrogen_assembler++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.hydrogen_assembler && state.hydrogen_assembler >= 1 && state.hydrogen >= 2) {
                    state.hydrogen += _.random(5, state.hydrogen_assembler * 2);
                }
                return state;

            }
        },

        helium_assembler: {
            name: 'Helium Assembler',
            text: 'Synths Helium from existing particles',
            cost: (state) => {
                return {
                    helium: Math.floor(Math.pow(1.7, state.helium_assembler - 1) * 20),
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
                if (state.toggle.helium_assembler && state.helium_assembler >= 1 && state.helium >= 2) {

                }
                return state;

            }
        },

    }
};