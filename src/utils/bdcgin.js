import _ from 'lodash';

export function isEnough(state, cost) {
    let enough = true;
    _.each(cost, (value, resource_key) => {
        if (_.get(state, resource_key) < value) enough = false;
       // console.log(_.get(state, resource_key), resource_key);
    });
    // console.log(state, cost, enough);

    return enough;
}

export function chargeCost(state, cost) {
    if (!isEnough(state, cost)) return false;
    _.each(cost, (value, resource_key) => {
        let result = _.get(state, resource_key) - value;
        _.set(state, resource_key, result);
    });
    return state;
}

export function gainCost(state, cost) {
    _.each(cost, (value, resource_key) => {
        let result = _.get(state, resource_key) + value;
        _.set(state, resource_key, result);
    });
    return state;
}

export function drawCost(cost) {
    let text = '';
    _.each(cost, (value, resource) => {
        if (value > 0) {
            text += resource + ': ' + value + ' ';
        }
    });
    return text;
}
