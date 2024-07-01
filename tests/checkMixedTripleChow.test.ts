import { checkMixedTripleChow, Hand } from '../src/index';
import { Suit, Wind, Ending, SetType, SetState } from '../src/enums';

let hand: Hand;

describe('checkMixedTripleChow', () => {

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
      afterKong: false,
      robbingKong: false,
      underTheSea: false,
      sets: [
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 2 }, { suit: Suit.DOTS, value: 3 }, { suit: Suit.DOTS, value: 4 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.CHARS, value: 2 }, { suit: Suit.CHARS, value: 3 }, { suit: Suit.CHARS, value: 4 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }]},
          { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.NORTH }, { suit: Suit.WIND, value: Wind.NORTH }]},
      ],
    }
  });

  test('Checks mixed triple chow concealed', () => {
    expect(checkMixedTripleChow(hand).length).toBe(1);
    expect(checkMixedTripleChow(hand)[0].han).toBe(2);
  });

  test('Checks mixed triple chow not concealed', () => {
    hand.concealead = false;
    expect(checkMixedTripleChow(hand).length).toBe(1);
    expect(checkMixedTripleChow(hand)[0].han).toBe(1);
  });

  test('Checks mixed triple chow requires all suits', () => {
    hand.sets[0] = { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 2 }, { suit: Suit.DOTS, value: 3 }, { suit: Suit.DOTS, value: 4 }]};
    expect(checkMixedTripleChow(hand).length).toBe(0);
  });

  test('Checks mixed triple chow requires same start tiles', () => {
    hand.sets[0] = { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 4 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 5 }]};
    expect(checkMixedTripleChow(hand).length).toBe(0);
  });

  test('Checks mixed triple chow orders correctly', () => {
    hand.sets[0] = { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 4 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 2 }]};
    expect(checkMixedTripleChow(hand).length).toBe(1);
    expect(checkMixedTripleChow(hand)[0].han).toBe(2);
  });

});