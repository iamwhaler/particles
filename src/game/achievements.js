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
        (resource > 0.99)
            ? state.achievements.push(propName(state, resource))
            && state.chat.unshift({header: "Achievement:",
                text: "You've explored " + propName(state, resource)})
    : false
    }
};

export default checkAchievement;

export const achievements = {
    rising_star: {
        rank: 'bronze',
        type: 'breakthrough',
        name: 'Rising Star',
        text: 'Grow a couple of stars in your galaxy to get it started',
        rule: (state) => {return state.stars.length === 4}
    }
};