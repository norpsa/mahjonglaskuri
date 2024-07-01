import { checkOutsideHand, Hand } from '../src/index';
import { Suit, Wind, Ending, SetType, SetState, Dragon } from '../src/enums';

let hand: Hand;

describe('checkOutsideHand', () => {

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
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 1 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 7 }, { suit: Suit.DOTS, value: 8 }, { suit: Suit.DOTS, value: 9 }]},
          { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }]},
          { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 1 }]},
          { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.NORTH }, { suit: Suit.WIND, value: Wind.NORTH }]},
      ],
    }
  });

  test('Checks outside hand concealed', () => {
    expect(checkOutsideHand(hand).length).toBe(1);
    expect(checkOutsideHand(hand)[0].han).toBe(2);
  });

  test('Checks outside hand not concealed', () => {
    hand.concealead = false;
    expect(checkOutsideHand(hand).length).toBe(1);
    expect(checkOutsideHand(hand)[0].han).toBe(1);
  });

  test('Checks that requires chow', () => {
    hand.sets[0] = { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 1 }, { suit: Suit.DOTS, value: 1 }, { suit: Suit.DOTS, value: 1 }]};
    hand.sets[1] = { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 9 }, { suit: Suit.DOTS, value: 9 }, { suit: Suit.DOTS, value: 9 }]};
    expect(checkOutsideHand(hand).length).toBe(0);
  });

});