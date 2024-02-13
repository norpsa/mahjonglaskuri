import { wind, suit, ending } from "./enums";
import { countChow, isValueless } from "./utils";

const hand = {
    seatWind: wind.EAST,
    prevalentWind: wind.EAST,
    doras: [{ suit: suit.BAMBOO, value: 2 }],
    hiddenDoras: [{ suit: suit.DOTS, value: 3 }],
    end: ending.RON,
    lastTile: { suit: suit.BAMBOO, value: 5 },
    riichi: 'true',
    concealead: 'true',
    ippatsu: 'false',
    dabura: 'false',
    sets: [
        { type: set.CHOW, tiles: [{ suit: suit.BAMBOO, value: 2 }, { suit: suit.BAMBOO, value: 3 }, { suit: suit.BAMBOO, value: 4 }]},
        { type: set.CHOW, tiles: [{ suit: suit.BAMBOO, value: 5 }, { suit: suit.BAMBOO, value: 6 }, { suit: suit.BAMBOO, value: 7 }]},
        { type: set.CHOW, tiles: [{ suit: suit.DOTS, value: 6 }, { suit: suit.DOTS, value: 7 }, { suit: suit.DOTS, value: 8 }]},
        { type: set.CHOW, tiles: [{ suit: suit.BAMBOO, value: 1 }, { suit: suit.BAMBOO, value: 2 }, { suit: suit.BAMBOO, value: 3 }]},
        { type: set.PAIR, tiles: [{ suit: suit.HONOR.wind.NORTH }, { suit: suit.HONOR.wind.NORTH }]},
    ],
}

// Concealed waiting hand declared at 1,000 points stake. See section 3.3.14 for the detailed rules of declaring riichi. An
// extra yaku, IPPATSU, is awarded for winning within the first un-interrupted set of turns after declaring riichi, including
// the next draw by the riichi declarer. If the set of turns is interrupted by claims for kong, pung or chow, including
// concealed kongs, the chance for IPPATSU is gone.
// An extra yaku, DABURU RIICHI, is awarded for declaring riichi in the first set of turns of the hand, i.e. in the player’s very
// first turn. The first set of turns must be uninterrupted, i.e. if any claims for kong, pung or how, including concealed
// kongs, has occurred before the riichi declaration, DABURU RIICHI is not possible.
const checkRiichi = hand => {
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
const checkMenzenTsumo = hand => {
    if(hand.concealead && hand.end === ending.TSUMO) {
        return 1;
    }
    return 0;
}

// Concealed all chows hand with a valueless pair. I.e. a concealed hand with four chows and a pair that is neither dragons,
// nor seat wind, nor prevalent wind. The winning tile is required to finish a chow with a two-sided wait. The hand is by
// definition worth no minipoints, only the base 30 on a discard or 20 on self-draw.
// JOTAIN PITÄÄ TEHDÄ MINIPOINTSEILLE
const checkPinfu = hand => {
    if(!hand.concealead) {
        return 0;
    }

    if(countChow(hand) !== 4) {
        return 0;
    }

    // First tile of pair
    let pairTile = hand.sets.filter(a => a.type === set.PAIR)[0].tiles[0];
    if(!isValueless(pairTile.suit, hand.seatWind, hand.prevalentWind)) {
        return 0;
    }
}

const countFan = hand => {
    let fan = 0;
    fan += checkRiichi(hand);
    fan += checkMenzenTsumo(hand);
    fan += checkPinfu(hand);

    return fan;
}

countFan(hand);