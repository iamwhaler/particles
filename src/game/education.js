import { weight } from "physics";

export default education = {
    epilogue: {
        isPresent: (state) => state.tick === 1,
        content: {
            first_line: "The Kardashev scale is a method of measuring a civilization's level of technological advancement, based on the amount of energy a civilization is able to use." +
            "A Type I civilization—also called a planetary civilization—can use and store all of the energy which reaches its planet from its parent star." +
            "A Type II civilization—also called a stellar civilization—can harness the total energy of its planet's parent star (the most popular hypothetical concept being the Dyson sphere—a device which would encompass the entire star and transfer its energy to the planet(s))." +
            "A Type III civilization—also called a galactic civilization—can control energy on the scale of its entire host galaxy.",
            second_line: "Civilization methods description",
            third_line: "After a certain point, humanity overpopulated Milky Way galaxy. (Danger)"
        }
    },

    you_are_chosen: {
        isPresent: (state) => state.tick === 2,
        content: {
            first_line: "You were chosen to be one of the group that will form future systems to gather energy from and to live in",
            second_line: "Choose the start corporation wisely. It will define your further growth dynamics"
        }
    },

    creation: {
        isPresent: (state) => state.tick === 3,
        content: {
            first_line: "You will form a system from basic subatomic particles accumulated in open space.",
            second_line: "Your storages for particles are limited to the technology given you by corporation. " +
            "You can make them sure you deserve more advanced tech by bringing the results of your work - gathering basic particles"
        }
    },

    basic_particles_nature: {
        isPresent: (state) => state.tick === 10,
        content: {
            first_line: "Now you successfully mine subatomic particles, however that's not the whole story" +
            "The real nature of those is still not explained yet. However, quantum theory brings the light to some points.",
            second_line: "It was experimentally proven that protons and neutrons are formed from smaller particles - quarks.",
            third_line: "Moreover, tt's believed by scientists that electrons and photons are formed by fluctuating strings themselves",
        }
    },

    field_explained: {
        isPresent: (state) => weight(state.storage) > 100,
    }
};