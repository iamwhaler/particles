let propName = function(prop, value){
    for(let i in prop) {
        if (prop[i] === value){
            return i;
        }
    }
    return false;
};

let checkAchievement = function(state,resource){
    if(!state.achievements.includes(propName(state, resource))){
        let achieved = 0;
        achieved += resource;
        return (achieved > 1) // PLS ATTENTION and CHECK here
            ? state.achievements.push(propName(state, resource))
            : false
    }
};

export default checkAchievement;