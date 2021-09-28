// here, locators are stored for ease of access
// all locators are arrays where first element is type of locator

module.exports = {
    // register page
    regFirstName: ['css', 'input#firstname'],
    regLastName: ['css', 'input#lastname'],
    regUsername: ['css', 'input#userName'],
    regPassword: ['css', 'input#password'],
    regCaptcha: ['xpath', '//iframe[@title="reCAPTCHA"]'],
    regCaptchaMessage: ['css', 'div#output p#name'],
    regButton: ['css', 'button#register'],
    regBackButton: ['css', 'button#gotologin'],

    // login page
    loginUsername: ['css', 'input#userName'],
    loginPassword: ['css', 'input#password'],
    loginButton: ['css', 'button#login'],
    loginNewButton: ['css', 'button#newUser'],
    loginFailureMessage: ['css', 'div#output p#name'],
    loginLoggedInMessage: ['css', 'label#loading-label'],
    loginLoggedInProfileLink: ['css', 'label#loading-label a'],

    // book store page
    storeRow: ['xpath', '//div[@role="rowgroup"]'],
    storeBookLink: ['xpath', '//span[contains(@id, "see-book-")]/a'],
    storeNextButton: ['css', 'div.-next button'],
    storePreviousButton: ['css', 'div.-previous button'],
    storePageDropdown: ['xpath', '//select[@aria-label="rows per page"]'],
    storePageOptions: ['xpath', '//select[@aria-label="rows per page"]/option'],
    storePageNumberLabel: ['xpath', '//input[@aria-label="jump to page"]'],
    storePagesTotal: ['css', 'span.-totalPages'],
    storeImageHeader: ['xpath', '//div[contains(@class, "-header-content")][text()="Image"]'],
    storeTitleHeader: ['xpath', '//div[contains(@class, "-header-content")][text()="Title"]'],
    storeAuthorHeader: ['xpath', '//div[contains(@class, "-header-content")][text()="Author"]'],
    storePublisherHeader: ['xpath', '//div[contains(@class, "-header-content")][text()="Publisher"]'],
    storeSearchInput: ['css', 'input#searchBox'],
    storeSearchButton: ['css', 'input#searchBox + div.input-group-append'],

    // book page
    bookISBN: ['css', 'div#ISBN-wrapper label#userName-value'],
    bookTitle: ['css', 'div#title-wrapper label#userName-value'],
    bookSubtitle: ['css', 'div#subtitle-wrapper label#userName-value'],
    bookAuthor: ['css', 'div#author-wrapper label#userName-value'],
    bookPublisher: ['css', 'div#publisher-wrapper label#userName-value'],
    bookTotalPages: ['css', 'div#pages-wrapper label#userName-value'],
    bookDescription: ['css', 'div#description-wrapper label#userName-value'],
    bookBackButton: ['css', 'div.text-left.fullButton button'],
    bookAddButton: ['css', 'div.text-right.fullButton button'],

    // profile page
    profileRow: ['xpath', '//div[@role="rowgroup"]'],
    profileImageHeader: ['xpath', '//div[contains(@class, "-header-content")][text()="Image"]'],
    profileTitleHeader: ['xpath', '//div[contains(@class, "-header-content")][text()="Title"]'],
    profileAuthorHeader: ['xpath', '//div[contains(@class, "-header-content")][text()="Author"]'],
    profilePublisherHeader: ['xpath', '//div[contains(@class, "-header-content")][text()="Publisher"]'],
    profileSearchInput: ['css', 'input#searchBox'],
    profileSearchButton: ['css', 'input#searchBox + div.input-group-append'],
    profileBookLink: ['xpath', '//span[contains(@id, "see-book-")]/a'],
    profileBackButton: ['css', 'button#gotoStore'],
    profileDeleteButton: ['css', 'span#delete-record-undefined'],
    profileDeleteAllButton: ['xpath', '//button[@id="submit"][text()="Delete All Books"]'],
    profileDeleteAccountButton: ['xpath', '//button[@id="submit"][text()="Delete Account"]'],
    profileNextButton: ['css', 'div.-next button'],
    profilePreviousButton: ['css', 'div.-previous button'],
    profilePageDropdown: ['xpath', '//select[@aria-label="rows per page"]'],
    profilePageOptions: ['xpath', '//select[@aria-label="rows per page"]/option'],
    profilePageNumberLabel: ['xpath', '//input[@aria-label="jump to page"]'],
    profilePagesTotal: ['css', 'span.-totalPages'],
    profileModalOkButton: ['css', 'button#closeSmallModal-ok'],
    profileModalCancelButton: ['css', 'button#closeSmallModal-cancel'],
    profileLoggedOutMessage: ['css', 'label#notLoggin-label'],
    profileLoggedOutMessageLinks: ['css', 'label#notLoggin-label a'],

    // all pages
    loggedInUsername: ['css', 'label#userName-value'],
    loggedInLogoutButton: ['xpath', '//button[@id="submit"][text()="Log out"]']
}