import {clickers} from "./clickers";

export const data = {
    basic_particles: {
        electrons: {name: 'Electrons', locked: (state) => clickers.basic_particles.electrons_clicker.locked(state)},
        neutrino: {name: 'Neutrino', locked: (state) => clickers.basic_particles.neutrino_clicker.locked(state)},
        photons: {name: 'Photons', locked: (state) => clickers.basic_particles.photons_clicker.locked(state)},
        protons: {name: 'Protons', locked: (state) => clickers.basic_particles.protons_clicker.locked(state)},
        neutrons: {name: 'Neutrons', locked: (state) => clickers.basic_particles.neutrons_clicker.locked(state)},
    },

    atoms: {
        hydrogen: {name: 'Hydrogen', locked: (state) => clickers.atoms.hydrogen_clicker.locked(state)},
        helium: {name: 'Helium', locked: (state) => clickers.atoms.helium_clicker.locked(state)},
        carbon: {name: 'Carbon', locked: (state) => clickers.atoms.carbon_clicker.locked(state)},
        nitrogen: {name: 'Nitrogen', locked: (state) => clickers.atoms.nitrogen_clicker.locked(state)},
        oxygen: {name: 'Oxygen', locked: (state) => clickers.atoms.oxygen_clicker.locked(state)},
        aluminium: {name: 'Aluminium', locked: (state) => clickers.atoms.aluminium_clicker.locked(state)},
        silicon: {name: 'Silicon', locked: (state) => clickers.atoms.silicon_clicker.locked(state)},
        ferrum: {name: 'Ferrum', locked: (state) => clickers.atoms.ferrum_clicker.locked(state)},

    },

    simple_molecules: {
        H2: {name: 'H2', locked: (state) => !state.achievements.includes('hydrogen')},
        He: {name: 'He', locked: (state) => !state.achievements.includes('helium')},
        N2: {name: 'N2', locked: (state) => !state.achievements.includes('nitrogen')},
        C2: {name: 'C2', locked: (state) => !state.achievements.includes('carbon')}
    }
};

export const epochs = {
    quark_gluon_plasm_epoch: {
        condition_text: '',
        locked: () => false,
    },
    atom_epoch: {
        condition_text: 'You can not start to form atoms unless you managed a great basic particles supply',
        locked: (state) => !state.achievements.includes('up_quarks') && !state.achievements.includes('photons') && !state.achievements.includes('electrons')
    },

    galaxy_epoch: {
        condition_text: 'Galaxies will not accelerate while Hydrogen molecules supply is low',
        locked: (state) => !state.achievements.includes('protons') && !state.achievements.includes('neutrons') && !state.achievements.includes('H2')
    },


};

export const info = {
    basic_particles: {
        name: 'Basic particles',
        info: 'Basic particles form a more complex structures. It is important to keep the stream of income of this elements since it will be the base of your galaxy',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Calabi_yau_formatted.svg/1200px-Calabi_yau_formatted.svg.png'
    },
    atoms: {
        name: 'Atoms',
        info: 'Generating atoms you can raise more complex structures giving birth to stars and planets',
        image: 'https://trello-attachments.s3.amazonaws.com/5b559fc5a46db88884558253/5b604d080d2a50cae8d6d548/94a322342e35a6261bae00203adc6b6f/Hydrogen_card_small_copy.png'
    },
    automation: {
        name: 'Automation',
        info: 'The achievements of science in the service of stellar engineering',
        image: 'https://trello-attachments.s3.amazonaws.com/5b559fc5a46db88884558253/5b604d080d2a50cae8d6d548/94a322342e35a6261bae00203adc6b6f/Hydrogen_card_small_copy.png'
    },
    simple_molecules: {
        name: 'Simple molecules',
        info: 'Molecules will form stars and other objects in your universe. Mining of them will result in huge temperature raise'
    },


    photons: {
        link: 'https://en.wikipedia.org/wiki/Photon',
        fluctuator_link: ''
    },
    electrons: {
        link: 'https://en.wikipedia.org/wiki/Electron',
        fluctuator_link: ''
    },
    neutrino: {
        link: 'https://en.wikipedia.org/wiki/Neutrino'
    },

    protons: {
        link: 'https://en.wikipedia.org/wiki/Proton'
    },
    neutrons: {
        link: 'https://en.wikipedia.org/wiki/Neutron'
    },
    hydrogen: {
        link: 'https://en.wikipedia.org/wiki/Hydrogen',
        mass: 1.00794
    },
    helium: {
        link: 'https://en.wikipedia.org/wiki/Helium',
        mass: 4.002602
    },
    carbon: {
        link: 'https://en.wikipedia.org/wiki/Carbon',
        mass: 12.0107
    },
    oxygen: {
        link: 'https://en.wikipedia.org/wiki/Oxygen',
        mass: 16
    },
    nitrogen: {
        link: 'https://en.wikipedia.org/wiki/Nitrogen',
        mass: 14.0067
    },
    ferrum: {
        link: 'https://en.wikipedia.org/wiki/Iron',
        mass: 55.845
    },
    aluminium: {
        link: 'https://en.wikipedia.org/wiki/Aluminium',
        mass: 26.981539
    },
    silicon: {
        link: 'https://en.wikipedia.org/wiki/Silicon',
        mass: 28.0855
    },
};

