


const buy_rocket_helper = (state, name) => {
    state.terraformers[name]++;
    return state;
};


export const terraformers = {
    /*
 clean: {
     name: 'Rocket ', text: 'Rocket Text',
     cost: {
         hydrogen: 0,
         helium: 0,
         carbon: 0,
         oxygen: 0,
         nitrogen: 0,
         silicon: 0,
         ferrum: 0
     },
     locked: state => false,
     target_type: 'planets',
     onClick: state => buy_rocket_helper(state, 'clean'),
     onLaunch: (state, system_id, target_id) => {
     return state;
     }
 },
     */


    hydrogen: { name: 'Hydrogen Terraformer', text: 'Destroy target Planet',
        cost: {
            'storage.hydrogen': 10000
        },
        key: 'hydrogen',
        locked: state => false,
        target_type: 'planets',
        onClick: state => buy_rocket_helper(state, 'hydrogen'),
        onLaunch: (state, system_id, target_id) => {
            return state;
        }
    },

    helium: { name: 'Helium Terraformer', text: 'Add Helium to target Star Core',
        cost: {
            'storage.hydrogen': 10000,
            'storage.helium': 10000
        },
        key: 'helium',
        locked: state => false,
        target_type: 'planets',
        onClick: state => buy_rocket_helper(state, 'helium'),
        onLaunch: (state, system_id, target_id) => {
            return state;
        }
    },

    carbon: { name: 'Carbon Terraformer', text: 'Mine resources from target Planet',
        cost: {
            'storage.hydrogen': 10000,
            'storage.carbon': 10000
        },
        key: 'carbon',
        locked: state => false,
        target_type: 'planets',
        onClick: state => buy_rocket_helper(state, 'carbon'),
        onLaunch: (state, system_id, target_id) => {
            return state;
        }
    },

    nitrogen: { name: 'Nitrogen Terraformer', text: 'Fertilize target Planet a little',
        cost: {
            'storage.helium': 10000,
            'storage.nitrogen': 10000
        },
        key: 'nitrogen',
        locked: state => false,
        target_type: 'planets',
        onClick: state => buy_rocket_helper(state, 'nitrogen'),
        onLaunch: (state, system_id, target_id) => {
            return state;
        }
    },

    oxygen: { name: 'Oxygen Terraformer', text: 'Rocket Text',
        cost: {
            'storage.helium': 10000,
            'storage.nitrogen': 10000,
            'storage.oxygen': 10000
        },
        key: 'oxygen',
        locked: state => false,
        target_type: 'planets',
        onClick: state => buy_rocket_helper(state, 'oxygen'),
        onLaunch: (state, system_id, target_id) => {
            return state;
        }
    },

    silicon: { name: 'Silicon Terraformer', text: 'Rocket Text',
        cost: {
            'storage.hydrogen': 10000,
            'storage.carbon': 10000,
            'storage.nitrogen': 10000,
            'storage.silicon': 10000
        },
        key: 'silicon',
        locked: state => false,
        target_type: 'planets',
        onClick: state => buy_rocket_helper(state, 'silicon'),
        onLaunch: (state, system_id, target_id) => {
            return state;
        }
    },

    ferrum: { name: 'Ferrum Terraformer', text: 'Rocket Text',
        cost: {
            'storage.helium': 10000,
            'storage.carbon': 10000,
            'storage.silicon': 10000,
            'storage.ferrum': 10000
        },
        key: 'ferrum',
        locked: state => false,
        target_type: 'planets',
        onClick: state => buy_rocket_helper(state, 'ferrum'),
        onLaunch: (state, system_id, target_id) => {
            return state;
        }
    },

};