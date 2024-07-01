import { Wind, Suit, Ending, SetType, Dragon, SetState, Yaku } from "./enums";
import { countChow, isValueless, isSameTile, isTerminalOrHonor } from "./utils";

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
    afterKong: boolean,
    robbingKong: boolean,
    underTheSea: boolean,
    sets: TileSet[],
};

export interface YakuHans {
    yaku: Yaku,
    han: number,
}

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
    afterKong: false,
    robbingKong: false,
    underTheSea: false,
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

    let riichiYakus = [];
    if(!hand.riichi) {
        return riichiYakus;
    }

    riichiYakus.push({ yaku: Yaku.RIICHI, han: 1 });

    if(hand.dabura) {
        riichiYakus.push({ yaku: Yaku.DABURA, han: 1 });
    }

    if(hand.ippatsu) {
        riichiYakus.push({ yaku: Yaku.IPPATSU, han: 1 });
    }

    return riichiYakus;
}

// Winning on a self-draw on a concealed hand.
export const checkMenzenTsumo = (hand: Hand) => {
    if(hand.concealead && hand.end === Ending.TSUMO) {
        return [{ yaku: Yaku.MENZEN_TSUMO, han: 1 }];
    }
    return [];
}

// Concealed all chows hand with a valueless pair. I.e. a concealed hand with four chows and a pair that is neither dragons,
// nor seat Wind, nor prevalent Wind. The winning tile is required to finish a chow with a two-sided wait. The hand is by
// definition worth no minipoints, only the base 30 on a discard or 20 on self-draw.
export const checkPinfu = (hand: Hand) => {
    if(!hand.concealead) {
        return [];
    }

    if(countChow(hand) !== 4) {
        return [];
    }

    // First tile of pair
    let pairTile = hand.sets.filter(a => a.type === SetType.PAIR)[0].tiles[0];
    if(!isValueless(pairTile, hand.seatWind, hand.prevalentWind)) {
        return [];
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
        return [{ yaku: Yaku.PINFU, han: 1 }];;
    }
    return [];
}

// Concealed hand with two completely identical chows, i.e. the same values in the same suit
export const checkPureDoubleChow = (hand: Hand) => {
    if(!hand.concealead) {
        return [];
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
        return [{ yaku: Yaku.PURE_DOUBLE_CHOW, han: 1 }];
    }

    return [];

}

// Hand with no terminals and honours.
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
        return [{ yaku: Yaku.ALL_SIMPLES, han: 1 }];
    }
    return [];
}

// Hand with three chows of the same numerical sequence, one in each suit
// Gives an extra fan if concealed.
export const checkMixedTripleChow = (hand: Hand) => {

    let chowSets = hand.sets.filter((a): a is ChowSet =>
        a.type === SetType.CHOW
    );
    
    if(chowSets.length < 3) {
        return [];
    }

    let orderedSets = chowSets.map(s => {
        let ordered = s.tiles.sort((a, b) => a.value - b.value);
        return {
            suit: ordered[0].suit,
            start: ordered[0].value
        }
    });

    for(let i = 0; i < orderedSets.length; i++) {
        let suitsToFind;
        if(orderedSets[i].suit === Suit.BAMBOO) {
            suitsToFind = [Suit.CHARS, Suit.DOTS];
        } else if(orderedSets[i].suit === Suit.CHARS) {
            suitsToFind = [Suit.BAMBOO, Suit.DOTS];
        } else {
            suitsToFind = [Suit.CHARS, Suit.BAMBOO];
        }
        if(suitsToFind.every(suit => orderedSets.find(a => a.suit === suit && a.start === orderedSets[i].start))) {
            if(hand.concealead) {
                return [{ yaku: Yaku.MIXED_TRIPLE_CHOW, han: 2 }];
            }
            return [{ yaku: Yaku.MIXED_TRIPLE_CHOW, han: 1 }];
        }
    }

    return [];
}

// Hand with three chows of the same numerical sequence, one in each suit
// Gives an extra fan if concealed.
// TODO: tests
export const checkPureStraight = (hand: Hand) => {

    let chowSets = hand.sets.filter((a): a is ChowSet =>
        a.type === SetType.CHOW
    );
    
    if(chowSets.length < 3) {
        return [];
    }

    let orderedSets = chowSets.map(s => {
        let ordered = s.tiles.sort((a, b) => a.value - b.value);
        return {
            suit: ordered[0].suit,
            start: ordered[0].value
        }
    });

    let suits = [Suit.BAMBOO, Suit.CHARS, Suit.DOTS];
    for(let i = 0; i < suits.length; i++) {
        if(orderedSets.find(s => s.start === 1 && s.suit === suits[i]) && 
        orderedSets.find(s => s.start === 4 && s.suit === suits[i]) && orderedSets.find(s => s.start === 7 && s.suit === suits[i])) {
            if(hand.concealead) {
                return [{ yaku: Yaku.PURE_STRAIGHT, han: 2 }];
            }
            return [{ yaku: Yaku.PURE_STRAIGHT, han: 1 }];
        }
    }

    return [];
}

