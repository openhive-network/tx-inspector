import { chromium, type ChromiumBrowser } from "playwright";
import { mockTest } from "../assets/jest-helper";
import { mockData } from "./data";

let browser!: ChromiumBrowser;

mockTest.describe('transaction inspector tests based on mock data', () => {
  mockTest.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  mockTest('', async ({ txInspectorMockTest }) => {
    const a = await txInspectorMockTest(async ({ analyzer }) => {
      return analyzer.analyzeTransaction(mockData.trx);
    }, mockData);
  });
});
