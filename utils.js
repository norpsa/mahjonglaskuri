import { suit } from './enums';

export const countChow = hand => {
    return hand.sets.filter(a => a.type === set.CHOW).length;
};

export const isValueless = (tileSuit, seatWind, prevalentWind) => {
    if(tileSuit === seatWind || tileSuit === prevalentWind || tileSuit === suit.HONOR.dragon.GREEN
        || tileSuit === suit.HONOR.dragon.WHITE || tileSuit === suit.HONOR.dragon.RED ) {
        return false;
    }
    return true;
};