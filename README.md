# webdriverjs_book_store_tests

Well, these are some tests written in Node.js using Selenium Webdriver for Javascript.
All tests work with "Book Store" demo site at https://demoqa.com/

Requirements:
- Node.js
  - selenium-webdriver module
  - chai module
  - chai-as-promised module
  - chromedriver module
  - faker module
  - mocha module
- Google Chrome browser
- chromedriver executable in PATH

!Issues:
- For some reason unbeknownst to me, some tests fail when all test files executed in batch (i.e. via 'mocha test'). Running them separately one by one allows to avoid this.
