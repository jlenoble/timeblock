import moment from 'moment';
import Timeblock from './timeblock';

const names = {
  h: 'Hour',
  d: 'Day',
  w: 'Week',
  M: 'Month',
  y: 'Year',
};

const makeIterable = tag => {
  class Iterable extends Timeblock {
    constructor (start) {
      const mt = moment(start).startOf(tag);
      super(mt, mt.clone().add(1, tag));
    }

    next () {
      return new Iterable(this.start().add(1, tag));
    }
  }

  Object.defineProperty(Iterable, 'name', {
    value: names[tag],
  });

  return Iterable;
};

export const Hour = makeIterable('h');
export const Day = makeIterable('d');
export const Week = makeIterable('w');
export const Month = makeIterable('M');
export const Year = makeIterable('y');
