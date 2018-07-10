import _ from 'lodash';

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
            if (document.getElementById('switch').value === 'off') {
                document.getElementById("switch").value = "on";
                console.log('Cooler state:' + document.getElementById('switch').value);
            }
            else {
                document.getElementById("switch").value = "off";
                console.log('Cooler state:' + document.getElementById('switch').value);
            }
        }
        ,
        onTick: (state) => {

            if (document.getElementById('switch').value==="on") {
                if(state.strings>5) {
                    state.strings -= _.random(1, 5);
                    state.temperature -= 10;
                }
            }
            else {return state}
            return state
        }
    }

};