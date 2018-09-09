import _ from 'lodash';

const default_state = {

    space: {
        electrons: 100000,
        neutrino: 1000000,
        photons: 100000,
        protons: 10000,
        neutrons: 10000,
    },

    field: {
        electrons: 1000,
        neutrino: 10000,
        photons: 1000,
        protons: 10000,
        neutrons: 1000,
    },

    field_level: 1,

    dust: {
        hydrogen: 10000000,
        helium: 1000000,
        carbon: 100000,
        oxygen: 10000,
        nitrogen: 1000,
        aluminium: 1000,
        silicon: 1000,
        ferrum: 1000,
    },

    storage: {
        hydrogen: 1000000,
        helium: 0,
        carbon: 0,
        oxygen: 0,
        nitrogen: 0,
        aluminium: 0,
        silicon: 0,
        ferrum: 0,
    },

    storage_level: 1,


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
        panel: true,
        pump: true,
        polarizer: true,
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

    panel: 0,
    pump: 0,
    polarizer: 0,
    protonator: 0,

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
    game_paused: true,
    music_paused: false,
    track_playing: 0,
    game_end: false
};

export const getDefaultState = () => {
    return _.cloneDeep(default_state);
};