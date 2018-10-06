export const oneclickers = {
    micro_swiper: {
        name: 'Micro Swiper', text: 'Allows manage basic particles on more global level',
        cost: {carbon: 20, nitrogen: 10}, locked: (state) => !state.hydrogen_assembler,
        onClick: (state) => {
            state.micro_swiper = true;
            return state;
        }
    },
};