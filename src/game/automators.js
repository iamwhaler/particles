import _ from 'lodash';

// onClick effect costs item.cost

export const automators = {
    miners: {
        strings_miner: {
            name: 'Strings Miner',
            cost: {strings: 20},
            locked: (state) => state.tick < 10,
            onClick: (state) => {
                state.strings_miner++;
                return state;
            },
            onTick: (state) => {
                console.log(state);
                state.strings += _.random(1, state.strings_miner);
                console.log(_.random(1, state.strings_miner));
                return state;
            }
        },
        up_quarks_miner: {
            name: 'Up Quarks Miner',
            cost: {up_quarks: 40},
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
            cost: {down_quarks: 40},
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
            cost: {up_quarks: 80, down_quarks: 35},
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
            cost: {up_quarks: 90, down_quarks: 150},
            locked: (state) => !state.down_quarks_miner,
            onClick: (state) => {
                state.neutrons_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.neutrons_miner >= 1) {
                    state.neutrons += Math.round(_.random(0, state.neutrons_miner * 0.5));
                }
                return state;
            }
        },

        hydrogen_miner: {
            name: 'Hydrogen Miner',
            text: 'The only way to get Hydrogen in this Universe.' +
            'It really depends on the temperature.',
            cost: {electrons: 10, protons: 5, neutrons: 17.5},
            locked: (state) => false,
            onClick: (state) => {
                state.hydrogen_miner++;
                return state;
            },
            onTick: (state) => {
                if (state.hydrogen_miner >= 1) {
                    state.hydrogen += Math.round(_.random(1 / state.temperature, state.hydrogen_miner / 4));
                }
                return state;

            }
        },

    },

    converters: {
        H2_converter: {
            name: 'H2 Converter',
            text: 'The only way to get Hydrogen in this Universe.' +
            'It really depends on the temperature.',
            cost: {hydrogen: 20, H2: 5},
            locked: (state) => false,
            onClick: (state) => {
                state.H2_converter++;
                return state;
            },
            onTick: (state) => {
                if (state.H2_converter >= 1 && state.hydrogen>=2) {
                    state.H2 += state.H2_converter * 2;
                    state.hydrogen -= _.random(state.H2_converter, state.hydrogen);
                }
                return state;

            }
        },
    }
};