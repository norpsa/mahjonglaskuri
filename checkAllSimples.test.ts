import { checkAllSimples, Hand } from './index';
import { Suit, Wind, Ending, SetType, Dragon, SetState } from './enums';

let hand: Hand;

describe('checkPureDoubleChow', () => {

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
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 6 }, { suit: Suit.DOTS, value: 7 }, { suit: Suit.DOTS, value: 8 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
          { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 2 }]},
      ],
    }
  });

  test('Checks pure double chow', () => {
    expect(checkAllSimples(hand)).toBe(1);
  });

  test('Checks that no winds allowed', () => {
    hand.sets[4] = { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.NORTH }, { suit: Suit.WIND, value: Wind.NORTH }]};
    expect(checkAllSimples(hand)).toBe(0);
  });

  test('Checks that no dragons allowed', () => {
    hand.sets[4] = { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN  }]};
    expect(checkAllSimples(hand)).toBe(0);
  });

  test('Checks that no terminals allowed', () => {
    hand.sets[0] = { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }]};
    expect(checkAllSimples(hand)).toBe(0);
  });

});