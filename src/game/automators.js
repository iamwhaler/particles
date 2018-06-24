import _ from 'lodash';

// onClick effect costs item.cost

export const automators = {
    strings_miner: {
        name: 'Strings Miner',
        cost: {strings: 10},
        locked: (state) => state.tick < 10,
        onClick: (state) => {
            state.strings_miner++;
            return state;
        },
        onTick: (state) => {
            console.log(state);
            state.strings += _.random(0, state.strings_miner);
            return state;
        }
    },
    up_quarks_miner: {
        name: 'Up Quarks Miner', cost: {up_quarks: 100}, locked: (state) => !state.strings_miner, onClick: (state) => {
            state.up_quarks_miner++;
            return state;
        }, onTick: (state) => {
            state.up_quarks += Math.round(_.random(0, state.up_quarks_miner / 2));
            return state;
        }
    },

    down_quarks_miner: {
        name: 'Down Quarks Miner',
        cost: {down_quarks: 80},
        locked: (state) => !state.strings_miner,
        onClick: (state) => {
            state.down_quarks_miner++;
            return state;
        },
        onTick: (state) => {
            if(state.down_quarks_miner>=1) {
                state.down_quarks += Math.round(_.random(0, state.down_quarks_miner / 2));
            }

            return state;
        }
    },

    hydrogen_miner: {
        name: 'Hydrogen Miner',
        text: 'The only way to get Hydrogen in this Universe',
        cost: {electrons: 10, protons: 5, neutrons: 17.5},
        locked: (state) => false,
        onClick: (state) => {
            state.hydrogen_miner++;
            return state;
        },
        onTick: (state) => {
            if(state.hydrogen_miner>=1) {
                state.hydrogen += Math.round(_.random( 1 / state.temperature,  0.75));
            }
            return state;

        }
    }
};