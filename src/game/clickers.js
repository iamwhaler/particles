import _ from 'lodash';
import confirm from '../components/confirm_launch';
import {getDefaultState} from '../game/default_state';

export const clickers = {

    basic_particles: {

        electrons_clicker: {
            name: 'Gain Electron',
            resource: 'electrons',
            text: 'Elementary particle, orbits the nuclei of atom',
            cost: {strings: 1},
            locked: (state) => state.temperature>Math.pow(10, 12),
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
            locked: (state) => false,
            onClick: (state) => {
                state.photons++;
                return state;
            }
        },

        protons_clicker: {
            name: 'Gain Proton',
            resource: 'protons',
            text: 'Proton has a positive electric charge and combined with neutron forms atom nuclei.',
            cost: {up_quarks: 2, down_quarks: 1},
            locked: () => false,
            onClick: (state) => {
                state.protons++;
                return state;
            }
        },

        neutrons_clicker: {
            name: 'Gain Neutron',
            resource: 'neutrons',
            text: 'Neutron has no net electric charge and forms atom nuclei.',
            cost: {up_quarks: 1, down_quarks: 2},
            locked: () => false,
            onClick: (state) => {
                state.neutrons++;
                return state;
            }
        },

        neutrino_clicker: {
            name: 'Generate Neutrino',
            resource: 'neutrino',
            cost: {strings: 1},
            text: 'A neutrino is a fermion that interacts only via the weak subatomic force and gravity. The mass of the neutrino is much smaller than that of the other known elementary particles.',
            locked: (state) => false,
            onClick: (state) => {
                state.neutrino++;
                return state;
            }
        },

    },

    atoms: {

        hydrogen_clicker: {
            name: 'Synth Hydrogen',
            resource: 'hydrogen',
            text: 'Hydrogen is basic atom which will form your first stars and new atoms as a result. It is the most common atom in the universe',
            cost: {protons: 1, electrons: 1, photons: 1},
            locked: (state) => state.protons < 1 && state.electrons < 1 && state.photons < 2,
            onClick: (state) => {
                state.hydrogen++;
                return state;
            }
        },


        helium_clicker: {
            name: 'Synth Helium',
            resource: 'helium',
            text: 'Colorless, odorless, tasteless, non-toxic, inert, monatomic nobel gas. It is the second most common atom in the universe',
            cost: {protons: 2, neutrons: 2, electrons: 2, photons: 2},
            locked: (state) => state.protons < 2 && state.neutrons < 2 && state.electrons < 2 && state.photons < 2,
            onClick: (state) => {
                state.helium++;
                return state;
            }
        },


        carbon_clicker: {
            name: 'Synth Carbon',
            resource: 'carbon',
            text: 'It is nonmetallic and tetravalent — making four electrons available to form covalent chemical bonds.  its unique diversity of organic compounds, and its unusual ability to form polymers at the temperatures commonly encountered on the planet Earth',
            cost: {protons: 6, neutrons: 6, electrons: 6, photons: 6},
            locked: (state) => state.protons < 6 && state.neutrons < 6 && state.electrons < 6 && state.photons < 6,
            onClick: (state) => {
                state.carbon++;
                return state;
            }
        },

        nitrogen_clicker: {
            name: 'Synth Nitrogen',
            resource: 'nitrogen',
            text: 'It is a common element in the universe, estimated at about seventh in total abundance in the Milky Way and the Solar System. It will probably play a huge role in life forms creation',
            cost: {protons: 7, neutrons: 7, electrons: 7, photons: 7},
            locked: (state) => state.protons < 7 && state.neutrons < 7 && state.electrons < 7 && state.photons < 7,
            onClick: (state) => {
                state.nitrogen++;
                return state;
            }
        },


        oxygen_clicker: {
            name: 'Synth Oxygen',
            resource: 'oxygen',
            text: '',
            cost: {protons: 8, neutrons: 8, electrons: 8, photons: 8},
            locked: (state) => state.protons < 8 && state.neutrons < 8 && state.electrons < 8 && state.photons < 8,
            onClick: (state) => {
                state.oxygen++;
                return state;
            }
        },

        aluminium_clicker: {
            name: 'Synth Neon',
            resource: 'aluminium',
            cost: {protons: 13, neutrons: 14, electrons: 13, photons: 13},
            locked: (state) => state.protons < 5 && state.neutrons < 5 && state.electrons < 5 && state.photons < 5,
            onClick: (state) => {
                state.aluminium++;
                return state;
            }
        },

        silicon_clicker: {
            name: 'Synth Silicon',
            resource: 'silicon',
            cost: {protons: 7, neutrons: 7, electrons: 7, photons: 7},
            locked: (state) => state.protons < 7 && state.neutrons < 7 && state.electrons < 7 && state.photons < 7,
            onClick: (state) => {
                state.silicon++;
                return state;
            }
        },

        ferrum_clicker: {
            name: 'Synth Ferrum',
            resource: 'ferrum',
            cost: {protons: 13, neutrons: 13, electrons: 13, photons: 13},
            locked: (state) => state.protons < 13 && state.neutrons < 13 && state.electrons < 13 && state.photons < 13,
            onClick: (state) => {
                state.ferrum++;
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
                confirm('Do you really want to retrieve your stars from the black hole? Your progress will be lost').then(

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

    field: {
        name: 'Upgrade Field',
        cost: (state) => {
            return{'field.electrons': Math.floor(Math.pow(2, state.field_level -1)*4)}},
        isLocked: (state) => false,
        onClick: (state) => {
            state.field_level++;
            state.field_capacity=state.field_level*Math.pow(10,5.2);
            return state;
        }
    },
    storage: {
        name: 'Upgrade Storage',
        cost: (state) => {
            return{'field.electrons': Math.floor(Math.pow(2, state.storage_level -1)*4)}},
        isLocked: (state) => false,
        onClick: (state) => {
            state.storage_level++;
            state.storage_capacity=state.storage_level*Math.pow(10,5.3);
            return state;
        }
    }
};