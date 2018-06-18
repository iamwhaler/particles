
import _ from 'lodash';

import {genModuleState} from '../game/modules';
import {genTarget} from '../game/targets';

const default_state = {

    strings: 0,
    up_quarks: 0,
    down_quarks: 0,
    electrons: 0,

    protons: 0,
    neutrons: 0,

    hydrogen: 0,
    helium: 0,

    H2: 0,
    He2: 0,
    N2: 0,

    hydrogen_stars: 0,

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
    electrons_miner: 0,

    hydrogen_miner: 0,

    fluctuating: false,

// not used for now
    player: {
        armor_current: 1000,
        armor: 1000,
        stamina: 1000
    },

    weapon: genModuleState('weapon'),
    repairer: genModuleState('repairer'),
    target: genTarget(1),

    weapon_upgrade: 0,
    armor_upgrade: 0,

    mode: 'slow',
//

    temperature: 356,



    game_speed: 1000,
    frame_rate: 30,
    game_speed_multiplier: 1,
    frame: 0,
    tick: 0,
    game_paused: true,
    game_end: false
};

export const getDefaultState = () => {
    return _.cloneDeep(default_state);
};