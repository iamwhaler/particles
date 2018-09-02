import _ from 'lodash';
import confirm from '../components/confirm_launch';
import {getDefaultState} from '../game/default_state';

export const clickers = {

    basic_particles: {
        strings_clicker: {
            name: 'Fluctuate String',
            resource: 'strings',
            text: 'String is one-dimensional extended objects',
            cost: false,
            locked: (state) => false,
            onClick: (state) => {
                //state.strings++;
                return state;
            }
        },

        gluons_clicker: {
            name: 'Form gluon',
            resource: 'gluons',
            text: 'Gluon allows to connect quarks between each other',
            cost: {strings: 1, tick: 1},
            locked: (state) => state.temperature>Math.pow(10, 27),
            onClick: (state) => {
                state.gluons++;
                return state;
            }
        },

        up_quarks_clicker: {
            name: 'Gain Up Quark',
            resource: 'up_quarks',
            cost: {strings: 1},
            text: 'The lightest of all quarks, forms protons and neutrons',
            locked: (state) => state.temperature>Math.pow(10, 27),
            onClick: (state) => {
                state.up_quarks++;
                return state;
            }
        },
        down_quarks_clicker: {
            name: 'Gain Down Quark',
            resource: 'down_quarks',
            cost: {strings: 1},
            text: 'The second-lightest all quarks, forms protons and neutrons',
            locked: (state) => state.temperature>Math.pow(10, 27),
            onClick: (state) => {
                state.down_quarks++;
                return state;
            }
        },

        electrons_clicker: {
            name: 'Gain Electron',
            resource: 'electrons',
            text: 'Elementary particle, orbits the nuclei of atom',
            cost: {strings: 1},
            locked: (state) => state.temperature>Math.pow(10, 27),
            onClick: (state) => {
                state.electrons++;
                return state;
            }
        },

        photons_clicker: {
            name: 'Generate Photon',
            resource: 'photons',
            cost: {strings: 1},
            text: 'The photon is a type of elementary particle, the quantum of the electromagnetic field including electromagnetic radiation such as light, and the force carrier for the electromagnetic force',
            locked: (state) => state.temperature>Math.pow(10, 21),
            onClick: (state) => {
                state.photons++;
                return state;
            }
        },

        protons_clicker: {
            name: 'Gain Proton',
            resource: 'protons',
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
            resource: 'neutrons',
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
            resource: 'hydrogen',
            cost: {protons: 1, electrons: 1, photons: 1},
            locked: (state) => state.protons < 1 && state.neutrons < 1 && state.electrons < 1,
            onClick: (state) => {
                state.hydrogen++;
                return state;
            }
        },


        helium_clicker: {
            name: 'Synth Helium',
            resource: 'helium',
            cost: {protons: 2, neutrons: 2, electrons: 2, photons: 2},
            locked: (state) => state.achievements.includes('Rising Star'),
            onClick: (state) => {
                state.helium++;
                return state;
            }
        },

        beryllium_clicker: {
            name: 'Synth Beryllium',
            resource: 'beryllium',
            cost: {protons: 4, electrons: 4, neutrons: 4, photons: 4},
            locked: (state) => state.achievements.includes('hydrogen'),
            onClick: (state) => {
                state.beryllium++;
                return state;
            }
        },

        carbon_clicker: {
            name: 'Synth Carbon',
            resource: 'carbon',
            cost: {protons: 6, neutrons: 6, electrons: 6, photons: 6},
            locked: (state) => state.carbon<100,
            onClick: (state) => {
                state.carbon++;
                return state;
            }
        },

        nitrogen_clicker: {
            name: 'Synth Nitrogen',
            resource: 'nitrogen',
            cost: {protons: 7, neutrons: 7, electrons: 7, photons: 7},
            locked: (state) => state.nitrogen<50,
            onClick: (state) => {
                state.nitrogen++;
                return state;
            }
        },
    },

    black_holes: {
        black_hole: {
            name: 'Retrieve stars from the Black Hole',
            cost: false,
            isLocked: (state) => state.black_hole.length<1,
            onClick: (state) => {
                confirm('Do you really want to retrieve your stars from the black hole? Your other progress will be lost').then(

                    () => {
                        let saved_stars = _.cloneDeep(state.black_hole);
                        let saved_tick = state.tick;
                        let saved_achievement = _.cloneDeep(state.achievements);
                        console.log(state.black_hole);
                        state = getDefaultState();
                        state.tick = saved_tick;
                        state.stars = saved_stars;
                        state.achievements = saved_achievement;
                        state.black_hole = [];
                        state.game_paused = false;
                        console.log(state);
                        return state
                    },
                    () => {return state}
                )

            }
        },
    },
};