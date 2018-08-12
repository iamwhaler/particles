import _ from 'lodash';
import toastr from "toastr";
// import toastr from "toastr";

// onClick effect costs item.cost

export let automators = {};

automators = {
    miners: {
        strings_miner: {
            name: 'Strings Miner',
            text: 'Generates strings once in a tick',
            cost: (state) => {
                return {strings: Math.floor(Math.pow(1.2, state.strings_miner - 1) * 20)};
            },

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.109, state.strings_miner - 1) * 10);
            },

            locked: (state) => state.tick < 10,

            toggle: (state) => {
                (state.toggle.strings_miner)
                 ? state.toggle.strings_miner=false
                     : state.toggle.strings_miner=true;

                return state;
            },

            onClick: (state) => {
                state.strings_miner++;
                return state;
            },

            onTick: (state) => {
                if(state.toggle.strings_miner) {
                    state.strings += _.random(state.strings_miner / 3, state.strings_miner);
                }
                return state;
            }
        },

        up_quarks_miner: {
            name: 'Up Quarks Miner',
            text: 'Synths Up Quarks once in a tick',
            cost: (state) => {
                return {up_quarks: Math.floor(Math.pow(1.5, state.up_quarks_miner - 1) * 20)};
            },
            locked: (state) => !state.strings_miner,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.19, state.up_quarks_miner - 1) * 12);
            },

            toggle: (state) => {
                (state.toggle.up_quarks_miner)
                    ? state.toggle.up_quarks_miner=false
                    : state.toggle.up_quarks_miner=true;

                return state;
            },

            onClick: (state) => {
                state.up_quarks_miner++;
                return state;
            },
            onTick: (state) => {
                if(state.toggle.up_quarks_miner) {
                    state.up_quarks += Math.round(_.random(state.up_quarks_miner/4 , state.up_quarks_miner));
                }
                return state;
            }
        },

        down_quarks_miner: {
            name: 'Down Quarks Miner',
            text: 'Synths Down Quarks once in a tick',
            cost: (state) => {
                return {down_quarks: Math.floor(Math.pow(1.4, state.down_quarks_miner - 1) * 20)};
            },
            locked: (state) => !state.strings_miner,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.3, state.down_quarks_miner - 1) * 10);
            },

            toggle: (state) => {
                (state.toggle.down_quarks_miner)
                    ? state.toggle.down_quarks_miner=false
                    : state.toggle.down_quarks_miner=true;

                return state;
            },
            onClick: (state) => {
                state.down_quarks_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.down_quarks_miner && state.down_quarks_miner >= 1) {
                    state.down_quarks += Math.round(_.random(state.down_quarks_miner/3, state.down_quarks_miner));
                }

                return state;
            }
        },

        protons_miner: {
            name: 'Proton Miner',
            cost: (state) => {
                return {
                    up_quarks: Math.floor(Math.pow(1.5, state.protons_miner - 1) * 80),
                    down_quarks: Math.floor(Math.pow(1.5, state.protons_miner - 1) * 35),
                };
            },
            locked: (state) => !state.up_quarks_miner,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.5, state.protons_miner - 1) * 10);
            },

            toggle: (state) => {
                (state.toggle.protons_miner)
                    ? state.toggle.protons_miner=false
                    : state.toggle.protons_miner=true;

                return state;
            },
            onClick: (state) => {
                state.protons_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.protons_miner && state.protons_miner >= 1) {
                    state.protons += Math.round(_.random(0, state.protons_miner * 0.5));
                }
                return state;
            }
        },

        neutrons_miner: {
            name: 'Neutrons Miner',
            cost: (state) => {
                return {
                    up_quarks: Math.floor(Math.pow(1.5, state.neutrons_miner - 1) * 90),
                    down_quarks: Math.floor(Math.pow(1.5, state.neutrons_miner - 1) * 150)
                };
            },
            locked: (state) => !state.down_quarks_miner,

            temperature_effect: (state) => {
                return Math.floor(Math.pow(1.5, state.neutrons_miner - 1) * 10);
            },

            toggle: (state) => {
                (state.toggle.neutrons_miner)
                    ? state.toggle.neutrons_miner=false
                    : state.toggle.neutrons_miner=true;

                return state;
            },
            onClick: (state) => {
                state.neutrons_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.neutrons_miner && state.neutrons_miner >= 1) {
                    state.neutrons += Math.round(_.random(state.neutrons_miner * 0.5, state.neutrons_miner));
                }
                return state;
            }
        },

        electrons_miner: {
            name: 'Electrons Miner',
            cost: (state) => {
                return {
                    carbon: Math.floor(Math.pow(1.3, state.neutrons_miner - 1) * 90),
                    nitrogen: Math.floor(Math.pow(1.3, state.neutrons_miner - 1) * 150)
                };
            },
            locked: (state) => !state.achievements.includes('nitrogen'),
            toggle: (state) => {
                (state.toggle.neutrons_miner)
                    ? state.toggle.neutrons_miner=false
                    : state.toggle.neutrons_miner=true;

                return state;
            },
            onClick: (state) => {
                state.neutrons_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.neutrons_miner && state.neutrons_miner >= 1) {
                    state.neutrons += Math.round(_.random(state.neutrons_miner * 0.5, state.neutrons_miner));
                }
                return state;
            }
        },

        hydrogen_miner: {
            name: 'Hydrogen Miner',
            text: 'The only way to get Hydrogen in this Universe.' +
            'It really depends on the temperature.',
            cost: (state) => {
                return {
                    electrons: Math.floor(Math.pow(1.6, state.hydrogen_miner - 1) * 10),
                    protons: Math.floor(Math.pow(1.5, state.hydrogen_miner - 1) * 5),
                    neutrons: Math.floor(Math.pow(1.5, state.hydrogen_miner - 1) * 17.5),
                    photons: Math.floor(Math.pow(1.09, state.hydrogen_miner - 1) * 35)
                };
            },
            locked: (state) => !state.achievements.includes('hydrogen'),

            temperature_effect: (state) => {
                console.log(Math.floor(Math.pow(2.5, state.hydrogen_miner - 1) * 10));
                return Math.floor(Math.pow(2.09, state.hydrogen_miner - 1) * 10);
            },
            toggle: (state) => {
                (state.toggle.hydrogen_miner)
                    ? state.toggle.hydrogen_miner=false
                    : state.toggle.hydrogen_miner=true;

                return state;
            },
            onClick: (state) => {
                state.hydrogen_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.hydrogen_miner && state.hydrogen_miner >= 1) {
                    state.hydrogen += Math.round(_.random(1, state.hydrogen_miner / 3.14));
                }
                return state;

            }
        },

        helium_miner: {
            name: 'Helium Miner',
            text: 'The only way to get Helium in this Universe.',
            cost: (state) => {
                return {
                    electrons: Math.floor(Math.pow(1.6, state.helium_miner - 1) * 10),
                    protons: Math.floor(Math.pow(1.5, state.helium_miner - 1) * 5),
                    neutrons: Math.floor(Math.pow(1.5, state.helium_miner - 1) * 17.5),
                    photons: Math.floor(Math.pow(1.2, state.helium_miner - 1) * 35)

                };
            },
            locked: (state) => !state.achievements.includes('hydrogen'),
            temperature_effect: (state) => {
                return Math.floor(Math.pow(2.2, state.helium_miner - 1) * 10);
            },
            toggle: (state) => {
                (state.toggle.helium_miner)
                    ? state.toggle.helium_miner=false
                    : state.toggle.helium_miner=true;

                return state;
            },
            onClick: (state) => {
                state.helium_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.toggle.helium_miner && state.helium_miner >= 1) {
                    state.helium += Math.round(_.random(1, state.helium_miner / 3.33));
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
            locked: (state) => !state.achievements.includes('H2'),
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