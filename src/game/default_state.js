import _ from 'lodash';

const default_state = {

    space: {
        protons: 0,
        electrons: 0,
        photons: 0,
        neutrino: 0,
        neutrons: 0,
    },

    field: {
        protons: 420,
        electrons: 0,
        photons: 0,
        neutrino: 0,
        neutrons: 0,
    },

    field_level: 1,
    field_capacity: 1000,

    dust: {
        hydrogen: 0,
        helium: 0,
        carbon: 0,
        oxygen: 0,
        nitrogen: 0,
        silicon: 0,
        ferrum: 0,
    },

    storage: {
        hydrogen: 0,
        helium: 0,
        carbon: 0,
        nitrogen: 0,
        oxygen: 0,
        silicon: 0,
        ferrum: 0,
    },

    storage_level: 1,
    storage_capacity: 10000,


    modules: {
        polarizer: 0,
        cell: 0,
        panel: 0,
        neutronator: 0,
        pump: 0,
    },

    assemblers: {
        hydrogen: 0,
        helium: 0,
        carbon: 0,
        nitrogen: 0,
        oxygen: 0,
        silicon: 0,
        ferrum: 0,
    },

    rockets: {
        hydrogen: 0,
        helium: 0,
        carbon: 0,
        nitrogen: 0,
        oxygen: 0,
        silicon: 0,
        ferrum: 0,
    },

    toggle: {
        polarizer: true,
        cell: true,
        panel: true,
        neutronator: true,
        pump: true,

        hydrogen: true,
        helium: true,
        carbon: true,
        nitrogen: true,
        oxygen: true,
        silicon: true,
        ferrum: true,

    },

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

    game_speed: 420,
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