import { checkSeatWind, checkPrevalentWind, Hand } from '../src/index';
import { Suit, Wind, Ending, SetType, Dragon, SetState } from '../src/enums';

let hand: Hand;

describe('checkWinds', () => {

  beforeEach(() => {
    hand = {
      seatWind: Wind.NORTH,
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
          { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.EAST }, { suit: Suit.WIND, value: Wind.EAST }, { suit: Suit.WIND, value: Wind.EAST }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 6 }, { suit: Suit.DOTS, value: 7 }, { suit: Suit.DOTS, value: 8 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
          { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 2 }]},
      ],
    }
  });

  test('Checks PrevalentWind', () => {
    expect(checkPrevalentWind(hand)).toBe(1);
  });

  test('Checks that kong is also okay', () => {
    hand.sets[0] = { type: SetType.KONG, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.EAST }, { suit: Suit.WIND, value: Wind.EAST }, { suit: Suit.WIND, value: Wind.EAST }]};
    expect(checkPrevalentWind(hand)).toBe(1);
  });

  test('Checks that wrong wind is not okay', () => {
    hand.sets[0] = { type: SetType.KONG, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.WEST }, { suit: Suit.WIND, value: Wind.WEST }, { suit: Suit.WIND, value: Wind.WEST }]};
    expect(checkPrevalentWind(hand)).toBe(0);
  });

  test('Checks SeatWind', () => {
    hand.sets[0] = { type: SetType.KONG, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.NORTH }, { suit: Suit.WIND, value: Wind.NORTH }, { suit: Suit.WIND, value: Wind.NORTH }]};
    expect(checkSeatWind(hand)).toBe(1);
  });

});