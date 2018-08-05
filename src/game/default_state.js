
import _ from 'lodash';

const default_state = {

    strings: 0,
    gluons: 0,
    up_quarks: 0,
    down_quarks: 0,
    electrons: 0,

    protons: 0,
    neutrons: 0,

    hydrogen: 0,
    helium: 0,
    carbon: 0,
    nitrogen: 0,

    H2: 0,
    He2: 0,
    N2: 0,

    hydrogen_stars: 0,
    helium_stars: 0,

    strings_rule: 0,
    up_quarks_rule: 0,
    down_quarks_rule: 0,
    electrons_rule: 0,

    strings_clicker: 0,
    up_quarks_clicker: 0,
    down_quarks_clicker: 0,
    electrons_clicker: 0,

    strings_miner: 0,
    up_quarks_miner: 0,
    down_quarks_miner: 0,

    protons_miner: 0,
    neutrons_miner: 0,
    electrons_miner: 0,

    hydrogen_miner: 0,
    helium_miner: 0,


    H2_converter: 0,
    temperature_converter: 0,

    toggle: {
        strings_miner: false,
        up_quarks_miner: false,
        down_quarks_miner: false,
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

    achievements: [],

    temperature: Math.pow(10, 32),

    game_speed: 1000,
    game_speed_multiplier: 1,
    tick: 0,
    game_paused: true,
    game_end: false
};

export const getDefaultState = () => {
    return _.cloneDeep(default_state);
};