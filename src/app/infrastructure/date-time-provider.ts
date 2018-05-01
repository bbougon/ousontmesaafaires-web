export class DateTimeProvider {

  constructor(protected date?: Date) {
  }

  now(): DateTimeProvider {
    return new DateTimeProvider(new Date());
  }

  unixTimestamp(): number {
    return Math.floor(this.date.getTime() / 1000);
  }
}
