
import _ from 'lodash';

export const weight = (cost) =>  {
    //console.log(cost);
    //console.log(_.sum(_.values(cost)));
    return _.sum(_.values(cost));
};