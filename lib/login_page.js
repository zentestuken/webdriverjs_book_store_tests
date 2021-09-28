// describes methods to work with this specific page (login page)

// imports Page object from base_page.js and uses it's methods
const Page = require('./base_page');
// couple functions from 'helpers.js' are also imported
const helpers = require("../utils/helpers");
// import username and password of previously created account
const valid = require("../utils/valid_account_data");
// imports locators from 'locators.js'
const locs = require("../utils/locators");

let validUsername = valid.validUsername,
    validPassword = valid.validPassword;

Page.prototype.loginValidInput = async function () {
    await this.write(locs.loginUsername, validUsername);
    await this.write(locs.loginPassword, validPassword);
    let loginButton = await this.find(locs.loginButton);
    await loginButton.click();
    let profileOpened = await this.driver.wait(async () => {
        let url = await this.driver.getCurrentUrl();
        return url.includes('/profile');
    }, 5000).then((res) => {return true;}, (err) => {
        if (err.name === 'TimeoutError') {return false;}
    });
    return profileOpened;
}

Page.prototype.loginInvalidUsername = async function () {
    await this.write(locs.loginUsername, this.fake().username);
    await this.write(locs.loginPassword, validPassword);
    let loginButton = await this.find(locs.loginButton);
    await loginButton.click();
    let message = await this.isVisible(locs.loginFailureMessage);
    return await message.getText();
}

Page.prototype.loginInvalidPassword = async function () {
    await this.write(locs.loginUsername, validUsername);
    await this.write(locs.loginPassword, helpers.generateValidPassword());
    let loginButton = await this.find(locs.loginButton);
    await loginButton.click();
    let message = await this.isVisible(locs.loginFailureMessage);
    return await message.getText();
}

Page.prototype.loginNoInput = async function () {
    let username = await this.find(locs.loginUsername);
    let password = await this.find(locs.loginPassword);
    let loginButton = await this.find(locs.loginButton);
    await loginButton.click();
    let usernameBorderRed = await this.driver.wait(async () => {
        let color = await username.getCssValue('border-color');
        return color === 'rgb(220, 53, 69)';
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    let passwordBorderRed = await this.driver.wait(async () => {
        let color = await password.getCssValue('border-color');
        return color === 'rgb(220, 53, 69)';
        }, 5000).then((res) => {return true;}, (err) => {
        if (err.name === 'TimeoutError') {return false;}
    });
    return {
        usernameBorderRed: usernameBorderRed,
        passwordBorderRed: passwordBorderRed
    }
}

Page.prototype.loginToReg = async function () {
    let newButton = await this.find(locs.loginNewButton);
    await newButton.click();
    let regOpened = await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/register');
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return regOpened;
}

Page.prototype.loginFieldsClearedOnExit = async function () {
    await this.write(locs.loginUsername, this.fake().username);
    await this.write(locs.loginPassword, helpers.generateValidPassword());
    let newButton = await this.find(locs.loginNewButton);
    await newButton.click();
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/register');
    }, 5000, 'Registration page did not open');
    let backButton = await this.find(locs.regBackButton);
    await backButton.click();
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/login');
    }, 5000, 'Login page did not open');
    let username = await this.find(locs.loginUsername);
    let password = await this.find(locs.loginPassword);
    return {
        username: await username.getText(),
        password: await password.getText()
    }
}

Page.prototype.loginLoggedIn = async function () {
    let message = await this.isVisible(locs.loginLoggedInMessage);
    let link = await this.find(locs.loginLoggedInProfileLink);
    return {
        amessage: await message.getText(),
        alink: await link.getAttribute('href')
    }
}

Page.prototype.loggedInWidget = async function () {
    let username = await this.isVisible(locs.loggedInUsername);
    let text = await username.getText();
    let button = await this.checkExist(locs.loggedInLogoutButton);
    return {
        checkUsername: (text === validUsername),
        checkButton: button
    }
}

Page.prototype.logOut = async function () {
    let button = await this.isVisible(locs.loggedInLogoutButton);
    await button.click();
    let loginOpened = await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/login');
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return loginOpened;
}


module.exports = Page;