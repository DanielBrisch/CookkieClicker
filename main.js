const puppeteer = require('puppeteer');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
async function run() {
    let browser;

    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let countNotes = 0;

    async function upgrade() {
        const upgradeSelector = `#upgrade0`;
        const hasEnabledClass = await page.evaluate((selector) => {
            const upgradeElement = document.querySelector(selector);
            return upgradeElement && upgradeElement.classList.contains('enabled');
        }, upgradeSelector);

        if (hasEnabledClass) {
            await page.click(upgradeSelector);
            return true;
        }

        return false;
    }

    async function closeNote(noteId) {
        const noteSelector = `#note-${noteId}`;
        const closeButtonSelector = `${noteSelector} .close`;

        const noteExists = await page.$(noteSelector) !== null;
        if (!noteExists) {
            return false;
        }

        const closeButtonExists = await page.$(closeButtonSelector) !== null;
        if (!closeButtonExists) {
            return false;
        }
        await page.click(closeButtonSelector);
        if (countNotes == 0) {
            countNotes += 1;
        }
        countNotes++;
        return true;
    }

    async function products() {
        const cokkies = await page.$eval('#cookies', el => parseFloat(el.innerText));
        const priceValueProduct0 = await page.$eval(`#productPrice0`, el => parseFloat(el.innerText));
        const priceValueProduct1 = await page.$eval(`#productPrice1`, el => parseFloat(el.innerText));

        if (cokkies > priceValueProduct0) {
            await page.click('#product0');
        }

        if (cokkies > priceValueProduct1) {
            await page.click('#product1');
        }

    }

    try {

        await page.goto('https://orteil.dashnet.org/cookieclicker/');

        await page.waitForSelector('#langSelect-PT-BR', { visible: true });
        await page.click('#langSelect-PT-BR');

        await delay(5000);

        await page.waitForSelector('#bigCookie', { visible: true });

        await page.click('a.cc_btn.cc_btn_accept_all');

        while (true) {
            await closeNote(countNotes);

            await page.click('#bigCookie');

            await upgrade();

            await products();
        }



    } catch (error) {
        await page.screenshot({ path: 'example.png' });
        console.error(error);
    } finally {
        if (browser && process.argv.includes("--close-on-success")) {
            await browser.close();
        }
    }
}

run();
