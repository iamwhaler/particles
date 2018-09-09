import _ from 'lodash';

const default_state = {

    space: {
        photons: 0,
        electrons: 0,
        neutrino: 0,
        protons: 0,
        neutrons: 0,
    },

    field: {
        photons: 0,
        electrons: 10000,
        neutrino: 0,
        protons: 0,
        neutrons: 0,
    },

    dust: {
        hydrogen: 0,
        helium: 0,
        carbon: 0,
        oxygen: 0,
        nitrogen: 0,
        aluminium: 0,
        silicon: 0,
        ferrum: 0,
    },

    storage: {
        hydrogen: 0,
        helium: 0,
        carbon: 0,
        oxygen: 0,
        nitrogen: 0,
        aluminium: 0,
        silicon: 0,
        ferrum: 0,
    },


    assemblers: {
        hydrogen: 0,
        helium: 0,
        carbon: 0,
        oxygen: 0,
        nitrogen: 0,
        aluminium: 0,
        silicon: 0,
        ferrum: 0,
    },

    toggle: {
        pump: true,
        riddle: true, 
        protonator: true,
        
        hydrogen: true,
        helium: true,
        carbon: true,
        oxygen: true,
        nitrogen: true,
        aluminium: true,
        silicon: true,
        ferrum: true,
        
        hydrogen_assembler: true,
        helium_assembler: true,
        carbon_assembler: true,

    },



    // old shit?

    hydrogen: 0,
    helium: 0,
    N2: 0,
    C2: 0,

    CN: 0,
    CH: 0,


    pump: 0,
    riddle: 0,
    protonator: 0,

    protons_miner: 0,
    neutrons_miner: 0,
    beryllium_miner: 0,
    hydrogen_miner: 0,
    helium_miner: 0,


    hydrogen_assembler: 0,
    helium_assembler: 0,
    carbon_assembler: 0,


    micro_swiper: false,

    black_hole: [],

    achievements: [],
    universe_name: '',
    universe_size: 0,


    chat: [],

     /*
    systems: [
            {name: 'System 1', mater: {'hydrogen': 162000, 'helium': 42000},
                stars: [
                    {name: 'Star 1', mater: {'hydrogen': 16200, 'helium': 4200}},
                    {name: 'Star 2', mater: {'hydrogen': 1620, 'helium': 420}},
                ],
                planets: [
                    {name: 'Planet 1', mater: {'carbon': 162, 'nitrogen': 42}},
                    {name: 'Planet 2', mater: {'hydrogen': 1620, 'helium': 420}},
                ]
            },
            {name: 'System 2', mater: {'hydrogen': 162000, 'helium': 42000},
                stars: [
                    {name: 'Star 1', mater: {'hydrogen': 16200, 'helium': 4200}},
                    {name: 'Star 2', mater: {'hydrogen': 1620, 'helium': 420}},
                ],
                planets: [
                    {name: 'Planet 1', mater: {'carbon': 162, 'nitrogen': 42}},
                    {name: 'Planet 2', mater: {'hydrogen': 1620, 'helium': 420}},
                ]
            }
        ],
     */

    systems: [],

    selected_galaxy: null,
    selected_system: null,
    selected_star: null,
    selected_planet: null,

    game_speed: 1000,
    game_speed_multiplier: 1,
    tick: 0,
    game_started: false,
    difficulty: false,
    game_paused: true,
    music_paused: false,
    track_playing: 0,
    game_end: false
};

export const getDefaultState = () => {
    return _.cloneDeep(default_state);
};