
import _ from 'lodash';

import {info} from '../game/data';

export const weight = (cost) =>  {
    //console.log(cost);
    //
    let weight = 0;
    _.each(cost, (val, key) => {
        weight += info[key] ? Math.floor(info[key].mass) * val : val;
    });
    return weight;//_.sum(_.values(cost));
};