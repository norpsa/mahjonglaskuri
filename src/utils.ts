import { Suit, SetType, Wind } from './enums';
import { Hand, Tile } from './index';

export const countChow = (hand: Hand) => {
    return hand.sets.filter(a => a.type === SetType.CHOW).length;
};

export const isValueless = (tile: Tile, seatWind: Wind, prevalentWind: Wind) => {

    if(tile.suit === Suit.DRAGON) {
        return false;
    }

    if(tile.suit === Suit.WIND && (tile.value === seatWind || tile.value === prevalentWind)) {
        return false;
    }

    return true;
};

export const isSameTile = (tileA: Tile, tileB: Tile) => {
    return tileA.suit === tileB.suit && tileA.value === tileB.value;
}

export const isTerminalOrHonor = (tile: Tile) => {
    if(tile.suit === Suit.DRAGON || tile.suit === Suit.WIND) {
        return true;
    }

    if(tile.value === 1 || tile.value === 9) {
        return true;
    }

    return false;
}