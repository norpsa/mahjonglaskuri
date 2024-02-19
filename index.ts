import { Wind, Suit, Ending, SetType, Dragon, SetState } from "./enums";
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
    tiles: NumberTile[],
    state: SetState,
}

type TileSet = {
    type: Exclude<SetType, 'CHOW'>,
    tiles: Tile[]
    state: SetState,
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
        { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
        { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
        { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 6 }, { suit: Suit.DOTS, value: 7 }, { suit: Suit.DOTS, value: 8 }]},
        { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }]},
        { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.NORTH }, { suit: Suit.WIND, value: Wind.NORTH }]},
    ],
}

// Concealed waiting hand declared at 1,000 points stake. See section 3.3.14 for the detailed rules of declaring riichi. An
// extra yaku, IPPATSU, is awarded for winning within the first un-interrupted set of turns after declaring riichi, including
// the next draw by the riichi declarer. If the set of turns is interrupted by claims for kong, pung or chow, including
// concealed kongs, the chance for IPPATSU is gone.
// An extra yaku, DABURU RIICHI, is awarded for declaring riichi in the first set of turns of the hand, i.e. in the player’s very
// first turn. The first set of turns must be uninterrupted, i.e. if any claims for kong, pung or how, including concealed
// kongs, has occurred before the riichi declaration, DABURU RIICHI is not possible.
export const checkRiichi = (hand: Hand) => {
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
export const checkMenzenTsumo = (hand: Hand) => {
    if(hand.concealead && hand.end === Ending.TSUMO) {
        return 1;
    }
    return 0;
}

// Concealed all chows hand with a valueless pair. I.e. a concealed hand with four chows and a pair that is neither dragons,
// nor seat Wind, nor prevalent Wind. The winning tile is required to finish a chow with a two-sided wait. The hand is by
// definition worth no minipoints, only the base 30 on a discard or 20 on self-draw.
export const checkPinfu = (hand: Hand) => {
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
export const checkPureDoubleChow = (hand: Hand) => {
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

export const checkAllSimples = (hand: Hand) => {
    let allSimples = true;
    hand.sets.forEach(set => {
        set.tiles.forEach(tile => {
            if(tile.suit === Suit.DRAGON || tile.suit === Suit.WIND) {
                allSimples = false;
            }

            if(tile.value === 1 || tile.value === 9) {
                allSimples = false;
            }
        });
    });
    if(allSimples) {
        return 1;
    }
    return 0;
}

// Minipoints for winning
// Concealed on a discard 30
// Seven pairs(no further minipoints are added) 25
// Otherwise(Self - draw or Open hand) 20
const countMiniPointsForWinning = (hand: Hand) => {
    if(hand.concealead && hand.end === Ending.RON) {
        return 30;
    }

    return 20;
}

const countMiniPointsForPungsAndKongs = (hand: Hand) => {
    let minipoints = 0;
    hand.sets.filter(s => s.type === SetType.PUNG).forEach(set => {
        if(set.tiles[0].value === 2 || set.tiles[0].value === 3 || set.tiles[0].value === 4 || set.tiles[0].value === 5 
            || set.tiles[0].value === 6 || set.tiles[0].value === 7 || set.tiles[0].value === 8) {
            if(set.state === SetState.CONCEALED) {
                minipoints += 4;
            } else {
                minipoints += 2;
            }
        } else {
            if(set.state === SetState.CONCEALED) {
                minipoints += 8;
            } else {
                minipoints += 4;
            }
        }
    });

    hand.sets.filter(s => s.type === SetType.KONG).forEach(set => {
        if(set.tiles[0].value === 2 || set.tiles[0].value === 3 || set.tiles[0].value === 4 || set.tiles[0].value === 5 
            || set.tiles[0].value === 6 || set.tiles[0].value === 7 || set.tiles[0].value === 8) {
            if(set.state === SetState.CONCEALED) {
                minipoints += 16;
            } else {
                minipoints += 8;
            }
        } else {
            if(set.state === SetState.CONCEALED) {
                minipoints += 32;
            } else {
                minipoints += 16;
            }
        }
    });

    return minipoints;
}

const countMiniPointsForPairs = (hand: Hand) => {
    let minipoints = 0;

    let pair = hand.sets.filter(s => s.type === SetType.PAIR)[0];
    if(pair.tiles[0].suit === Suit.WIND && (pair.tiles[0].value === hand.seatWind || pair.tiles[0].value === hand.prevalentWind)) {
        minipoints += 2;
    }

    if(pair.tiles[0].suit === Suit.DRAGON) {
        minipoints += 2;
    }

    if(isSameTile(pair.tiles[0], hand.lastTile)) {
        minipoints += 2;
    }
    return minipoints;
}

const countMiniPointsForClosedAndEdgeWait = (hand: Hand) => {
    let closedWait = false;

    let chowSets = hand.sets.filter((a): a is ChowSet =>
        a.type === SetType.CHOW
    );

    chowSets.forEach(s => {
        let ordered = s.tiles.sort((a, b) => a.value - b.value);
        if(isSameTile(ordered[1], hand.lastTile)) {
            closedWait = true;
        }
    });

    if(closedWait) {
        return 2;
    } else if(hand.concealead === false && chowSets.length === 4) {
        // Open pinfu
        let pairTile = hand.sets.filter(a => a.type === SetType.PAIR)[0].tiles[0];
        if(pairTile.suit === Suit.BAMBOO || pairTile.suit === Suit.CHARS || pairTile.suit === Suit.DOTS) {
            return 2
        }
    }
    return 0;
}

export const countMiniPoints = (hand: Hand, isPinfu: Boolean, isSevenPairs: Boolean) => {
    if(isSevenPairs) {
        return 25;
    }
    let minipoints = 0;
    minipoints += countMiniPointsForWinning(hand);
    if(!isPinfu) {
        minipoints += countMiniPointsForPungsAndKongs(hand);
        minipoints += countMiniPointsForPairs(hand);
        minipoints += countMiniPointsForClosedAndEdgeWait(hand);

        if(hand.end === Ending.TSUMO) {
            minipoints += 2;
        }
    }
    
    minipoints = Math.ceil(minipoints/10.0)*10;
    return minipoints;
}

const calculatePoints = (hand: Hand) => {

    // Check Fans
    let han = 0;
    han += checkRiichi(hand);
    han += checkMenzenTsumo(hand);

    // Tosi elegantisti tehty :D 
    let isPinfu = false;
    let pinfuPoints = checkPinfu(hand);
    if(pinfuPoints > 0) {
        isPinfu = true;
    }
    han += pinfuPoints;
    han += checkPureDoubleChow(hand);
    han += checkAllSimples(hand);

    // TODO CHECK THIS
    let isSevenPairs = false;

    // Check minipoints
    let minipoints = countMiniPoints(hand, isPinfu, isSevenPairs);
    let basicPoints = minipoints*(Math.pow(2, 2 + han));
    
    return basicPoints;
}