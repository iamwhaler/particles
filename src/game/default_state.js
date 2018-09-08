import _ from 'lodash';

const default_state = {

    space: {
        photons: 12000,
        electrons: 18000,
        neutrino: 20000,
        protons: 25000,
        neutrons: 26000,
    },

    field: {
        photons: 1,
        electrons: 4,
        neutrino: 2,
        protons: 4,
        neutrons: 20,
    },

    dust: {
        hydrogen: 24000,
        helium: 25000,
        carbon: 25000,
        oxygen: 0,
        nitrogen: 0,
        ferrum: 0,
        neon: 0,
        silicon: 0,
    },

    storage: {
        hydrogen: 1400,
        helium: 1200,
        carbon: 13000,
        oxygen: 21000,
        nitrogen: 0,
        ferrum: 0,
        neon: 0,
        silicon: 0,
    },



    H2: 0,
    He: 0,
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

    toggle: {
       pump: true,
       riddle: true,
        protonator: true,
       hydrogen_assembler: true,
        helium_assembler: true,
        carbon_assembler: true,

    },


    micro_swiper: false,

    black_hole: [],

    achievements: [],
    universe_name: '',
    universe_size: 0,

    temperature: Math.pow(10, 32),

    chat: [],

    // /*
    systems: [
            {name: 'System 1', mater: {'H2': 162000, 'He': 42000},
                stars: [
                    {name: 'Star 1', mater: {'H2': 16200, 'He': 4200}},
                    {name: 'Star 2', mater: {'H2': 1620, 'He': 420}},
                ],
                planets: [
                    {name: 'Planet 1', mater: {'carbon': 162, 'nitrogen': 42}},
                    {name: 'Planet 2', mater: {'H2': 1620, 'He': 420}},
                ]
            },
            {name: 'System 2', mater: {'H2': 162000, 'He': 42000},
                stars: [
                    {name: 'Star 1', mater: {'H2': 16200, 'He': 4200}},
                    {name: 'Star 2', mater: {'H2': 1620, 'He': 420}},
                ],
                planets: [
                    {name: 'Planet 1', mater: {'carbon': 162, 'nitrogen': 42}},
                    {name: 'Planet 2', mater: {'H2': 1620, 'He': 420}},
                ]
            }
        ],
    // */
    //universe: [],
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