let propName = function(prop, value){
    for(let i in prop) {
        if (prop[i] === value){
            return i;
        }
    }
    return false;
};

export let checkAchievement = function(state,resource){
    let name = propName(state, resource);
    if(!state.achievements.includes(name) && resource >= 1){
            state.achievements.push(propName(state, resource));
            state.chat.unshift({header: "Achievement:", text: "You've explored " + propName(state, resource)})
    }
};

export default checkAchievement;

export const achievements = {
    it_matters: {
        rank: 'bronze',
        type: 'breakthrough',
        name: 'It matters',
        text: 'First matter gained',
        rule: (state) => {return state.hydrogen === 1}
    },

    galaxy_born: {
        rank: 'bronze',
        type: 'breakthrough',
        name: 'Galaxy born',
        text: 'Grow a star in your galaxy to get it started',
        rule: (state) => {return state.universe.length === 1}
    },

    rising_star: {
        rank: 'silver',
        type: 'breakthrough',
        name: 'Rising star',
        text: 'Grow a star in your galaxy to get it started',
        rule: (state) => {return false}
    },


    abnormal_space_activity: {
        rank: 'gold',
        type: 'breakthrough',
        name: 'Abnormal space activity',
        text: 'Seems like you are getting it',
        rule: (state) => {return false}
    },
};