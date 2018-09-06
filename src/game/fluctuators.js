import _ from 'lodash';
// import toastr from "toastr";

// onClick effect costs item.cost

export let fluctuators = {};

fluctuators = {
    fluctuators: {

        up_quarks_fluctuator: {
            name: 'Up Quarks Fluctuator',
            text: 'Synths Up Quarks once in a tick',
            cost: (state) => {
                return {up_quarks: Math.floor(Math.pow(1.5, state.up_quarks_fluctuator - 1) * 2),
                    strings: Math.floor(Math.pow(1.9, state.up_quarks_fluctuator - 1) * 42)};
            },
            locked: (state) => (!state.achievements.includes('up_quarks') && !state.achievements.includes('down_quarks') && !state.achievements.includes('photons')) ,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.19, state.up_quarks_fluctuator - 1) * 12);
            },

            toggle: (state) => {
                (state.toggle.up_quarks_fluctuator)
                    ? state.toggle.up_quarks_fluctuator=false
                    : state.toggle.up_quarks_fluctuator=true;
                return state;
            },

            onClick: (state) => {
                state.up_quarks_fluctuator++;
                return state;
            },
            onTick: (state) => {
                if(state.toggle.up_quarks_fluctuator) {
                    let count = Math.round(_.random(state.up_quarks_fluctuator/4 , state.up_quarks_fluctuator));
                    state.strings-= count;
                    state.up_quarks += count;
                }
                return state;
            }
        },

        down_quarks_fluctuator: {
            name: 'Down Quarks Fluctuator',
            text: 'Synths Down Quarks once in a tick',
            cost: (state) => {
                return {
                    down_quarks: Math.floor(Math.pow(1.2, state.down_quarks_fluctuator - 1) * 4),
                    strings: Math.floor(Math.pow(2.4, state.down_quarks_fluctuator - 1) * 42)}
            },

            locked: (state) => state.down_quarks<3,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.3, state.down_quarks_fluctuator - 1) * 10);
            },

            toggle: (state) => {
                (state.toggle.down_quarks_fluctuator)
                    ? state.toggle.down_quarks_fluctuator=false
                    : state.toggle.down_quarks_fluctuator=true;

                return state;
            },
            onClick: (state) => {
                state.down_quarks_fluctuator++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.down_quarks_fluctuator && state.down_quarks_fluctuator >= 1) {
                    let count = Math.round(_.random(state.down_quarks_fluctuator/3, state.down_quarks_fluctuator))
                    state.strings-= count;
                    state.down_quarks += count;
                }

                return state;
            }
        },

        electrons_fluctuator: {
            name: 'Electrons Fluctuator',
            cost: (state) => {
                return {
                    electrons: Math.floor(Math.pow(1.09, state.electrons_fluctuator - 1) * 15),
                    strings: Math.floor(Math.pow(2.8, state.electrons_fluctuator - 1) * 42)
                };
            },
            locked: (state) => !state.achievements.includes('protons'),

            toggle: (state) => {
                (state.toggle.electrons_fluctuator)
                    ? state.toggle.electrons_fluctuator=false
                    : state.toggle.electrons_fluctuator=true;

                return state;
            },
            onClick: (state) => {
                state.electrons_fluctuator++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.electrons_fluctuator && state.electrons_fluctuator >= 1) {
                    state.electrons += Math.round(_.random(state.electrons_fluctuator * 0.5, state.electrons_fluctuator));
                }
                return state;
            }
        },

        photons_fluctuator: {
            name: 'Photons Fluctuator',
            cost: (state) => {
                return {
                    photons: Math.floor(Math.pow(1.3, state.photons_fluctuator - 1) * 90),
                    strings: Math.floor(Math.pow(1.3, state.photons_fluctuator - 1) * 150)
                };
            },
            locked: (state) => state.temperature>Math.pow(10, 21),
            toggle: (state) => {
                (state.toggle.photons_fluctuator)
                    ? state.toggle.photons_fluctuator=false
                    : state.toggle.photons_fluctuator=true;

                return state;
            },
            onClick: (state) => {
                state.photons_fluctuator++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.photons_fluctuator && state.photons_fluctuator >= 1) {
                    state.photons += Math.round(_.random(state.photons_fluctuator * 0.5, state.photons_fluctuator));
                }
                return state;
            }
        },

    },

    converters: {
        H2_converter: {
            name: 'H2 Converter',
            text: 'Synths H2 consuming Hydrogen',
            cost: (state) => {
                return {
                    hydrogen: Math.floor(Math.pow(1.7, state.neutrons_miner - 1) * 20),
                    H2: Math.floor(Math.pow(1.5, state.neutrons_miner - 1) * 5)
                };
            },
            locked: (state) => false,
            toggle: (state) => {
                (state.toggle.H2_converter)
                    ? state.toggle.H2_converter=false
                    : state.toggle.H2_converter=true;
                return state;
            },
            onClick: (state) => {
                state.H2_converter++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.H2_converter && state.H2_converter >= 1 && state.hydrogen >= 2) {
                    state.hydrogen -= _.random(5, state.H2_converter * 2);
                    state.H2 += state.H2_converter * 2;
                }
                return state;

            }
        },

    }
};