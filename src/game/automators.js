import _ from 'lodash';

// onClick effect costs item.cost

export const automators = {
    miners: {
        strings_miner: {
            name: 'Strings Miner',
            text: 'Generates strings once in a tick',
            cost: (state) => {
                return {strings: Math.floor(Math.pow(1.2, state.strings_miner - 1) * 20)};
            },
            locked: (state) => state.tick < 10,
            onClick: (state) => {
                state.strings_miner++;
                return state;
            },
            onTick: (state) => {
                state.strings += _.random(1, state.strings_miner);
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
            onClick: (state) => {
                state.up_quarks_miner++;
                return state;
            },
            onTick: (state) => {
                state.up_quarks += Math.round(_.random(0, state.up_quarks_miner / 2));
                return state;
            }
        },

        down_quarks_miner: {
            name: 'Down Quarks Miner',
            text: 'Synths Down Quarks once in a tick',
            cost: (state) => {
                return {down_quarks: Math.floor(Math.pow(1.5, state.down_quarks_miner - 1) * 20)};
            },
            locked: (state) => !state.strings_miner,
            onClick: (state) => {
                state.down_quarks_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.down_quarks_miner >= 1) {
                    state.down_quarks += Math.round(_.random(0, state.down_quarks_miner / 2));
                }

                return state;
            }
        },

        protons_miner: {
            name: 'Proton Miner',
            cost: (state) => {
                return {
                    up_quarks: Math.floor(Math.pow(1.5, state.protons_miner - 1) * 80),
                    down_quarks: Math.floor(Math.pow(1.5, state.protons_miner - 1) * 35)
                };
            },
            locked: (state) => !state.up_quarks_miner,
            onClick: (state) => {
                state.protons_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.protons_miner >= 1) {
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
            onClick: (state) => {
                state.neutrons_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.neutrons_miner >= 1) {
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
                    neutrons: Math.floor(Math.pow(1.5, state.hydrogen_miner - 1) * 17.5)
                };
            },
            locked: (state) => !state.achievements.includes('hydrogen'),
            onClick: (state) => {
                state.hydrogen_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.hydrogen_miner >= 1) {
                    state.hydrogen += Math.round(_.random(1, state.hydrogen_miner / 4));
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
                    neutrons: Math.floor(Math.pow(1.5, state.helium_miner - 1) * 17.5)
                };
            },
            locked: (state) => !state.achievements.includes('hydrogen'),
            onClick: (state) => {
                state.helium_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.helium_miner >= 1) {
                    state.helium += Math.round(_.random(1, state.helium_miner / 4));
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
            onClick: (state) => {
                state.H2_converter++;
                return state;
            },
            onTick: (state) => {
                if (state.H2_converter >= 1 && state.hydrogen >= 2) {
                    state.hydrogen -= _.random(5, state.H2_converter * 2);
                    state.H2 += state.H2_converter * 2;
                }
                return state;

            }
        },
    }
};