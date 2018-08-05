import _ from 'lodash';
import toastr from 'toastr';

toastr.options = {
    timeOut: 2500,
    closeButton: true,
    preventDuplicates: false,
    extendedTimeOut: 1000,
    escapeHtml: false
};

export const oneclickers = {
    fluctuating: {
        name: 'String convertor', text: 'Strings will automatically convert into quarks or leptons',
        cost: {strings: 10}, locked: (state) => !state.strings_miner, onClick: (state) => {
            state.fluctuating = true;
            return state;
        }
    },

    micro_swiper: {
        name: 'Micro Swiper', text: 'Allows manage basic particles on more global level',
        cost: {carbon: 20, nitrogen: 10}, locked: (state) => !state.H2_converter,
        onClick: (state) => {
            state.micro_swiper = true;
            return state;
        }
    },


};