import { Wind, Suit, Ending, SetType, Dragon } from "./enums";
import { countChow, isValueless, isSameTile } from "./utils";

interface NumberTile {
    suit: 'BAMBOO' | 'DOTS' | 'CHARS',
    value: number,
};

interface WindTile {
    suit: 'WIND',
    value: Wind,
};

interface DragonTile {
    suit: 'DRAGON',
    value: Dragon
};

export type Tile = NumberTile | WindTile | DragonTile;

interface ChowSet {
    type: 'CHOW',
    tiles: NumberTile[]
}

type TileSet = {
    type: Exclude<SetType, 'CHOW'>,
    tiles: Tile[]
} | ChowSet;

export interface Hand {
    seatWind: Wind,
    prevalentWind: Wind,
    doras: Tile[],
    hiddenDoras: Tile[],
    end: Ending,
    lastTile: Tile,
    riichi: boolean,
    concealead: boolean,
    ippatsu: boolean,
    dabura: boolean,
    sets: TileSet[],
};

const hand: Hand = {
    seatWind: Wind.EAST,
    prevalentWind: Wind.EAST,
    doras: [{ suit: Suit.BAMBOO, value: 2 }],
    hiddenDoras: [{ suit: Suit.DOTS, value: 3 }],
    end: Ending.RON,
    lastTile: { suit: Suit.BAMBOO, value: 3 },
    riichi: true,
    concealead: true,
    ippatsu: false,
    dabura: false,
    sets: [
        { type: SetType.CHOW, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
        { type: SetType.CHOW, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
        { type: SetType.CHOW, tiles: [{ suit: Suit.DOTS, value: 6 }, { suit: Suit.DOTS, value: 7 }, { suit: Suit.DOTS, value: 8 }]},
        { type: SetType.CHOW, tiles: [{ suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }]},
        { type: SetType.PAIR, tiles: [{ suit: Suit.WIND, value: Wind.NORTH }, { suit: Suit.WIND, value: Wind.NORTH }]},
    ],
}

// Concealed waiting hand declared at 1,000 points stake. See section 3.3.14 for the detailed rules of declaring riichi. An
// extra yaku, IPPATSU, is awarded for winning within the first un-interrupted set of turns after declaring riichi, including
// the next draw by the riichi declarer. If the set of turns is interrupted by claims for kong, pung or chow, including
// concealed kongs, the chance for IPPATSU is gone.
// An extra yaku, DABURU RIICHI, is awarded for declaring riichi in the first set of turns of the hand, i.e. in the player’s very
// first turn. The first set of turns must be uninterrupted, i.e. if any claims for kong, pung or how, including concealed
// kongs, has occurred before the riichi declaration, DABURU RIICHI is not possible.
const checkRiichi = (hand: Hand) => {
    if(!hand.riichi) {
        return 0;
    }

    if(hand.dabura) {
        return 3;
    }

    if(hand.ippatsu) {
        return 2;
    }

    return 1;
}

// Winning on a self-draw on a concealed hand.
const checkMenzenTsumo = (hand: Hand) => {
    if(hand.concealead && hand.end === Ending.TSUMO) {
        return 1;
    }
    return 0;
}

// Concealed all chows hand with a valueless pair. I.e. a concealed hand with four chows and a pair that is neither dragons,
// nor seat Wind, nor prevalent Wind. The winning tile is required to finish a chow with a two-sided wait. The hand is by
// definition worth no minipoints, only the base 30 on a discard or 20 on self-draw.
// JOTAIN PITÄÄ TEHDÄ MINIPOINTSEILLE
const checkPinfu = (hand: Hand) => {
    if(!hand.concealead) {
        return 0;
    }

    if(countChow(hand) !== 4) {
        return 0;
    }

    // First tile of pair
    let pairTile = hand.sets.filter(a => a.type === SetType.PAIR)[0].tiles[0];
    if(!isValueless(pairTile, hand.seatWind, hand.prevalentWind)) {
        return 0;
    }

    let setsWithLastTile = hand.sets.filter((a): a is ChowSet =>
        a.type === SetType.CHOW &&
        a.tiles.some(b => isSameTile(b, hand.lastTile))
    );

    let twoSidedWait = false;
    setsWithLastTile.forEach(set => {
        let ordered = set.tiles.sort((a, b) => a.value - b.value);
        if(isSameTile(ordered[0], hand.lastTile) && ordered[2].value !== 9) {
            twoSidedWait = true;
        }

        if(isSameTile(ordered[2], hand.lastTile) && ordered[0].value !== 1) {
            twoSidedWait = true;
        }
    });

    if(twoSidedWait) {
        return 1;
    }
    return 0;
}

// Concealed hand with two completely identical chows, i.e. the same values in the same suit
const checkPureDoubleChow = (hand: Hand) => {
    if(!hand.concealead) {
        return 0;
    }

    let uniqueSets = new Set();

    let chowSets = hand.sets.filter((a): a is ChowSet =>
        a.type === SetType.CHOW
    );

    chowSets.forEach(s => {
        let ordered = s.tiles.sort((a, b) => a.value - b.value);
        uniqueSets.add(JSON.stringify(ordered));
    });

    if(uniqueSets.size < chowSets.length) {
        return 1;
    }

    return 0;

}

const countFan = (hand: Hand) => {
    let fan = 0;
    fan += checkRiichi(hand);
    fan += checkMenzenTsumo(hand);
    fan += checkPinfu(hand);
    fan += checkPureDoubleChow(hand);
    return fan;
}

console.log(countFan(hand));