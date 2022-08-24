'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const site = new URL('http://127.0.0.1:8080');

const sleep = (ms) => {
  if (!ms) {
    return;
  }
  return new Promise(resolve => setTimeout(resolve, ms)).catch();
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });

  const checked = new Set();
  const crawled = new Set();
  const queue = [site.href];
  const checkUrl = (link) => {
    if (crawled.has(link)) return false;
    if (!checked.has(link)) checked.add(link);
    const url = new URL(link);
    if (!url.protocol) return false;
    if (url.origin !== site.origin) return false;
    if (url.hash) return false;
    return true;
  };

  const crawler = async (url, cb) => {
    try {
      if (!checkUrl(url)) {
        return await cb();
      }
      await currentPage.goto(url, { waitUntil: 'networkidle2' });
      await currentPage.waitForSelector('header', {
        timeout: 30000
      });
      await currentPage.waitForFunction('window.tribeAppServiceLoaded === true', {
        timeout: 30000
      });
      const hrefs = await currentPage
        .$$eval('a[href]', as => as.map(a => a.href));
      const filteredHrefs = hrefs.flat().filter(link => !queue.includes(link) && checkUrl(link));
      if (filteredHrefs.length) {
        console.log({ addedToQueue: filteredHrefs });
        queue.push(...filteredHrefs);
      }
      crawled.add(url);
      await cb(null, currentPage);
    } catch (err) {
      crawled.delete(url);
      checked.delete(url);
      if (!queue.includes(url)) queue.push(url);
      await cb(err, currentPage);
    }
  };

  const pageProcess = async (err, currentPage) => {
    if (err) console.error(err);
    if (currentPage) {
      const pageContent = await currentPage.content();
      const pageUrl = await currentPage.url();
      const folder = path.resolve(`../static/${pageUrl.replace(site.href, '')}`);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      if (fs.existsSync(`${folder}/index.html`)) {
        fs.unlinkSync(`${folder}/index.html`);
      }
      fs.writeFileSync(`${folder}/index.html`, pageContent.replace('<base href="/">', '').replaceAll('http://127.0.0.1:8080', 'https://tomitribe.io').replaceAll('127.0.0.1:8080', 'tomitribe.io'), function (err) {
        if (err) console.error(err);
      });
    }
  }

  let currentPage = await browser.newPage();

  /*currentPage
    .on('console', message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    .on('pageerror', ({ message }) => console.log(message))*/

  while (queue.length > 0) {
    const currentUrl = queue.shift();
    console.log({ currentUrl, queue });
    await crawler(currentUrl, pageProcess);
  }

  await currentPage.close();
  await browser.close();
})();

