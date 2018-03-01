import moment from 'moment';
import Timeblock from './timeblock';

export class Day extends Timeblock {
  constructor (start) {
    const mt = moment(start).startOf('d');
    super(mt, mt.clone().add(1, 'd'));
  }

  next () {
    return new Day(this.start().add(1, 'd'));
  }
}

export class Month extends Timeblock {
  constructor (start) {
    const mt = moment(start).startOf('M');
    super(mt, mt.clone().add(1, 'M'));
  }

  next () {
    return new Month(this.start().add(1, 'M'));
  }
}
