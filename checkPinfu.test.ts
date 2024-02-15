import { checkPinfu, Hand } from './index';
import { Suit, Wind, Ending, SetType } from './enums';

let hand: Hand;

describe('checkPinfu', () => {

  beforeEach(() => {
    hand = {
      seatWind: Wind.EAST,
      prevalentWind: Wind.EAST,
      doras: [{ suit: Suit.BAMBOO, value: 2 }],
      hiddenDoras: [{ suit: Suit.DOTS, value: 3 }],
      end: Ending.RON,
      lastTile: { suit: Suit.BAMBOO, value: 4 },
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
  });

  test('Checks PinfuHand', () => {
    expect(checkPinfu(hand)).toBe(1);
  });

  test('Checks that no Pinfu with value pair', () => {
    hand.seatWind = Wind.NORTH;
    expect(checkPinfu(hand)).toBe(0);
  });

  test('Checks that no Pinfu without two-sided wait', () => {
    hand.lastTile = { suit: Suit.DOTS, value: 7 };
    expect(checkPinfu(hand)).toBe(0);
  });

  test('Checks that no Pinfu without four chows', () => {
    hand.sets[0] = { type: SetType.PUNG, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 2 }]};
    expect(checkPinfu(hand)).toBe(0);
  });

  test('Checks that no Pinfu with open hand', () => {
    hand.concealead = false;
    expect(checkPinfu(hand)).toBe(0);
  });

});