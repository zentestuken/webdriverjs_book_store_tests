// describes the tests using methods from bookstore_page.js Page object
// run by 'mocha <path_to_folder_or_file>' in Node.js console

// requires 'mocha', 'chai' and 'chai-as-promised' modules installed in Node.js

const Page = require('../lib/bookstore_page');
const chai = require('chai');
// chai-as-promised lets chai deal with promises (via 'eventually')
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const helpers = require("../utils/helpers");
const should = chai.should();
let page;

// for syntax, methods see mochajs.org and chaijs.com
// with Mocha, the usage of arrow functions (=>) is discouraged
describe('Book Store page tests', function(){
    // allowed length for a whole testing session in Mocha
    // if not set - default 2000 msec
    this.timeout(200000);
    beforeEach(function(){
        page = new Page();
        page.visit('https://demoqa.com/books');
    });

    afterEach(function(){
        page.close();
    });

    it('Shows books list', async function(){
        let booklist = await page.checkBookList();
        booklist.rowsAreShown.should.be.true;
        booklist.imageHeader.should.be.true;
        booklist.titleHeader.should.be.true;
        booklist.authorHeader.should.be.true;
        booklist.publisherHeader.should.be.true;
    });

    it('Can change row count', async function(){
        let rowCountInput = [5, 10, 20, 25, 50, 100];
        let rowcounts = [];
        for (let i = 0; i < rowCountInput.length; i++) {
            let result = await page.changeRowCount(rowCountInput[i]);
            rowcounts.push(result);
        }
        helpers.arraysEqual(rowcounts, rowCountInput).should.be.true;
    });

    it('Can change current page', async function(){
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

    it('Opens book page', async function(){
        await page.openBookPage().should.eventually.be.true;
    });

    it('Go back to Book Store page from Book page', async function(){
        await page.backToBookStore().should.eventually.be.true;
    });

    it('Add book to user collection', async function(){
        await page.addBookToCollection().should.eventually.equal('Book added to your collection.');
    });

    it('Message on attempt to add book to user collection twice', async function(){
        await page.addBookToCollectionTwice().should.eventually.equal('Book already present in the your collection!');
    });

    it('Login button at Book Store and Book pages if not logged in', async function(){
        await page.checkLoginButton().should.eventually.be.true;
    });

    it('Search in Book Store page list', async function(){
        await page.searchBookList().should.eventually.be.true;
    });
});