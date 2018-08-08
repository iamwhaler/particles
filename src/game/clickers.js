//import _ from 'lodash';

export const clickers = {

    basic_particles: {
        strings_clicker: {
            name: 'Fluctuate String',
            text: 'String is one-dimensional extended objects',
            cost: false,
            locked: (state) => state.temperature>3000,
            onClick: (state) => {
                state.strings++;
                return state;
            }
        },

        gluons_clicker: {
            name: 'Form gluon',
            text: 'Gluon allows to connect quarks between each other',
            cost: {strings: 1},
            locked: (state) => state.temperature>5000,
            onClick: (state) => {
                state.gluons++;
                return state;
            }
        },

        up_quarks_clicker: {
            name: 'Gain Up Quark',
            cost: {strings: 1},
            text: 'The lightest of all quarks, forms protons and neutrons',
            locked: (state) => state.tick < 6,
            onClick: (state) => {
                state.up_quarks++;
                return state;
            }
        },
        down_quarks_clicker: {
            name: 'Gain Down Quark',
            cost: {strings: 1},
            text: 'The second-lightest all quarks, forms protons and neutrons',
            locked: (state) => !state.up_quarks_miner,
            onClick: (state) => {
                state.down_quarks++;
                return state;
            }
        },

        photons_clicker: {
            name: 'Generate Photon',
            cost: {strings: 1},
            text: 'The photon is a type of elementary particle, the quantum of the electromagnetic field including electromagnetic radiation such as light, and the force carrier for the electromagnetic force',
            locked: (state) => !state.up_quarks_miner,
            onClick: (state) => {
                state.photons++;
                return state;
            }
        },

        electrons_clicker: {
            name: 'Gain Electron',
            text: 'Elementary particle, orbits the nuclei of atom',
            cost: {strings: 1},
            locked: (state) =>  !state.achievements.includes('up_quarks'),
            onClick: (state) => {
                state.electrons++;
                return state;
            }
        },

        protons_clicker: {
            name: 'Gain Proton',
            text: 'Proton has a positive electric charge and combined with neutron forms atom nuclei.',
            cost: {up_quarks: 2, down_quarks: 1, gluons: 1},
            locked: (state) => !state.achievements.includes('up_quarks'),
            onClick: (state) => {
                state.protons++;
                return state;
            }
        },

        neutrons_clicker: {
            name: 'Gain Neutron',
            text: 'Neutron has no net electric charge and forms atom nuclei.',
            cost: {up_quarks: 1, down_quarks: 2, gluons: 1},
            locked: (state) =>  !state.achievements.includes('up_quarks'),
            onClick: (state) => {
                state.neutrons++;
                return state;
            }
        },
    },

    atoms: {
        hydrogen_clicker: {
            name: 'Synth Hydrogen',
            cost: {protons: 1, electrons: 1, photons: 1},
            locked: (state) => state.protons < 1 && state.neutrons < 1 && state.electrons < 1,
            onClick: (state) => {
                state.hydrogen++;
                return state;
            }
        },


        helium_clicker: {
            name: 'Synth Helium',
            cost: {protons: 2, neutrons: 2, electrons: 2, photons: 2},
            locked: (state) => state.protons < 2 && state.neutrons < 2 && state.electrons < 2,
            onClick: (state) => {
                state.helium++;
                return state;
            }
        },
    },
}