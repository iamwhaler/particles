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

    refresh_temperature: {
        name: 'Cool temperature', text: 'Temperature gets lower consuming strings',
        cost: {strings: 10}, locked: (state) => false,
        onClick: (state) => {
                if (document.getElementById('refresh_temperature').className!=='switchOn') {
                    toastr.info('Temperature cooler is turned on');
                    document.getElementById('refresh_temperature').classList.add("switchOn");
                }
                else {
                    toastr.info('Temperature cooler is turned off');
                    document.getElementById('refresh_temperature').classList.remove("switchOn");
                }
         },

        onTick: (state) => {

            if (document.getElementById('refresh_temperature').className==="switchOn") {
                if(state.strings>5) {
                    state.strings -= _.random(1, 5);
                    state.temperature -= _.random(10, 20);
                }
            }
            else {return state}
            return state
        }
    }

};