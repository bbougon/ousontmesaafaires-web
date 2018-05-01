import {DateTimeProvider} from '../app/infrastructure/date-time-provider';

export class FakeDateTimeProvider extends DateTimeProvider {

  private dates: Date[] = [];


  constructor(date: Date) {
    super(date);
    this.dates.push(date);
  }

  now(): DateTimeProvider {
    return this;
  }

  unixTimestamp(): number {
    if (this.dates.length > 0) {
      this.date = this.dates.shift();
    }
    return super.unixTimestamp();
  }

  addDate(date: Date): void {
    this.dates.push(date);
  }
}
