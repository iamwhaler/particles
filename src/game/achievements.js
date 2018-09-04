let propName = function(prop, value){
    for(let i in prop) {
        if (prop[i] === value){
            return i;
        }
    }
    return false;
};

let checkAchievement = function(state,resource){
    if(!state.achievements.includes(propName(state, resource)) && resource >= 1){
            state.achievements.push(propName(state, resource));
            state.chat.unshift({header: "Achievement:",
                text: "You've explored " + propName(state, resource)})
    }
};

export default checkAchievement;

export const achievements = {
    rising_star: {
        rank: 'bronze',
        type: 'breakthrough',
        name: 'Rising Star',
        text: 'Grow a star in your galaxy to get it started',
        rule: (state) => {return state.stars.length === 1}
    },

    rising_star_2: {
        rank: 'silver',
        type: 'breakthrough',
        name: 'Abnormal space activity',
        text: 'Seems like you are getting it',
        rule: (state) => {return state.stars.length === 6}
    },


    rising_star_3: {
        rank: 'gold',
        type: 'breakthrough',
        name: 'Superstar',
        text: 'Seems like you are getting it',
        rule: (state) => {return state.stars.length === 6}
    },
};