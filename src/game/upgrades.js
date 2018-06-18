export const upgrades = {
    weapon_upgrade: {
        name: 'Weapon Upgrade',
        cost: {up_quarks: 1},
        locked: (state) => state.target.level < 4,
        onClick: (state) => {
            state.weapon_upgrade++;
            return state;
        }
    },
    armor_upgrade: {
        name: 'Armor Upgrade',
        cost: {up_quarks: 1},
        locked: (state) => state.target.level < 2,
        onClick: (state) => {
            state.armor_upgrade++;
            return state;
        }
    }
};