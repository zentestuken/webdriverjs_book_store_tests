// describes the tests using methods from login_page.js Page object
// run by 'mocha <path_to_folder_or_file>' in Node.js console

// requires 'mocha', 'chai' and 'chai-as-promised' modules installed in Node.js

const Page = require('../lib/login_page');
const chai = require('chai');
const locs = require("../utils/locators");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();
let page;
let x, y;

// for syntax, methods see mochajs.org and chaijs.com
// with Mocha, the usage of arrow functions (=>) is discouraged
describe('Login page tests', function(){
    // allowed length for a whole testing session in Mocha
    // if not set - default 2000 msec
    this.timeout(200000);
    beforeEach(function(){
        page = new Page();
        page.visit('https://demoqa.com/login');
        page.driver.manage().window().setRect({width: 1000, height: 1080, x, y});
    });

    afterEach(function(){
        page.close();
    });

    it('Login with valid input', async function(){
        await page.loginValidInput().should.eventually.be.true;
    });

    it('Login with invalid username', async function(){
        await page.loginInvalidUsername().should.eventually.equal('Invalid username or password!');
    });

    it('Login with invalid password', async function(){
        await page.loginInvalidPassword().should.eventually.equal('Invalid username or password!');
    });

    it('Login with all fields empty', async function(){
        let bordersRed = await page.loginNoInput();
        bordersRed.usernameBorderRed.should.be.true;
        bordersRed.passwordBorderRed.should.be.true;
    });

    it('Go back to Registration page via button', async function(){
        await page.loginToReg().should.eventually.be.true;
    });

    it('All fields cleared on page exit', async function(){
        let fieldTexts = await page.loginFieldsClearedOnExit();
        fieldTexts.username.should.equal('');
        fieldTexts.password.should.equal('');
    });

    it('Correct message if logged in', async function(){
        await page.loginValidInput();
        await page.visit('https://demoqa.com/login');
        page.driver.manage().window().setRect({width: 1000, height: 1080, x, y});
        let loggedInMessage = await page.loginLoggedIn();
        loggedInMessage.amessage.should.equal('You are already logged in. View your profile.');
        loggedInMessage.alink.should.contain('/profile');
    });

    it('Username and logout button at Login, Book Store, Book and Profile pages if logged in', async function(){
        await page.loginValidInput();
        await page.visit('https://demoqa.com/login');
        let loginChecked = await page.loggedInWidget();
        loginChecked.checkUsername.should.be.true;
        loginChecked.checkButton.should.be.true;
        await page.visit('https://demoqa.com/books');
        loginChecked = await page.loggedInWidget();
        loginChecked.checkUsername.should.be.true;
        loginChecked.checkButton.should.be.true;
        let bookLink = await page.find(locs.storeBookLink);
        await bookLink.click();
        loginChecked = await page.loggedInWidget();
        loginChecked.checkUsername.should.be.true;
        loginChecked.checkButton.should.be.true;
        await page.visit('https://demoqa.com/profile');
        loginChecked = await page.loggedInWidget();
        loginChecked.checkUsername.should.be.true;
        loginChecked.checkButton.should.be.true;
    });

    it('Logout from Login, Book Store, Book and Profile pages if logged in', async function(){
        await page.loginValidInput();
        page.visit('https://demoqa.com/login');
        let logOutFromLoginPage = await page.logOut();
        page.close();

        page = new Page();
        page.visit('https://demoqa.com/login');
        page.driver.manage().window().setRect({width: 1000, height: 1080, x, y});
        await page.loginValidInput();
        page.visit('https://demoqa.com/books');
        let logOutFromBookStorePage = await page.logOut();
        page.close();

        page = new Page();
        page.visit('https://demoqa.com/login');
        page.driver.manage().window().setRect({width: 1000, height: 1080, x, y});
        await page.loginValidInput();
        page.visit('https://demoqa.com/books');
        let bookLink = await page.find(locs.storeBookLink);
        await bookLink.click();
        let logOutFromBookPage = await page.logOut();
        page.close();

        page = new Page();
        page.visit('https://demoqa.com/login');
        page.driver.manage().window().setRect({width: 1000, height: 1080, x, y});
        await page.loginValidInput();
        let logOutFromProfilePage = await page.logOut();

        logOutFromLoginPage.should.be.true;
        logOutFromBookStorePage.should.be.true;
        logOutFromBookPage.should.be.true;
        logOutFromProfilePage.should.be.true;
    });
});