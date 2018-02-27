import Muter, {captured} from 'muter';
import {expect} from 'chai';
import Timeblock from '../src/timeblock';

describe('Testing Timeblock', function () {
  const muter = Muter(console, 'log'); // eslint-disable-line new-cap

  it(`Class Timeblock says 'Hello world!'`, captured(muter, function () {
    new Timeblock();
    expect(muter.getLogs()).to.equal('Hello world!\n');
  }));
});
