// describes methods to work with this specific page (profile page)

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

Page.prototype.loginValid = async function () {
    await this.driver.get('https://demoqa.com/login');
    await this.write(locs.loginUsername, validUsername);
    await this.write(locs.loginPassword, validPassword);
    let loginButton = await this.find(locs.loginButton);
    await loginButton.click();
    let profileOpened = await this.driver.wait(async () => {
        let url = await this.driver.getCurrentUrl();
        return url.includes('/profile');
    }, 5000, 'Profile page did not open');
    return profileOpened;
}

Page.prototype.addBookToCollection = async function (bookNumber) {
    await this.driver.get('https://demoqa.com/books');
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/books');
    }, 7000, 'Book Store page did not open');
    let number = (bookNumber) ? bookNumber - 1 : 0;
    await this.findAll(locs.storeBookLink);
    if (await this.checkExist(locs.loggedInLogoutButton)) {
    } else {
        await this.loginValid();
        await this.driver.get('https://demoqa.com/books');
    }
    let bookLinks = await this.findAll(locs.storeBookLink);
    let bookLink = await bookLinks[number];
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await bookLink.click();
    let addButton = await this.isVisible(locs.bookAddButton);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await addButton.click();
    await this.waitAlert();
    let alert = await this.driver.switchTo().alert();
    let alertText = await alert.getText();
    await alert.accept();
    await this.driver.get('https://demoqa.com/profile');
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/profile');
    }, 7000, 'Profile page did not open');
    return alertText;
}

Page.prototype.checkBookList = async function () {
    await this.addBookToCollection();
    let rows = await this.areVisible(locs.profileRow);
    let imageHeader = await this.isVisible(locs.profileImageHeader);
    let titleHeader = await this.isVisible(locs.profileTitleHeader);
    let authorHeader = await this.isVisible(locs.profileAuthorHeader);
    let publisherHeader =  await this.isVisible(locs.profilePublisherHeader);
    return {
        rowsAreShown: (await rows.length) > 0,
        imageHeader: (await imageHeader.getText()) != false ,
        titleHeader: (await titleHeader.getText()) != false,
        authorHeader: (await authorHeader.getText()) != false,
        publisherHeader: (await publisherHeader.getText()) != false
    }
}

Page.prototype.addSeveralBooksToCollection = async function () {
    await this.driver.get('https://demoqa.com/books');
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/books');
    }, 7000, 'Book Store page did not open');
    let bookCount = (await this.findAll(locs.storeBookLink)).length;
    for (let i = 1; i <= bookCount; i++) {
        await this.addBookToCollection(i);
        let backButton = await this.isVisible(locs.profileBackButton);
        await this.driver.executeScript("window.scrollBy(0,1000)");
        await backButton.click();
        await this.driver.wait(async () => {
            let res = await this.driver.getCurrentUrl();
            return res.includes('/books');
        }, 7000, 'Book Store page did not open');
    }
}

Page.prototype.changeRowCount = async function (rowNumber) {
    let dropdown = await this.find(locs.profilePageDropdown);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await dropdown.click();
    await this.areVisible(locs.profilePageOptions);
    let option = await this.find([locs.profilePageOptions[0], locs.profilePageOptions[1] + `[@value="${rowNumber}"]`]);
    await option.click();
    let rows = await this.areVisible(locs.profileRow);
    return rows.length;
}

Page.prototype.changePages = async function () {
    await this.addSeveralBooksToCollection();
    await this.driver.get('https://demoqa.com/profile');
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/profile');
    }, 7000, 'Profile page did not open');
    await this.changeRowCount(5);
    let nextBtn = await this.find(locs.profileNextButton);
    let previousBtn = await this.find(locs.profilePreviousButton);
    let totalPages = await this.find(locs.profilePagesTotal);
    let buttonsAtStart = {
        prevBtnDisabled: (await previousBtn.isEnabled() === false),
        nextBtnEnabled: (await nextBtn.isEnabled() === true),
        prevBtnLighter: (await previousBtn.getCssValue('opacity') === '0.5'),
        nextBtnDarker: (await nextBtn.getCssValue('opacity') === '1')
    }
    for (let i = 0; i < Number(await totalPages.getText()); i++) {
        nextBtn = await this.find(locs.profileNextButton);
        await nextBtn.click();
    }
    nextBtn = await this.find(locs.profileNextButton);
    previousBtn = await this.find(locs.profilePreviousButton);
    let pageNum = await this.find(locs.profilePageNumberLabel);
    let pageChanges = (Number(await pageNum.getAttribute('value'))
        === Number(await totalPages.getText()));
    let buttonsAtEnd = {
        prevBtnEnabled: (await previousBtn.isEnabled() === true),
        nextBtnDisabled: (await nextBtn.isEnabled() === false),
        prevBtnDarker: (await previousBtn.getCssValue('opacity') === '1'),
        nextBtnLighter: (await nextBtn.getCssValue('opacity') === '0.5')
    }
    await previousBtn.click();
    pageNum = await this.find(locs.profilePageNumberLabel);
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
    await this.addBookToCollection();
    let bookLink = await this.find(locs.profileBookLink);
    let bookTitle = await bookLink.getText();
    await bookLink.click();
    await this.isVisible(locs.bookISBN);
    let currentTitle = await this.find(locs.bookTitle);
    await this.find(locs.bookSubtitle);
    await this.find(locs.bookAuthor);
    await this.find(locs.bookPublisher);
    await this.find(locs.bookTotalPages);
    await this.find(locs.bookDescription);
    let titleIsCorrect = (bookTitle === await currentTitle.getText());
    return titleIsCorrect;
}

