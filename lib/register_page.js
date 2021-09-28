// describes methods to work with this specific page (register page)

// imports Page object from base_page.js and uses it's methods
const Page = require('./base_page');
// couple functions from 'helpers.js' are also imported
const helpers = require("../utils/helpers");
// imports locators from 'locators.js'
const locs = require("../utils/locators");

Page.prototype.regNoFirstName = async function () {
    let firstName = await this.find(locs.regFirstName);
    await this.write(locs.regLastName, this.fake().lastName);
    await this.write(locs.regUsername, this.fake().username);
    await this.write(locs.regPassword, helpers.generateValidPassword());
    let regButton = await this.find(locs.regButton);
    await regButton.click();
    let borderIsRed = await this.driver.wait(async () => {
        let res = await firstName.getCssValue('border-color');
        return res === 'rgb(220, 53, 69)';
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return borderIsRed;
}

Page.prototype.regNoLastName = async function () {
    await this.write(locs.regFirstName, this.fake().firstName);
    let lastName = await this.find(locs.regLastName);
    await this.write(locs.regUsername, this.fake().username);
    await this.write(locs.regPassword, helpers.generateValidPassword());
    let regButton = await this.find(locs.regButton);
    await regButton.click();
    let borderIsRed = await this.driver.wait(async () => {
        let res = await lastName.getCssValue('border-color');
        return res === 'rgb(220, 53, 69)';
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return borderIsRed;
}

Page.prototype.regNoUsername = async function () {
    await this.write(locs.regFirstName, this.fake().firstName);
    await this.write(locs.regLastName, this.fake().lastName);
    let username = await this.find(locs.regUsername);
    await this.write(locs.regPassword, helpers.generateValidPassword());
    let regButton = await this.find(locs.regButton);
    await regButton.click();
    let borderIsRed = await this.driver.wait(async () => {
        let res = await username.getCssValue('border-color');
        return res === 'rgb(220, 53, 69)';
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return borderIsRed;
}

Page.prototype.regNoPassword = async function () {
    await this.write(locs.regFirstName, this.fake().firstName);
    await this.write(locs.regLastName, this.fake().lastName);
    await this.write(locs.regUsername, this.fake().username);
    let password = await this.find(locs.regPassword);
    let regButton = await this.find(locs.regButton);
    await regButton.click();
    let borderIsRed = await this.driver.wait(async () => {
        let res = await password.getCssValue('border-color');
        return res === 'rgb(220, 53, 69)';
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return borderIsRed;
}

Page.prototype.regCaptchaNotSolved = async function () {
    await this.write(locs.regFirstName, this.fake().firstName);
    await this.write(locs.regLastName, this.fake().lastName);
    await this.write(locs.regUsername, this.fake().username);
    await this.write(locs.regPassword, helpers.generateValidPassword());
    let regButton = await this.find(locs.regButton);
    await regButton.click();
    let captchaMsg = await this.isVisible(locs.regCaptchaMessage);
    return await captchaMsg.getText();
}

Page.prototype.regBackToLogin = async function () {
    let backButton = await this.find(locs.regBackButton);
    await backButton.click();
    let loginOpened = await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/login');
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return loginOpened;
}

Page.prototype.regFieldsClearedOnExit = async function () {
    await this.write(locs.regFirstName, this.fake().firstName);
    await this.write(locs.regLastName, this.fake().lastName);
    await this.write(locs.regUsername, this.fake().username);
    await this.write(locs.regPassword, helpers.generateValidPassword());
    let backButton = await this.find(locs.regBackButton);
    await backButton.click();
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/login');
    }, 5000, 'Login page did not open');
    let newButton = await this.find(locs.loginNewButton);
    await newButton.click();
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/register');
    }, 5000, 'Registration page did not open');
    let firstName = await this.find(locs.regFirstName);
    let lastName = await this.find(locs.regLastName);
    let username = await this.find(locs.regUsername);
    let password = await this.find(locs.regPassword);
    return {
        firstName: await firstName.getText(),
        lastName: await lastName.getText(),
        username: await username.getText(),
        password: await password.getText()
    }
}


module.exports = Page;