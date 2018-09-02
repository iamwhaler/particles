import {clickers} from "./clickers";

export const data = {
    basic_particles: {
        strings: {name: 'Strings'},
        gluons: {name: 'Gluons', locked: (state) => clickers.basic_particles.gluons_clicker.locked(state)},
        up_quarks: {name: 'Up Quarks'},
        down_quarks: {name: 'Down Quarks', locked: (state) => clickers.basic_particles.down_quarks_clicker.locked(state)},
        photons: {name: 'Photons', locked: (state) => clickers.basic_particles.photons_clicker.locked(state)},
        electrons: {name: 'Electrons', locked: (state) => clickers.basic_particles.electrons_clicker.locked(state)},
        protons: {name: 'Protons', locked: (state) => clickers.basic_particles.protons_clicker.locked(state)},
        neutrons: {name: 'Neutrons', locked: (state) => clickers.basic_particles.neutrons_clicker.locked(state)},
        neutrino: {name: 'Neutrino', locked: (state) => clickers.basic_particles.neutrino_clicker.locked(state)},
    },

    atoms: {
        beryllium: {name: 'Beryllium', locked: (state) => clickers.atoms.beryllium_clicker.locked(state)},
        hydrogen: {name: 'Hydrogen', locked: (state) => clickers.atoms.hydrogen_clicker.locked(state)},
        helium: {name: 'Helium', locked: (state) => clickers.atoms.helium_clicker.locked(state)},
        carbon: {name: 'Carbon', locked: (state) => state.carbon<10},
        nitrogen: {name: 'Nitrogen', locked: (state) => state.nitrogen<15}

    },

    simple_molecules: {
        H2: {name: 'H2', locked: (state) => !state.achievements.includes('hydrogen')},
        He2: {name: 'He2', locked: (state) => !state.achievements.includes('helium')},
        N2: {name: 'N2', locked: (state) => !state.achievements.includes('nitrogen')},
        C2: {name: 'C2', locked: (state) => !state.achievements.includes('carbon')}
    },

    stars: {
        hydrogen_stars: {name: 'Hydrogen'},
        helium_stars: {name: 'Helium'},
        carbon_stars: {name: 'Carbon'}
    }
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
    simple_molecules: {
        name: 'Simple molecules',
        info: 'Molecules will form stars and other objects in your universe. Mining of them will result in huge temperature raise'
    }
};
