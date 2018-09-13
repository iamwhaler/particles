
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
        text: 'The most favorable areas for creating stars are molecular clouds, also called stellar nursery. It is molecular dense regions in space that sometimes collapse and form stars',
        img: './img/nursery.jpg',
        onClick: state => {
            state = select_difficulty_helper(state, 'nursery');
            state.game_paused = false;
            return state;
        },
        space: {
            protons: 100000,
            electrons: 100000,
            photons: 100000,
            neutrino: 100000,
            neutrons: 100000,
        },
        dust: {
            hydrogen: 10000000,
            helium: 1000000,
            carbon: 0,
            oxygen: 0,
            nitrogen: 0,
            silicon: 0,
            ferrum: 0,
        },
    },
    core: {
        name: 'Start at Galaxy Core',
        text: 'Near the active core of the galaxy there are many neutron stars, photons and heavy elements, but a shortage of hydrogen, which was already wasted on star-forming earlier.',
        img: './img/core.jpg',
        onClick: state => {
            state = select_difficulty_helper(state, 'core');
            state.game_paused = false;
            return state;
        },
        space: {
            protons: 10000,
            electrons: 10000,
            photons: 10000000,
            neutrino: 100000,
            neutrons: 10000,
        },
        dust: {
            hydrogen: 1000000,
            helium: 250000,
            carbon: 50000,
            oxygen: 25000,
            nitrogen: 10000,
            silicon: 2500,
            ferrum: 1000,
        },
    },
    dark: {
        name: 'Start in Dark Matter',
        text: 'The galaxy is surrounded by a huge cloud of Dark Matter. Its mass is ten times higher than the mass of all the stars and nebulae. But mining Dark Matter is not so easy.',
        img: './img/dark_matter.jpg',
        onClick: state => {
            state = select_difficulty_helper(state, 'dark');
            state.game_paused = false;
            return state;
        },
        space: {
            protons: 10000,
            electrons: 1000,
            photons: 1000,
            neutrino: 100000000,
            neutrons: 1000,
        },
        dust: {
            hydrogen: 10000,
            helium: 5000,
            carbon: 2500,
            oxygen: 1000,
            nitrogen: 500,
            silicon: 100,
            ferrum: 50,
        },
    },
};