import {clickers} from "./clickers";

export const data = {
    basic_particles: {
        strings: {name: 'Strings'},
        up_quarks: {name: 'Up Quarks'},
        down_quarks: {name: 'Down Quarks', locked: (state) => clickers.basic_particles.down_quarks_clicker.locked(state)},
        electrons: {name: 'Electrons', locked: (state) => clickers.basic_particles.electrons_clicker.locked(state)},
        protons: {name: 'Protons', locked: (state) => clickers.basic_particles.protons_clicker.locked(state)},
        neutrons: {name: 'Neutrons', locked: (state) => clickers.basic_particles.neutrons_clicker.locked(state)}
    },

    atoms: {
        hydrogen: {name: 'Hydrogen', locked: (state) => clickers.atoms.hydrogen_clicker.locked(state)},
        helium: {name: 'Helium', locked: (state) => clickers.atoms.helium_clicker.locked(state)},
    },

    simple_molecules: {
        H2: {name: 'H2', locked: (state) => !state.achievements.includes('hydrogen')},
        He2: {name: 'He2', locked: (state) => !state.achievements.includes('helium')},
        N2: {name: 'N2', locked: (state) => !state.achievements.includes('nitrogen')},
    },

    stars: {
        hydrogen_stars: {name: 'Hydrogen stars'},
        helium_stars: {name: 'Helium stars'}

    }
};