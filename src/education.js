//import _ from 'lodash';

export const education = {
   start_game: {
       name: 'Retrieve stars from the Black Hole',
       text: '',
       image: '',
       showOn: (state) => state.black_hole.length < 1,
   },

    atom: {
        name: 'First atom',
        text: 'First atom assembled',
        image: '',
        showOn: (state) => state.black_hole.length < 1,
    },

    system_creation: {
        name: 'Systems can be formed',
        text: 'First atom assembled',
        image: '',
        showOn: (state) => state.black_hole.length < 1,
    },

    life_forms: {
        name: 'First atom',
        text: 'First atom assembled',
        image: '',
        showOn: (state) => state.black_hole.length < 1,
    }
};
