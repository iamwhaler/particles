import _ from 'lodash';

import {rules} from './rules';
import {automators} from './automators';
import {oneclickers} from "./oneclickers";
import {achievements} from "./achievements";
import toastr from 'react-toastr';

export const tick = (state) => {
    _.each(automators.miners, (item) => {
        if (item.onTick) state = item.onTick(state);
    });

    _.each(automators.converters, (item) => {
        if (item.onTick) state = item.onTick(state);
    });

    _.each(rules, (item) => {
        if (item.onTick) state = item.onTick(state);
    });

    _.each(oneclickers, (item) => {
        if (item.onTick) state = item.onTick(state);
    });

    _.each(achievements, (achievement, key) => {
        if (state.achievements[key] === true) return;
        if (achievement.rule(state)) {
            state.achievements[key] = true;
            toastr.info(achievement.name + achievement.rank + " achievement unlocked!", {
                timeOut: 5000,
                closeButton: true,
                preventDuplicates: true,
                extendedTimeOut: 4000,
                escapeHtml: false});
        }
    });

    return state;
};