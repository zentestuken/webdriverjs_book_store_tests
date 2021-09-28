// describes the tests using methods from register_page.js Page object
// run by 'mocha <path_to_folder_or_file>' in Node.js console

// requires 'mocha', 'chai' and 'chai-as-promised' modules installed in Node.js

const Page = require('../lib/register_page');
const chai = require('chai');
// chai-as-promised lets chai deal with promises (via 'eventually')
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();
let page;

// for syntax, methods see mochajs.org and chaijs.com
// with Mocha, the usage of arrow functions (=>) is discouraged
describe('Registration page tests', function(){
    // allowed length for a whole testing session in Mocha
    // if not set - default 2000 msec
    this.timeout(200000);
    beforeEach(function(){
        page = new Page();
        page.visit('https://demoqa.com/register');
    });

    afterEach(function(){
        page.close();
    });

    it('Input field border red upon submit when no First Name', async function(){
        await page.regNoFirstName().should.eventually.equal(true);
    });

    it('Input field border red upon submit when no Last Name', async function(){
        await page.regNoLastName().should.eventually.equal(true);
    });

    it('Input field border red upon submit when no Username', async function(){
        await page.regNoUsername().should.eventually.equal(true);
    });

    it('Input field border red upon submit when no Password', async function(){
        await page.regNoPassword().should.eventually.equal(true);
    });

    it('Message upon submit when Captcha not solved', async function(){
        await page.regCaptchaNotSolved().should.eventually.equal('Please verify reCaptcha to register!');
    });

    it('Go back to Login page via button', async function(){
        await page.regBackToLogin().should.eventually.equal(true);
    });

    it('All fields cleared on page exit', async function(){
        let fieldTexts = await page.regFieldsClearedOnExit();
        fieldTexts.firstName.should.equal('');
        fieldTexts.lastName.should.equal('');
        fieldTexts.username.should.equal('');
        fieldTexts.password.should.equal('');
    });
});