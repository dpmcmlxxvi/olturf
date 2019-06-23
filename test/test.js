'use strict';
const pti = require('puppeteer-to-istanbul');

const url = 'file://' + __dirname + '/index.html';

describe('olturf', () => {
  beforeAll(async () => {
    await page.coverage.startJSCoverage();
    await page.goto(url);
  });

  afterAll(async () => {
    const jsCoverage = await page.coverage.stopJSCoverage();
    pti.write(jsCoverage);
  });

  describe('API', () => {
    it('creates a valid olturf object', async () => {
      const olturf = await page.evaluate(() => olturf);
      expect(olturf).not.toBeNull();
    });
  });
});
