/* eslint-disable no-invalid-this */
import {expect} from 'chai';
import moment from 'moment';
import Timeblock from '../src/timeblock';

describe('Testing basic organizer', function () {
  beforeEach(function () {
    const today = moment().startOf('d');
    const meal1 = new Timeblock(today.clone().add(6, 'h'),
      today.clone().add(7, 'h'));
    const car1 = new Timeblock(today.clone().add(7, 'h'),
      today.clone().add(8, 'h'));
    const work1 = new Timeblock(today.clone().add(8, 'h'),
      today.clone().add(12, 'h'));
    const meal2 = new Timeblock(today.clone().add(12, 'h'),
      today.clone().add(14, 'h'));
    const work2 = new Timeblock(today.clone().add(14, 'h'),
      today.clone().add(18, 'h'));
    const car2 = new Timeblock(today.clone().add(18, 'h'),
      today.clone().add(19, 'h'));
    const meal3 = new Timeblock(today.clone().add(19, 'h'),
      today.clone().add(20, 'h'));
    const tv = new Timeblock(today.clone().add(20, 'h'),
      today.clone().add(22, 'h'));
    const sleep = new Timeblock(today.clone().add(22, 'h'),
      today.clone().add(30, 'h'));

    const schedule = new Timeblock(today.clone().add(6, 'h'), today.clone()
      .add(30, 'h'));
    [meal1, car1, work1, meal2, work2, car2, meal3, tv, sleep].forEach(tb => {
      schedule.fill(tb);
    });

    [meal1, meal2, meal3].forEach(tb => {
      tb.categorize('Meal');
    });

    [car1, car2].forEach(tb => {
      tb.categorize('Car');
    });

    [work1, work2].forEach(tb => {
      tb.categorize('Work');
    });

    tv.tag('TV');
    sleep.categorize('Sleep');

    this.today = today;
    this.schedule = schedule;
    this.tbs = {meal1, car1, work1, meal2, work2, car2, meal3, tv, sleep};
  });

  it('Adding a task that fits in an empty category', function () {
    const task = new Timeblock(this.today, this.today.clone().add(2, 'h'));
    task.tag('Work');
    this.schedule.insert(task);

    expect(this.tbs.work1._children[0]).to.equal(task);
    expect(task.format()).to.equal(moment.twix(this.today.clone().add(8, 'h'),
      this.today.clone().add(10, 'h')).format());
  });

  it('Adding a task that fits in a scattered partially filled category',
    function () {
      const task1 = new Timeblock(this.today, this.today.clone().add(2, 'h'));
      task1.tag('Work');
      this.schedule.insert(task1);

      const task2 = task1.clone();
      const task3 = task1.clone();

      this.schedule.insert(task2);
      this.schedule.insert(task3);

      expect(this.tbs.work1._children[1]).to.equal(task2);
      expect(task2.format()).to.equal(moment.twix(this.today.clone()
        .add(10, 'h'), this.today.clone().add(12, 'h')).format());

      expect(this.tbs.work2._children[0]).to.equal(task3);
      expect(task3.format()).to.equal(moment.twix(this.today.clone()
        .add(14, 'h'), this.today.clone().add(16, 'h')).format());
    });

  it('Adding a task with subtasks', function () {
    const task1 = new Timeblock(this.today, this.today.clone().add(6, 'h'));
    task1.tag('Work');

    const task2 = new Timeblock(this.today, this.today.clone().add(4, 'h'));
    const task3 = new Timeblock(this.today, this.today.clone().add(2, 'h'));

    task1.fill(task2);
    task1.fill(task3);

    expect(task2.format()).to.equal(moment.twix(this.today.clone(),
      this.today.clone().add(4, 'h')).format());
    expect(task3.format()).to.equal(moment.twix(this.today.clone().add(4, 'h'),
      this.today.clone().add(6, 'h')).format());

    expect(task2._tag).to.equal(task1._tag);
    expect(task3._tag).to.equal(task1._tag);

    this.schedule.insert(task1);

    expect(this.tbs.work1._children[0]).to.equal(task2);
    expect(task2.format()).to.equal(moment.twix(this.today.clone().add(8, 'h'),
      this.today.clone().add(12, 'h')).format());

    expect(this.tbs.work2._children[0].format()).to.equal(task3.format());
    expect(task3.format()).to.equal(moment.twix(this.today.clone().add(14, 'h'),
      this.today.clone().add(16, 'h')).format());
  });

  it('Adding a task too large - autosplit');
  it('Must split subtask');
  it('Merging tasks');
  it('Pinning a meeting on top of Work - wrapping');
  it('Removing a task - compacting across blocks');
  it('Incompatible meetings');
});
