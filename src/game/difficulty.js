
import _ from 'lodash';


const select_difficulty_helper = (state, key) => {
    state.difficulty = key;
    state.space = _.clone(difficulty[key].space);
    state.dust = _.clone(difficulty[key].dust);
    return state;
};


export const difficulty = {
    nursery: {
        name: 'Start in Stellar Nursery',
        text: 'The most favorable areas for creating stars are molecular clouds, sometimes also called stellar nursery.',
        onClick: state => {
            state = select_difficulty_helper(state, 'nursery');
            state.game_paused = false;
            return state;
        },
        space: {
            electrons: 100000,
            neutrino: 100000,
            photons: 100000,
            protons: 100000,
            neutrons: 100000,
        },
        dust: {
            hydrogen: 10000000,
            helium: 1000000,
            carbon: 0,
            oxygen: 0,
            nitrogen: 0,
            aluminium: 0,
            silicon: 0,
            ferrum: 0,
        },
    },
    core: {
        name: 'Start at Galaxy Core',
        text: 'Near the active core of the galaxy there are many neutron stars, photons and heavy elements, but a shortage of hydrogen, which was already wasted on star-forming earlier.',
        onClick: state => {
            state = select_difficulty_helper(state, 'core');
            state.game_paused = false;
            return state;
        },
        space: {
            electrons: 10000,
            neutrino: 100000,
            photons: 10000000,
            protons: 10000,
            neutrons: 10000,
        },
        dust: {
            hydrogen: 1000000,
            helium: 250000,
            carbon: 50000,
            oxygen: 25000,
            nitrogen: 10000,
            aluminium: 5000,
            silicon: 2500,
            ferrum: 1000,
        },
    },
    dark: {
        name: 'Start in Dark Matter',
        text: 'The galaxy is surrounded by a huge cloud of Dark Matter. Its mass is ten times higher than the mass of all the stars and nebulae. But mining Dark Matter is not so easy.',
        onClick: state => {
            state = select_difficulty_helper(state, 'dark');
            state.game_paused = false;
            return state;
        },
        space: {
            electrons: 1000,
            neutrino: 100000000,
            photons: 1000,
            protons: 10000,
            neutrons: 1000,
        },
        dust: {
            hydrogen: 10000,
            helium: 5000,
            carbon: 2500,
            oxygen: 1000,
            nitrogen: 500,
            aluminium: 250,
            silicon: 100,
            ferrum: 50,
        },
    },
};