import { countMiniPoints, Hand } from '../src/index';
import { Suit, Wind, Ending, SetType, Dragon, SetState } from '../src/enums';

let hand: Hand;

// TODO: lisää testejä
describe('Count minipoints', () => {

  beforeEach(() => {
    hand = {
      seatWind: Wind.EAST,
      prevalentWind: Wind.EAST,
      doras: [{ suit: Suit.BAMBOO, value: 2 }],
      hiddenDoras: [{ suit: Suit.DOTS, value: 3 }],
      end: Ending.TSUMO,
      lastTile: { suit: Suit.DRAGON, value: Dragon.RED },
      riichi: true,
      concealead: true,
      ippatsu: false,
      dabura: false,
      afterKong: false,
      robbingKong: false,
      underTheSea: false,
      sets: [
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 3 }, { suit: Suit.DOTS, value: 4 }, { suit: Suit.DOTS, value: 5 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 3 }, { suit: Suit.DOTS, value: 4 }, { suit: Suit.DOTS, value: 5 }]},
          { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.DRAGON, value: Dragon.RED }, { suit: Suit.DRAGON, value: Dragon.RED }]},
      ],
    }
  });

  test('Check minipoints example', () => {
    expect(countMiniPoints(hand, false, false)).toBe(30);
  });

});