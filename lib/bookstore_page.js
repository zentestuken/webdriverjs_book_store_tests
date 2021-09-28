// describes methods to work with this specific page (book store page)

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

Page.prototype.checkBookList = async function () {
    return {
        rowsAreShown: (await this.areVisible(locs.storeRow)).length > 0,
        imageHeader: await this.checkExist(locs.storeImageHeader),
        titleHeader: await this.checkExist(locs.storeTitleHeader),
        authorHeader: await this.checkExist(locs.storeAuthorHeader),
        publisherHeader: await this.checkExist(locs.storePublisherHeader)
    }
}

Page.prototype.changeRowCount = async function (rowNumber) {
    await this.driver.executeScript("window.scrollBy(0,1000)");
    let dropdown = await this.find(locs.storePageDropdown);
    await dropdown.click();
    await this.areVisible(locs.storePageOptions);
    let option = await this.find([locs.storePageOptions[0], locs.storePageOptions[1] + `[@value="${rowNumber}"]`]);
    await option.click();
    let rows = await this.areVisible(locs.storeRow);
    return rows.length;
}

Page.prototype.changePages = async function () {
    await this.changeRowCount(5);
    let nextBtn = await this.find(locs.storeNextButton);
    let previousBtn = await this.find(locs.storePreviousButton);
    let totalPages = await this.find(locs.storePagesTotal);
    let buttonsAtStart = {
        prevBtnDisabled: (await previousBtn.isEnabled() === false),
        nextBtnEnabled: (await nextBtn.isEnabled() === true),
        prevBtnLighter: (await previousBtn.getCssValue('opacity') === '0.5'),
        nextBtnDarker: (await nextBtn.getCssValue('opacity') === '1')
    }
    for (let i = 0; i < Number(await totalPages.getText()); i++) {
        nextBtn = await this.find(locs.storeNextButton);
        await nextBtn.click();
    }
    nextBtn = await this.find(locs.storeNextButton);
    previousBtn = await this.find(locs.storePreviousButton);
    let pageNum = await this.find(locs.storePageNumberLabel);
    let pageChanges = (Number(await pageNum.getAttribute('value'))
        === Number(await totalPages.getText()));
    let buttonsAtEnd = {
        prevBtnEnabled: (await previousBtn.isEnabled() === true),
        nextBtnDisabled: (await nextBtn.isEnabled() === false),
        prevBtnDarker: (await previousBtn.getCssValue('opacity') === '1'),
        nextBtnLighter: (await nextBtn.getCssValue('opacity') === '0.5')
    }
    await previousBtn.click();
    pageNum = await this.find(locs.storePageNumberLabel);
    let pageChangesBack = (Number(await pageNum.getAttribute('value'))
        === Number(await totalPages.getText()) - 1);
    return {
        buttonsAtStart: buttonsAtStart,
        buttonsAtEnd: buttonsAtEnd,
        pageChanges: pageChanges,
        pageChangesBack: pageChangesBack
    }
}

Page.prototype.openBookPage = async function () {
    let bookLink = await this.find(locs.storeBookLink);
    let bookTitle = await bookLink.getText();
    await bookLink.click();
    await this.isVisible(locs.bookISBN);
    let currentTitle = await this.find(locs.bookTitle);
    await this.find(locs.bookSubtitle);
    await this.find(locs.bookAuthor);
    await this.find(locs.bookPublisher);
    await this.find(locs.bookTotalPages);
    await this.find(locs.bookDescription);
    return (bookTitle === await currentTitle.getText());
}

Page.prototype.backToBookStore = async function () {
    let bookLink = await this.find(locs.storeBookLink);
    await bookLink.click();
    let backButton = await this.isVisible(locs.bookBackButton);
    await backButton.click();
    let storeOpened = await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/books');
        }, 5000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return storeOpened;
}

Page.prototype.loginValid = async function () {
    await this.driver.get('https://demoqa.com/login');
    await this.write(locs.loginUsername, validUsername);
    await this.write(locs.loginPassword, validPassword);
    let loginButton = await this.find(locs.loginButton);
    await loginButton.click();
    let profileOpened = await this.driver.wait(async () => {
        let url = await this.driver.getCurrentUrl();
        return url.includes('/profile');
        }, 7000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    return profileOpened;
}

Page.prototype.addBookToCollection = async function () {
    await this.loginValid();
    await this.driver.get('https://demoqa.com/books');
    let bookLink = await this.find(locs.storeBookLink);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await bookLink.click();
    let addButton = await this.isVisible(locs.bookAddButton);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await addButton.click();
    await this.waitAlert();
    let alert = await this.driver.switchTo().alert();
    let alertText = await alert.getText();
    await alert.accept();
    return alertText;
}

Page.prototype.addBookToCollectionTwice = async function () {
    await this.loginValid();
    await this.driver.get('https://demoqa.com/books');
    let bookLink = await this.find(locs.storeBookLink);
    await bookLink.click();
    let addButton = await this.isVisible(locs.bookAddButton);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await addButton.click();
    await this.waitAlert();
    let alert = await this.driver.switchTo().alert();
    await alert.accept();
    addButton = await this.isVisible(locs.bookAddButton);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await addButton.click();
    await this.waitAlert();
    let alert2 = await this.driver.switchTo().alert();
    let alertText = await alert2.getText();
    await alert2.accept();
    return alertText;
}

Page.prototype.checkLoginButton = async function () {
    let loginButtonAtBookStorePage = await this.driver.wait(async () => {
        return await this.find(locs.loginButton);
        }, 7000).then((res) => {return true;}, (err) => {
            if (err.name === 'TimeoutError') {return false;}
        });
    await this.openBookPage();
    let loginButtonAtBookPage = await this.driver.wait(async () => {
        return await this.find(locs.loginButton);
    }, 7000).then((res) => {return true;}, (err) => {
        if (err.name === 'TimeoutError') {return false;}
    });
    return loginButtonAtBookStorePage && loginButtonAtBookPage;
}

Page.prototype.searchBookList = async function () {
    let bookLinks = await this.findAll(locs.storeBookLink);
    let rows = await this.findAll(locs.storeRow);
    let rowNumber = Math.floor(Math.random() * (await bookLinks.length - 0.1));
    let rowText = (await rows[rowNumber].getText()).split("\n");
    let sectionNumber = Math.floor(Math.random() * (3 - 0.1));
    await this.write(locs.storeSearchInput, rowText[sectionNumber].substring(0, 10));
    let resultBookLinks = await this.findAll(locs.storeBookLink);
    let resultRows = await this.findAll(locs.storeRow);
    let checks = [];
    for (let i = 0; i < (await resultBookLinks.length); i++) {
        let resultText = await resultRows[i].getText();
        checks.push(resultText.includes(rowText[sectionNumber].substring(0, 10)));
    }
    return checks.every((el) => { return el === true });
}


module.exports = Page;