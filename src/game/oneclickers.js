//import _ from 'lodash';

export const oneclickers = {
    fluctuating: {
        name: 'String convertor', text: 'Strings will automatically convert into quarks or leptons',
        cost: {strings: 10}, locked: (state) => !state.strings_miner, onClick: (state) => {
            state.fluctuating = true;
            return state;
        }
    },

    refresh_temperature: {
        name: 'Refresh temperature', text: 'Refresh temperature once in a while',
        cost: {strings: 10}, locked: (state) => false, onClick: (state) => {
            state.temperature-=1000;
            return state;
        }
    }

};