// Dragon Pung/Kong
export const checkDragonYakuhai = (hand: Hand) => {
    let dragonYakus = [];
    let dragonPongsAndKongs = hand.sets.filter(s => s.type === SetType.PUNG || SetType.KONG).filter(s => s.tiles[0].suit === Suit.DRAGON);
    if(dragonPongsAndKongs.find(s => s.tiles[0].value === Dragon.WHITE)) {
        dragonYakus.push({ yaku: Yaku.WHITE_DRAGON, han: 1 });
    }

    if(dragonPongsAndKongs.find(s => s.tiles[0].value === Dragon.RED)) {
        dragonYakus.push({ yaku: Yaku.RED_DRAGON, han: 1 });
    }

    if(dragonPongsAndKongs.find(s => s.tiles[0].value === Dragon.GREEN)) {
        dragonYakus.push({ yaku: Yaku.GREEN_DRAGON, han: 1 });
    }

    return dragonYakus;

}

// Seat Wind Pung/Kong
export const checkSeatWind = (hand: Hand) => {
    let seatWind = hand.sets.filter(s => s.type === SetType.PUNG || SetType.KONG).find(s => s.tiles[0].suit === Suit.WIND && s.tiles[0].value === hand.seatWind);
    if(seatWind) {
        return [{ yaku: Yaku.SEAT_WIND, han: 1 }];
    }
    return [];
}

// Prevalend Wind Pung/Kong
export const checkPrevalentWind = (hand: Hand) => {
    let prevalentWind = hand.sets.filter(s => s.type === SetType.PUNG || SetType.KONG).find(s => s.tiles[0].suit === Suit.WIND && s.tiles[0].value === hand.prevalentWind);
    if(prevalentWind) {
        return [{ yaku: Yaku.PREVALENT_WIND, han: 1 }];
    }
    return [];
}

// All sets contain terminals or honours, and the pair is terminals or honours.The hand contains at least one chow.Gives
// an extra fan if concealed.
export const checkOutsideHand = (hand: Hand) => {
    let chowSets = hand.sets.filter((a): a is ChowSet =>
        a.type === SetType.CHOW
    );
    
    if(chowSets.length < 1) {
        return [];
    }

    if(!hand.sets.every(s => s.tiles.some(isTerminalOrHonor))) {
        return [];
    }

    if(hand.concealead) {
        return [{ yaku: Yaku.OUTSIDE_HAND, han: 2 }];
    }

    return [{ yaku: Yaku.OUTSIDE_HAND, han: 1 }];
}

// Winning on a replacement tile after declaring a kong. Counts as self-draw.
export const checkAfterKong = (hand: Hand) => {
    if(hand.afterKong) {
        return [{ yaku: Yaku.AFTER_A_KONG, han: 1 }];
    }
    return [];
}

// Winning on a tile that an opponent adds to a melded pung in order to make a kong
export const checkRobbingKong = (hand: Hand) => {
    if(hand.robbingKong) {
        return [{ yaku: Yaku.ROBBING_THE_KONG, han: 1 }];
    }
    return [];
}

// Winning on self-draw on the last tile in the wall. Does not combine with After a kong RINSHAN KAIHOU.
// Winning on the discard after the last tile in the wall
export const checkUnderTheSea = (hand: Hand) => {
    if(hand.underTheSea) {
        return [{ yaku: Yaku.UNDER_THE_SEA, han: 1 }];
    }
    return [];
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

// Minipoints              Open     Concealed
// Pung, 2-8               2        4
// Pung, terminals/honours 4        8
// Kong, 2-8               8        16
// Kong, terminals/honours 16       32
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

// 2 minipoints for:
// • Pair of dragons
// • Pair of seat wind
// • Pair of prevalent wind
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

// 2 minipoints for:
// • Winning on an edge, closed or pair wait
// • Open pinfu
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

        // • Winning on self-draw (except in case of pinfu)
        if(hand.end === Ending.TSUMO) {
            minipoints += 2;
        }
    }
    
    // Round up to nearest 10
    minipoints = Math.ceil(minipoints/10.0)*10;
    return minipoints;
}

const calculatePoints = (hand: Hand) => {

    let yakus: YakuHans[] = [];

    yakus.push(...checkRiichi(hand));
    yakus.push(...checkMenzenTsumo(hand));
    yakus.push(...checkPinfu(hand));
    yakus.push(...checkPureDoubleChow(hand));
    yakus.push(...checkAllSimples(hand));
    yakus.push(...checkMixedTripleChow(hand));
    yakus.push(...checkPureStraight(hand));
    yakus.push(...checkDragonYakuhai(hand));
    yakus.push(...checkSeatWind(hand));
    yakus.push(...checkPrevalentWind(hand));
    yakus.push(...checkOutsideHand(hand));

    // Check minipoints
    const han = yakus.reduce((a, b) => a + b.han, 0);
    let isPinfu: boolean = !!yakus.find(a => a.yaku === Yaku.PINFU);
    let isSevenPairs: boolean = !!yakus.find(a => a.yaku === Yaku.SEVEN_PAIRS);
    let minipoints = countMiniPoints(hand, isPinfu, isSevenPairs);
    let basicPoints = minipoints*(Math.pow(2, 2 + han));

    return basicPoints;
}