Page.prototype.backToBookStore = async function () {
    await this.loginValid();
    let backButton = await this.isVisible(locs.profileBackButton);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await backButton.click();
    let storeOpened = await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/books');
    }, 5000, 'Book Store page did not open');
    return storeOpened;
}

Page.prototype.searchCollection = async function () {
    await this.addSeveralBooksToCollection();
    await this.driver.get('https://demoqa.com/profile');
    await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/profile');
    }, 5000, 'Profile page did not open');
    let bookLinks = await this.findAll(locs.profileBookLink);
    let rows = await this.findAll(locs.profileRow);
    let rowNumber = Math.floor(Math.random() * (await bookLinks.length - 0.1));
    let rowText = (await rows[rowNumber].getText()).split("\n");
    let sectionNumber = Math.floor(Math.random() * (3 - 0.1));
    await this.write(locs.profileSearchInput, rowText[sectionNumber].substring(0, 10));
    let resultBookLinks = await this.findAll(locs.profileBookLink);
    let resultRows = await this.findAll(locs.profileRow);
    let checks = [];
    for (let i = 0; i < (await resultBookLinks.length); i++) {
        let resultText = await resultRows[i].getText();
        checks.push(resultText.includes(rowText[sectionNumber].substring(0, 10)));
    }
    return checks.every((el) => { return el === true });
}

Page.prototype.deleteOneBook = async function () {
    await this.addBookToCollection(1);
    await this.addBookToCollection(2);
    let bookLink = await this.findAll(locs.profileBookLink);
    let bookCountBefore = bookLink.length;
    let deleteBtn = await this.find(locs.profileDeleteButton);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    await deleteBtn.click();
    let modalBtnOk = await this.isVisible(locs.profileModalOkButton);
    await modalBtnOk.click();
    await this.waitAlert();
    let alert = await this.driver.switchTo().alert();
    let alertText = await alert.getText();
    await alert.accept();
    bookLink = await this.findAll(locs.profileBookLink);
    let bookCountAfter = bookLink.length;
    return {
        alertText: alertText,
        oneBookLess: (bookCountBefore === bookCountAfter + 1)
    };
}

Page.prototype.cancelDeleteOneBook = async function () {
    await this.addBookToCollection(1);
    await this.addBookToCollection(2);
    let bookLink = await this.findAll(locs.profileBookLink);
    let bookCountBefore = bookLink.length;
    let deleteBtn = await this.find(locs.profileDeleteButton);
    await deleteBtn.click();
    let modalBtnCancel = await this.isVisible(locs.profileModalCancelButton);
    await modalBtnCancel.click();
    bookLink = await this.findAll(locs.profileBookLink);
    let bookCountAfter = bookLink.length;
    return (bookCountBefore === bookCountAfter);
}

Page.prototype.deleteAllBooks = async function () {
    await this.addBookToCollection(1);
    await this.addBookToCollection(2);
    await this.findAll(locs.profileBookLink);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    let deleteAllBtn = await this.find(locs.profileDeleteAllButton);
    await deleteAllBtn.click();
    let modalBtnOk = await this.isVisible(locs.profileModalOkButton);
    await modalBtnOk.click();
    await this.waitAlert();
    let alert = await this.driver.switchTo().alert();
    let alertText = await alert.getText();
    await alert.accept();
    let checkBookLinks = await this.checkExist(locs.profileBookLink);
    return {
        alertText: alertText,
        noBooks: !checkBookLinks
    };
}

Page.prototype.cancelDeleteAllBooks = async function () {
    await this.addBookToCollection(1);
    await this.addBookToCollection(2);
    await this.findAll(locs.profileBookLink);
    await this.driver.executeScript("window.scrollBy(0,1000)");
    let deleteAllBtn = await this.find(locs.profileDeleteAllButton);
    await deleteAllBtn.click();
    let modalBtnCancel = await this.isVisible(locs.profileModalCancelButton);
    await modalBtnCancel.click();
    let checkBookLinks = await this.checkExist(locs.profileBookLink);
    return checkBookLinks;
}

Page.prototype.profileLoggedOut = async function () {
    let message = await this.isVisible(locs.profileLoggedOutMessage);
    let links = await this.findAll(locs.profileLoggedOutMessageLinks);
    return {
        message: await message.getText(),
        linkAddress1: await links[0].getAttribute('href'),
        linkAddress2: await links[1].getAttribute('href')
    };
}

Page.prototype.cancelDeleteAccount = async function () {
    await this.loginValid();
    await this.driver.executeScript("window.scrollBy(0,1000)");
    let deleteAccountBtn = await this.isVisible(locs.profileDeleteAccountButton);
    await deleteAccountBtn.click();
    let modalBtnCancel = await this.isVisible(locs.profileModalCancelButton);
    await modalBtnCancel.click();
    return await this.checkExist(locs.loggedInLogoutButton);
}

Page.prototype.deleteAccount = async function () {
    await this.loginValid();
    await this.driver.executeScript("window.scrollBy(0,1000)");
    let deleteAccountBtn = await this.isVisible(locs.profileDeleteAccountButton);
    await deleteAccountBtn.click();
    let modalBtnOk = await this.isVisible(locs.profileModalOkButton);
    await modalBtnOk.click();
    await this.waitAlert();
    let alert = await this.driver.switchTo().alert();
    let alertText = await alert.getText();
    await alert.accept();
    let loginOpened = await this.driver.wait(async () => {
        let res = await this.driver.getCurrentUrl();
        return res.includes('/login');
    }, 5000).then((res) => {return true;}, (err) => {
        if (err.name === 'TimeoutError') {return false;}
    });
    return {
        loginOpened: loginOpened,
        message: alertText
    };
}


module.exports = Page;