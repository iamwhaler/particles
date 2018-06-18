//import _ from 'lodash';

export const clickers = {
    strings_clicker: {
        name: 'Fluctuate string', cost: false, locked: (state) => state.tick < 10, onClick: (state) => {
            state.strings++;
            return state;
        }
    },

    up_quarks_clicker: {
        name: 'Gain Up Quark',
        cost: {strings: 4},
        text: 'Information about Cards resource which also explains its functionality. Information about Cards resource which also explains its functionality',
        locked: (state) => state.tick < 20,
        onClick: (state) => {
            state.up_quarks++;
            return state;
        }
    },
    down_quarks_clicker: {
        name: 'Gain Down Quark', cost: {strings: 4}, locked: (state) => !state.up_quarks_miner, onClick: (state) => {
            state.down_quarks++;
            return state;
        }
    },

    electrons_clicker: {
        name: 'Gain Electron',
        cost: {down_quarks: 4},
        locked: (state) => !state.down_quarks_miner,
        onClick: (state) => {
            state.electrons++;
            return state;
        }
    },

    protons_clicker: {
        name: 'Gain Proton',
        cost: {up_quarks: 2, down_quarks: 1},
        locked: (state) => state.up_quarks < 2 && state.down_quarks < 1,
        onClick: (state) => {
            state.protons++;
            return state;
        }
    },

    neutrons_clicker: {
        name: 'Gain Neutron',
        cost: {up_quarks: 1, down_quarks: 2},
        locked: (state) => state.up_quarks < 1 && state.down_quarks < 2,
        onClick: (state) => {
            state.neutrons++;
            return state;
        }
    },

    hydrogen_clicker: {
        name: 'Synth Hydrogen',
        cost: {protons: 1, neutrons: 1, electrons: 1},
        locked: (state) => state.protons < 1 && state.neutrons < 1 && state.electrons < 1,
        onClick: (state) => {
            state.hydrogen++;
            return state;
        }
    }
}