'use strict';
const pti = require('puppeteer-to-istanbul');

const url = 'file://' + __dirname + '/index.html';

const isFormValid = async (name) => {
  const control = `#olturf-${name}`;
  const form = `${control}-form`;
  const cancel = `${form} input[value="Cancel"]`;
  expect((await page.$$(form)).length).toEqual(0);
  await expect(page).toClick(control);
  expect((await page.$$(form)).length).not.toEqual(0);
  await expect(page).toClick(cancel);
  expect((await page.$$(form)).length).toEqual(0);
};

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

  describe('along', () => {
    it('creates a valid form', async () => {
      await isFormValid('along');
    });
  });

  describe('bezier', () => {
    it('creates a valid form', async () => {
      await isFormValid('bezier');
    });
  });

  describe('buffer', () => {
    it('creates a valid form', async () => {
      await isFormValid('buffer');
    });
  });

  describe('circle', () => {
    it('creates a valid form', async () => {
      await isFormValid('circle');
    });
  });

  describe('collect', () => {
    it('creates a valid form', async () => {
      await isFormValid('collect');
    });
  });

  describe('concave', () => {
    it('creates a valid form', async () => {
      await isFormValid('concave');
    });
  });

  describe('destination', () => {
    it('creates a valid form', async () => {
      await isFormValid('destination');
    });
  });

  describe('distance', () => {
    it('creates a valid form', async () => {
      await isFormValid('distance');
    });
  });

  describe('hex-grid', () => {
    it('creates a valid form', async () => {
      await isFormValid('hex-grid');
    });
  });

  describe('isolines', () => {
    it('creates a valid form', async () => {
      await isFormValid('isolines');
    });
  });

  describe('line-distance', () => {
    it('creates a valid form', async () => {
      await isFormValid('line-distance');
    });
  });

  describe('line-slice-along', () => {
    it('creates a valid form', async () => {
      await isFormValid('line-slice-along');
    });
  });

  describe('point-grid', () => {
    it('creates a valid form', async () => {
      await isFormValid('point-grid');
    });
  });

  describe('random', () => {
    it('creates a valid form', async () => {
      await isFormValid('random');
    });
  });

  describe('sample', () => {
    it('creates a valid form', async () => {
      await isFormValid('sample');
    });
  });

  describe('simplify', () => {
    it('creates a valid form', async () => {
      await isFormValid('simplify');
    });
  });

  describe('square-grid', () => {
    it('creates a valid form', async () => {
      await isFormValid('square-grid');
    });
  });

  describe('tag', () => {
    it('creates a valid form', async () => {
      await isFormValid('tag');
    });
  });

  describe('tin', () => {
    it('creates a valid form', async () => {
      await isFormValid('tin');
    });
  });

  describe('triangle-grid', () => {
    it('creates a valid form', async () => {
      await isFormValid('triangle-grid');
    });
  });
});
