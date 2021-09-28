// describes the tests using methods from profile_page.js Page object
// run by 'mocha <path_to_folder_or_file>' in Node.js console

// requires 'mocha', 'chai' and 'chai-as-promised' modules installed in Node.js

const Page = require('../lib/profile_page');
const chai = require('chai');
// chai-as-promised lets chai deal with promises (via 'eventually')
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const locs = require("../utils/locators");
const helpers = require("../utils/helpers");
const should = chai.should();
let page;

// for syntax, methods see mochajs.org and chaijs.com
// with Mocha, the usage of arrow functions (=>) is discouraged
describe('Profile page tests', function(){
    // allowed length for a whole testing session in Mocha
    // if not set - default 2000 msec
    this.timeout(250000);
    beforeEach(function(){
        page = new Page();
        page.visit('https://demoqa.com/profile');
    });

    afterEach(function(){
        page.close();
    });

    it('Shows user collection', async function(){
        let booklist = await page.checkBookList();
        booklist.rowsAreShown.should.be.true;
        booklist.imageHeader.should.be.true;
        booklist.titleHeader.should.be.true;
        booklist.authorHeader.should.be.true;
        booklist.publisherHeader.should.be.true;
    });

    it('Can delete one book from collection', async function(){
         let result = await page.deleteOneBook();
         result.alertText.should.contain('Book deleted');
         result.oneBookLess.should.be.true;
     });

     it('Can cancel the deletion of one book from collection', async function(){
          await page.cancelDeleteOneBook().should.eventually.be.true;
      });

    it('Can change row count in user collection', async function(){
        await page.addSeveralBooksToCollection();
        await page.visit('https://demoqa.com/profile');
        let rowCountInput = [5, 10, 20, 25, 50, 100];
        let rowcounts = [];
        for (let i = 0; i < rowCountInput.length; i++) {
            let result = await page.changeRowCount(rowCountInput[i]);
            rowcounts.push(result);
        }
        helpers.arraysEqual(rowcounts, rowCountInput).should.be.true;
    });

    it('Can change current page in user collection', async function(){
        let result = await page.changePages();
        result.buttonsAtStart.prevBtnDisabled.should.be.true;
        result.buttonsAtStart.nextBtnEnabled.should.be.true;
        result.buttonsAtStart.prevBtnLighter.should.be.true;
        result.buttonsAtStart.nextBtnDarker.should.be.true;
        result.buttonsAtEnd.prevBtnEnabled.should.be.true;
        result.buttonsAtEnd.nextBtnDisabled.should.be.true;
        result.buttonsAtEnd.prevBtnDarker.should.be.true;
        result.buttonsAtEnd.nextBtnLighter.should.be.true;
        result.pageChanges.should.be.true;
        result.pageChangesBack.should.be.true;
    });

    it('Opens book page from user collection', async function(){
        await page.openBookPage().should.eventually.be.true;
    });

    it('Go back to Book Store page from Profile page', async function(){
        await page.backToBookStore().should.eventually.be.true;
    });

    it('Can search user collection', async function(){
        await page.searchCollection().should.eventually.be.true;
    });

    it('Can delete all books at once from collection', async function(){
        let result = await page.deleteAllBooks();
        result.alertText.should.contain('All Books deleted');
        result.noBooks.should.be.true;
    });

    it('Can cancel the deletion of all books from collection', async function(){
        await page.cancelDeleteAllBooks().should.eventually.be.true;
    });

    it('Correct message at Profile page if not logged in', async function(){
        let result = await page.profileLoggedOut();
        result.message.should.contain('Currently you are not logged into the Book Store application, please visit the login page to enter or register page' +
            ' to register yourself');
        result.linkAddress1.should.contain('/login');
        result.linkAddress2.should.contain('/register');

    });

    it('Can cancel the deletion of an account', async function(){
        await page.cancelDeleteAccount().should.eventually.be.true;
    });

    it('Can delete an account', async function(){
        let result = await page.deleteAccount();
        result.loginOpened.should.be.true;
        result.message.should.contain('User Deleted');
    });
});