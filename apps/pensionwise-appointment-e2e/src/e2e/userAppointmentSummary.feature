Feature: View summary of the selected options

  # START of Default retirement planning cards
  Scenario: Default retirement planning cards
    Given I am on the home page with no options selected
    When I select 'View your summary document and to-do list' with data testId 'task-12' from the list
    Then I should be taken to the page to view the completed appointment journeys summary
    When I scroll to the Start your retirement planning section on the summary page
    Then I should see the three default retirement planning cards
# END of Default retirement planning cards

  # START of Scenario: All cards - Benefits received
  Scenario: All cards - Benefits received
    Given I am on the home page with all pension options and helping you plan selected - Benefits received
    When I select 'View your summary document and to-do list' with data testId 'task-12' from the list
    Then I should be taken to the page to view the completed appointment journeys summary
    When I scroll to the Start your retirement planning section on the summary page
    Then I should see all 6 pension option cards and 12 retirement planning cards: Generate a summary, Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Use our benefits calculator, Get free debt advice, Get your pension abroad, Make a will and Set up a power of attorney
# END of Scenario: All cards - Benefits received

  # START of Scenario: All cards - Benefits unknown
  Scenario: All cards - Benefits unknown
    Given I am on the home page with all pension options and helping you plan selected - Benefits unknown
    When I select 'View your summary document and to-do list' with data testId 'task-12' from the list
    Then I should be taken to the page to view the completed appointment journeys summary
    When I scroll to the Start your retirement planning section on the summary page
    Then I should see all 6 pension option cards and 12 retirement planning cards: Generate a summary, Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Talk to your benefits provider, Get free debt advice, Get your pension abroad, Make a will and Set up a power of attorney
# END of Scenario: All cards - Benefits unknown

  # START of Scenario: No pension options and 8 retirement planning cards
  Scenario: No pension options and 8 retirement planning cards
    Given I am on the home page with no pension options and 8 retirement planning cards
    When I select 'View your summary document and to-do list' with data testId 'task-12' from the list
    Then I should be taken to the page to view the completed appointment journeys summary
    When I scroll to the Start your retirement planning section on the summary page
    Then I should only see these 8 retirement planning cards: Generate a summary, Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast and Talk to your benefits provider
# END of Scenario: No pension options and 8 retirement planning cards

  # START of Scenario: No pension options and 9 retirement planning cards
  Scenario: No pension options and 9 retirement planning cards
    Given I am on the home page with no pension options and 9 retirement planning cards
    When I select 'View your summary document and to-do list' with data testId 'task-12' from the list
    Then I should be taken to the page to view the completed appointment journeys summary
    When I scroll to the Start your retirement planning section on the summary page
    Then I should see these 9 retirement planning cards: Generate a summary, Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Talk to your benefits provider and Make a will
# END of Scenario: No pension options and 9 retirement planning cards
