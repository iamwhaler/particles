import _ from 'lodash';

const default_state = {

    strings: Math.pow(2, 42),
    up_quarks: 0,
    down_quarks: 0,
    photons: 0,
    electrons: 0,
    neutrino: 0,

    protons: 0,
    neutrons: 0,

    hydrogen: 0,
    helium: 0,
    carbon: 0,
    oxygen: 0,
    nitrogen: 0,
    ferrum: 0,
    neon: 0,
    silicon: 0,

    H2: 0,
    He: 0,
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
    neutrino_clicker: 0,

    gluons_fluctuator: 0,
    up_quarks_fluctuator: 0,
    down_quarks_fluctuator: 0,
    photons_fluctuator: 0,
    electrons_fluctuator: 0,

    protons_miner: 0,
    neutrons_miner: 0,
    beryllium_miner: 0,
    hydrogen_miner: 0,
    helium_miner: 0,


    H2_converter: 0,
    temperature_converter: 0,

    toggle: {
        gluons_fluctuator: true,
        up_quarks_fluctuator: true,
        down_quarks_fluctuator: true,
        photons_fluctuator: true,
        electrons_fluctuator: true,
        protons_miner: true,
        neutrons_miner: true,
        electrons_miner: true,
        hydrogen_miner: true,
        helium_miner: true,

        H2_converter: true,
        temperature_converter: true,
    },


    micro_swiper: false,

    black_hole: [],

    achievements: [],
    universe_name: '',
    universe_size: 0,

    temperature: Math.pow(10, 32),

    chat: [],

    /*
    universe: [
        {name: 'Galaxy 1', mater: {'H2': 1620000, 'He': 420000}, systems: [
            {name: 'System 1', mater: {'H2': 162000, 'He': 42000},
                stars: [
                    {name: 'Star 1', mater: {'H2': 16200, 'He': 4200}},
                    {name: 'Star 2', mater: {'H2': 1620, 'He': 420}},
                ],
                planets: [
                    {name: 'Planet 1', mater: {'carbon': 162, 'nitrogen': 42}},
                    {name: 'Planet 2', mater: {'H2': 1620, 'He': 420}},
                ]
            }
        ]},
        {name: 'Galaxy 2', mater: {'H2': 16200, 'He': 4200}, systems: []}
    ],
    */

    universe: [],
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
    game_end: false
};

export const getDefaultState = () => {
    return _.cloneDeep(default_state);
};