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

    refresh_temperature: {
        name: 'Cool temperature', text: 'Temperature gets lower consuming strings',
        cost: {strings: 10}, locked: (state) => false,
        onClick: (state) => {
            switch (document.getElementById('refresh_temperature').className) {
                case "switchOn" :
                    toastr.info('Temperature cooler is turned off');
                    document.getElementById('refresh_temperature').classList.remove("switchOn");
                    break;
                default :
                    toastr.info('Temperature cooler is turned on');
                    document.getElementById('refresh_temperature').classList.add("switchOn");
                    break;
            }
        },

        onTick: (state) => {

            if (document.getElementById('refresh_temperature').className==="switchOn") {
                if(state.strings>5) {
                    state.strings -= _.random(1, 5);
                    state.temperature -= _.random(30, 60);
                }
            }
            else {return state}
            return state
        }
    }

};