// describes general methods to work with webpage
// imports fake() method from 'fake_data' file to be used in other files

const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    chrome = require('selenium-webdriver/chrome'),
    options = new chrome.Options();
// gets rid of DevTools output in console
options.excludeSwitches('enable-logging');
// gets rid of "controlled by..." infobar in Chrome
options.excludeSwitches('enable-automation');
// running Chrome in Incognito to get rid of 'Save password' pop-ups
options.addArguments("--incognito");
// runs Chrome in 'headless' mode (i.e. without GUI); may speed up test execution
//options.addArguments('headless');
const fake = require('../utils/fake_data');

let Page = function() {
    this.driver = new webdriver.Builder().forBrowser('chrome')
        .setChromeOptions(options).build();
    let driver = this.driver;
    this.fake = fake;
    this.until = until;

    this.visit = function(theUrl) {
        return driver.get(theUrl);
    }

    this.close = function() {
        return driver.close();
    }

    this.checkExist = async function(loc) {
        let exist;
        if (loc[0] === 'xpath') {
            exist = await driver.findElements(By.xpath(loc[1])).then((els)=>{
                if(els.length > 0){
                    return true;
                } else {
                    return false;
                }
            });
        } else if (loc[0] === 'css') {
            exist = await driver.findElements(By.css(loc[1])).then((els)=>{
                if(els.length > 0){
                    return true;
                } else {
                    return false;
                }
            });
        }
        return exist;
    }

    this.find = async function(loc) {
        if (loc[0] === 'xpath') {
            await driver.wait(until.elementLocated(By.xpath(loc[1])), 5000);
            return await driver.findElement(By.xpath(loc[1]));
        } else if (loc[0] === 'css') {
            await driver.wait(until.elementLocated(By.css(loc[1])), 5000);
            return await driver.findElement(By.css(loc[1]));
        }
    }

    this.isVisible = async function(loc) {
        if (loc[0] === 'xpath') {
            let res = await driver.wait(until.elementLocated(By.xpath(loc[1])), 5000);
            await driver.wait(until.elementIsVisible(res), 5000);
            return await driver.findElement(By.xpath(loc[1]));
        } else if (loc[0] === 'css') {
            let res = await driver.wait(until.elementLocated(By.css(loc[1])), 5000);
            await driver.wait(until.elementIsVisible(res), 5000);
            return await driver.findElement(By.css(loc[1]));
        }
    }

    this.findAll = async function(loc) {
        if (loc[0] === 'xpath') {
            await driver.wait(until.elementsLocated(By.xpath(loc[1])), 5000);
            return await driver.findElements(By.xpath(loc[1]));
        } else if (loc[0] === 'css') {
            await driver.wait(until.elementsLocated(By.css(loc[1])), 5000);
            return await driver.findElements(By.css(loc[1]));
        }
    }

    this.areVisible = async function(loc) {
        if (loc[0] === 'xpath') {
            let res = await driver.wait(until.elementsLocated(By.xpath(loc[1])), 5000);
            for (const re of res) {
                await driver.wait(until.elementIsVisible(re), 5000);
            }
            return await driver.findElements(By.xpath(loc[1]));
        } else if (loc[0] === 'css') {
            let res = await driver.wait(until.elementsLocated(By.css(loc[1])), 5000);
            for (const re of res) {
                await driver.wait(until.elementIsVisible(re), 5000);
            }
            return await driver.findElements(By.css(loc[1]));
        }
    }

    this.write = async function(loc, txt) {
        await this.find(loc)
            .then((res) => {
                res.clear();
                res.sendKeys(txt);
                return res;
            });
    }

    this.waitAlert = async function() {
        await driver.wait(until.alertIsPresent(), 5000);
    }

    this.webdriver = webdriver;
}


// makes 'Page()' function available from import aka 'require' from other files
module.exports = Page;