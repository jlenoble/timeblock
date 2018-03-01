import {expect} from 'chai';
import {Day, Month} from '../src/iterable';

describe('Testing iterable Timeblocks', function () {
  it('Days', function () {
    const today = new Day();
    const tomorrow = today.next();

    expect(tomorrow).not.to.equal(today);
    expect(tomorrow.format()).to.equal(today.clone().add(1, 'd').format());

    let day = today;
    const lastDay = today.start().add(100, 'd');

    let counter = 0;
    while (day._start < lastDay) {
      day = day.next();
      ++counter;
    }

    expect(counter).to.equal(100);
    expect(day._start.format()).to.equal(lastDay.format());
  });

  it('Months', function () {
    const thisMonth = new Month();
    const nextMonth = thisMonth.next();

    expect(nextMonth).not.to.equal(thisMonth);
    expect(nextMonth.format()).to.equal(thisMonth.clone().add(1, 'M').format());

    let month = thisMonth;
    const lastMonth = thisMonth.start().add(12, 'M');

    let counter = 0;
    while (month._start < lastMonth) {
      month = month.next();
      ++counter;
    }

    expect(counter).to.equal(12);
    expect(month._start.format()).to.equal(lastMonth.format());
    expect(month._start.format()).to.equal(thisMonth.start().add(1, 'y')
      .format());
  });
});
