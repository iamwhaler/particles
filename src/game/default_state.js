
import _ from 'lodash';

const default_state = {

    strings: 420000,
    gluons: 0,
    up_quarks: 0,
    down_quarks: 0,
    photons: 0,
    electrons: 0,

    protons: 0,
    neutrons: 0,

    beryllium: 0,
    hydrogen: 0,
    helium: 0,
    carbon: 0,
    nitrogen: 0,
    silicium: 0,

    H2: 0,
    He2: 0,
    N2: 0,
    C2: 0,

    CN: 0,
    CH: 0,

    hydrogen_stars: 0,
    helium_stars: 0,
    carbon_stars: 0,

    strings_rule: 0,
    up_quarks_rule: 0,
    down_quarks_rule: 0,
    electrons_rule: 0,

    strings_clicker: 0,
    up_quarks_clicker: 0,
    down_quarks_clicker: 0,
    electrons_clicker: 0,

    strings_fluctuator: 0,
    up_quarks_fluctuator: 0,
    down_quarks_fluctuator: 0,

    protons_miner: 0,
    neutrons_miner: 0,
    electrons_miner: 0,


    beryllium_miner: 0,
    hydrogen_miner: 0,
    helium_miner: 0,


    H2_converter: 0,
    temperature_converter: 0,

    toggle: {
        strings_fluctuator: false,
        up_quarks_fluctuator: false,
        down_quarks_fluctuator: false,
        protons_miner: false,
        neutrons_miner: false,
        electrons_miner: false,
        hydrogen_miner: false,
        helium_miner: false,

        H2_converter: false,
        temperature_converter: false,
    },


    fluctuating: false,
    micro_swiper: false,

    stars: [],

    planets: [],

    black_hole: [],

    achievements: [],
    universe_name: '',
    universe_size: 0,
    expansion_index: 0,
    wormhole_probability: 0,

    temperature: Math.pow(10, 32),

    chat: [],

    universe: [
        {name: 'Galaxy 1', mater: {'H2': 16200000, 'He': 4200000}, systems: [
            {name: 'System 1', mater: {'H2': 1620000, 'He': 420000},
                stars: [
                    {name: 'Star 1', mater: {'H2': 162000, 'He': 42000}},
                    {name: 'Star 2', mater: {'H2': 16200, 'He': 4200}},
                ],
                planets: [
                    {name: 'Planet 1', mater: {'carbon': 162, 'nitrogen': 42}},
                    {name: 'Planet 2', mater: {'H2': 1620, 'He': 420}},
                ]
            }
        ]},
        {name: 'Galaxy 2', mater: {'H2': 16200000, 'He': 4200000}, systems: []}
    ],

    selected_galaxy: null,
    selected_system: null,
    selected_star: null,
    selected_planet: null,


    game_speed: 1000,
    game_speed_multiplier: 1,
    tick: 0,
    game_paused: true,
    game_end: false
};

export const getDefaultState = () => {
    return _.cloneDeep(default_state);
};