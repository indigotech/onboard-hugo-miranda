import '@config/env';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Testing Mocha', () => {
  it('Should perform a successful test', () => {
    const message = 'Running test';

    expect(message).to.be.a('string');
  });
});
