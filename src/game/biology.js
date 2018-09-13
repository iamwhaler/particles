
import _ from 'lodash';

import {info} from '../game/data';


export const calcLifeFormProbability = (state, planet, system) => {
    //console.log(planet, system);

    let probability = 0.001;

    // + section
    probability += (planet.temperature > 250 && planet.temperature < 500) ? 0.01 : 0;


    // * section
    probability *= _.keys(planet.mater).length;


    // / section
    probability /= system.stars.length;
    // reduce if in system.stars Neutron Star or Black Hole


    return probability;
};



export const genDNA = (difficulty) => {
    let alphabet = ['B', 'D', 'C', 'X',  'Y',  'Z'];

    let dna = '';

    _.times(difficulty, () => {
        dna += _.sample(alphabet) + _.sample(alphabet);
    });

    return dna;
};