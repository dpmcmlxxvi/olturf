'use strict';
const pti = require('puppeteer-to-istanbul');

const url = 'file://' + __dirname + '/index.html';

describe('ol3turf', () => {
  beforeAll(async () => {
    await page.coverage.startJSCoverage();
    await page.goto(url);
  });

  afterAll(async () => {
    const jsCoverage = await page.coverage.stopJSCoverage();
    pti.write(jsCoverage);
  });

  describe('API', () => {
    it('creates a valid ol3turf object', async () => {
      const ol3turf = await page.evaluate(() => ol3turf);
      expect(ol3turf).not.toBeNull();
    });
  });
});
