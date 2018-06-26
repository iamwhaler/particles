import _ from 'lodash'

let star_names = ['Exiled', 'Arriving', 'Rising', 'Relicted', 'Centured', 'Realized', 'Uniqum'];
let star_surnames = ['Rootery', 'Flat', 'Part', 'Lightning', 'Dense' ];

export let getStarName = () => {
    let first_name = star_names[_.random(0, star_names.length-1)];
    let last_name = star_surnames[_.random(0, star_surnames.length-1)];
    return first_name + ' ' + last_name;
};


export let getStarColor = () => {
    const starColors = ['#6B4E90','#8F78AD','#1C053A','#542493', '#23528E', '#2B3C51', '#1258B1'];
    return starColors[Math.floor(Math.random() * starColors.length)];
}