Feature: Pension Appointment Helping You Plan Section

    Background: User Taken to the homepage and an appointment journey option is chosen
        Given I am on the home page

    Scenario: Complete 'Pension Basics' Journey Under helping your Plan section
        When I select 'Pension basics' with data testId 'task-1' from the list
        Then I should be taken to the page to get pension guidance for 'Pension basics'
        When I click on the continue button on the start journey page for 'Pension basics'
        Then I should be taken to the 'Protecting your pensions' page
        When I click on the continue button on the 'Protecting your pensions' page
        Then I should be taken to the 'Have you kept track of all your pensions?' initial page
        When I select Yes for 'Have you kept track of all your pensions?' question and click continue button
        Then I should be taken to the 'Are you interested in transferring your pension?' page
        When I select Yes for 'Are you interested in transferring your pension?' question and click the continue button
        Then I should be taken back to the homepage with a 'Completed' status for the 'Pension basics'

    Scenario: Complete 'Income and savings' Journey Under helping your Plan section
        When I select 'Income and savings' with data testId 'task-2' from the list
        Then I should be taken to the page to get pension guidance for 'Income and Savings'
        When I click on the continue button on the start journey page for 'Income and Savings'
        Then I should be taken to the 'Have you created a retirement budget?' initial page
        When I select Yes for 'Have you created a retirement budget?' question and click continue button
        Then I should be taken to the 'Do you know how much State Pension you'll get and when?' page
        When I select Yes for 'Do you know how much State Pension you'll get and when?' question and click the continue button
        Then I should be taken to the 'Have you or anyone in your household received state benefits in last 12 months?' page
        When I select Yes for 'Have you or anyone in your household received state benefits in last 12 months?' question and click the continue button
        Then I should be taken back to the homepage with a 'Completed' status for the 'Income and savings'

    Scenario: Complete 'Debts and repayment' Journey Under helping your Plan section
        When I select 'Debts and repayment' with data testId 'task-3' from the list
        Then I should be taken to the page to get pension guidance for 'Debts and repayment'
        When I click on the continue button on the start journey page for 'Debts and repayment'
        Then I should be taken to the 'Are you thinking of using your pension to pay off any debts?' page
        When I select Yes for 'Are you thinking of using your pension to pay off any debts?' question and click the continue button
        Then I should be taken back to the homepage with a 'Completed' status for the 'Debts and repayment'

    Scenario: Complete 'Your home' Journey Under helping your Plan section
        When I select 'Your home' with data testId 'task-4' from the list
        Then I should be taken to the page to get pension guidance for 'Your home'
        When I click on the continue button on the start journey page for 'Your home'
        Then I should be taken to the 'Do you or are you planning to live overseas?' page
        When I select Yes for 'Do you or are you planning to live overseas?' question and click the continue button
        Then I should be taken back to the homepage with a 'Completed' status for the 'Your home'

    Scenario: Complete 'Health and family' Journey Under helping your Plan section
        When I select 'Health and family' with data testId 'task-5' from the list
        Then I should be taken to the page to get pension guidance for 'Health and family'
        When I click on the continue button on the start journey page for 'Health and family'
        Then I should be taken to the 'Have you made a will?' page
        When I select Yes for 'Have you made a will?' question and click the continue button
        Then I should be taken to the 'Have you set up a power of attorney for your money and property?' page
        When I select Yes for 'Have you set up a power of attorney for your money and property?' question and click the continue button
        Then I should be taken back to the homepage with a 'Completed' status for the 'Health and family'
