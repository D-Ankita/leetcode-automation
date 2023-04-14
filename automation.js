const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
  // Set up Selenium WebDriver and navigate to LeetCode login page
  let driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://leetcode.com/accounts/login/');

  // Log in
  await driver.findElement(By.id('id_login')).sendKeys(process.env.LC_USERNAME);
  await driver.findElement(By.id('id_password')).sendKeys(process.env.LC_PASSWORD, Key.RETURN);

  // Wait for login to complete and click on the fire symbol to navigate to the daily challenge page
  await driver.wait(until.urlIs('https://leetcode.com/'), 10000);
  let fireSymbol = await driver.findElement(By.css('.fa-fire'));
  await fireSymbol.click();

  // Wait for the daily challenge page to load and navigate to Discuss Tab
  await driver.wait(until.urlContains('/problems/'), 10000);
  await driver.findElement(By.css('a[data-tab="discuss"]')).click();

  // Search and select "java" in the tags section on the right
  await driver.wait(until.elementLocated(By.css('input[placeholder="Search discussion"]')), 10000);
  await driver.findElement(By.css('input[placeholder="Search discussion"]')).sendKeys('java', Key.RETURN);

  // Click on the most votes tab to sort the result to get the solution with most votes
  await driver.wait(until.elementLocated(By.css('a[data-value="mostVotes"]')), 10000);
  await driver.findElement(By.css('a[data-value="mostVotes"]')).click();

  // Copy the solution code block
  await driver.wait(until.elementLocated(By.css('div[data-cy="post-content"] pre')), 10000);
  let solutionCodeBlock = await driver.findElement(By.css('div[data-cy="post-content"] pre'));
  let solutionCode = await solutionCodeBlock.getAttribute('textContent');

  // Fill in the code skeleton with the copied solution code
  let codeElement = await driver.findElement(By.css('#ace_snippet_id_1 > textarea'));
  await driver.executeScript(`arguments[0].value = '${solutionCode}'`, codeElement);

  // Submit the solution
  await driver.findElement(By.css('button[data-cy="submit-code-btn"]')).click();

  // Wait for the submission to complete and close the browser
  await driver.wait(until.urlContains('/submissions/'), 10000);
  await driver.quit();
})();
