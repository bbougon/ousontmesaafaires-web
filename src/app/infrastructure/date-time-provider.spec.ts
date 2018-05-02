import {DateTimeProvider} from './date-time-provider';

describe('DateTimeProvider', () => {

  it('should give the unix timestamp', () => {
    const date = new Date();
    date.setUTCFullYear(2018, 1, 10);
    date.setUTCHours(10, 15, 12, 267);
    const dateTimeProvider = new DateTimeProvider(date);

    expect(dateTimeProvider.unixTimestamp()).toBe(1518257712);
  });
});
