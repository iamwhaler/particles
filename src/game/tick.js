import _ from 'lodash';

import {rules} from './rules';
import {fluctuators} from './fluctuators';
import {oneclickers} from "./oneclickers";
import {achievements} from "./achievements";
import toastr from "toastr";

export const tick = (state) => {
    _.each(fluctuators.fluctuators, (item) => {
        if (item.onTick) state = item.onTick(state);
    });

    _.each(fluctuators.converters, (item) => {
        if (item.onTick) state = item.onTick(state);
    });
    
    _.each(rules, (item) => {
        if (item.onTick && (!item.locked || item.locked(state) === false)) state = item.onTick(state);
    });

    _.each(oneclickers, (item) => {
        if (item.onTick) state = item.onTick(state);
    });

    _.each(achievements, (achievement, key) => {
        if (state.achievements[achievement.name]) return;
        if (achievement.rule(state) && !state.achievements.includes(achievement.name)) {
            state.achievements.push(achievement.name);
            toastr.info(achievement.name + achievement.rank + " achievement unlocked!", {
                timeOut: 20000,
                closeButton: true,
                preventDuplicates: true,
                extendedTimeOut: 4000,
                escapeHtml: false});
        }
    });

    return state;
};