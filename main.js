const puppeteer = require('puppeteer');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function run() {
    let browser;
    try {


        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://orteil.dashnet.org/cookieclicker/');

        await page.waitForSelector('#langSelect-PT-BR', { visible: true });
        await page.click('#langSelect-PT-BR');

        await delay(5000);

        await page.waitForSelector('#bigCookie', { visible: true });

        function searchUpgrade(number) {
            return page.$eval(`#upgrade${number}`, el => parseFloat(el.innerText));
        }

        function clickUpgrade(number) {
            page.click(`#upgrade${number}`);
        }

        countUpgrade = 0;

        while (true) {
            const cokkies = await page.$eval('#cookies', el => parseFloat(el.innerText));
            const priceValue = await page.$eval('#productPrice0', el => parseFloat(el.innerText));

            await page.click('#bigCookie');

            if (cokkies > priceValue) {
                await page.click('.product');
            }

            const upgradePrice = await searchUpgrade(countUpgrade);

            if (cookies > upgradePrice) {
                await clickUpgrade(countUpgrade);
                countUpgrade++;
            }

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
