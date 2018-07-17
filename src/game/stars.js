import _ from 'lodash';
import toastr from 'toastr';


const star_names = ['Exiled', 'Arriving', 'Rising', 'Relicted', 'Centured', 'Retrived', 'Uniqum'];
const star_surnames = ['Rootery', 'Flat', 'Part', 'Lightning', 'Dense', 'Tectile', 'Number'];

export let getStarName = () => {
    let first_name = star_names[_.random(0, star_names.length - 1)];
    let last_name = star_surnames[_.random(0, star_surnames.length - 1)];
    return first_name + ' ' + last_name;
};


const hydrogenStarColors = ['#6B4E90', '#8F78AD', '#1C053A', '#542493', '#23528E', '#2B3C51', '#1258B1'];
const heliumStarColors = ['#0693A7', '#26464B'];

export let getStarColor = (star_type) => {
    if (star_type === 'Hydrogen') {
        return hydrogenStarColors[_.random(0, hydrogenStarColors.length)];
    }
    else if (star_type === 'Helium') {
        return heliumStarColors[_.random(0, heliumStarColors.length)];
    }
};


export let nuclearReaction = (star_type, state) => {
    _.map(state.stars, (item, key) => {
        if (item) {
            if (state.tick - item.star.born > 10) {
                if (item.star.type === 'Hydrogen') {
                    item.star.hydrogen -= _.random(0, (state.tick - item.star.born) / 100, true);
                    item.star.carbon += _.random(0, 1, true);

                    if (item.star.hydrogen < 10 || (state.tick - item.star.born > 400) || item.star.hydrogen < 0) {
                        state.carbon += item.star.carbon;
                        state.stars.splice(key, 1);
                        toastr.info("Your star exploded and brought rewards", 'Be aware!', {
                            timeOut: 2000,
                            closeButton: true,
                            preventDuplicates: false,
                            extendedTimeOut: 2000,
                            escapeHtml: false
                        });
                    }
                }

                if (item.star.type === 'Helium') {
                    item.star.helium -= _.random(0, ((state.tick - item.star.born) / 100), true);
                    item.star.nitrogen += _.random(0, 1, true);

                    if (item.star.helium < 10 || (state.tick - item.star.born > 400) || item.star.helium < 0) {
                        state.nitrogen += item.star.nitrogen;
                        let string = "Your star" + " " + item.star.name + ' ' + 'exploded and brought rewards';
                        toastr.info(string, 'Be aware!', {
                            timeOut: 2000,
                            closeButton: true,
                            preventDuplicates: false,
                            extendedTimeOut: 2000,
                            escapeHtml: false
                        });
                        state.stars.splice(key, 1);

                    }
                }
            }
        }
    })
};