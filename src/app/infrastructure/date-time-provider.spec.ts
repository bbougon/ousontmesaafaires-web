import {DateTimeProvider} from './date-time-provider';

describe('DateTimeProvider', () => {

  it('should give the unix timestamp', () => {
    const date = new Date();
    date.setFullYear(2018, 1, 10);
    date.setHours(10, 15, 12, 267);
    const dateTimeProvider = new DateTimeProvider(date);

    expect(dateTimeProvider.unixTimestamp()).toBe(1518254112);
  });
});
