let propName = function(prop, value){
    for(let i in prop) {
        if (prop[i] == value){
            return i;
        }
    }
    return false;
};

let checkAchievement = function(state,resource){
    if(!state.achievements.includes(propName(state, resource))){
        let achieved = 0;
        achieved += resource;
        (achieved > 1)
            ? state.achievements.push(propName(state, resource))
            : false
    }
};

export default checkAchievement