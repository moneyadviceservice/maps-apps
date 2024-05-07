Feature: Pension Appointment Pension Options Section

    Scenario: Complete 'Retire later or delay taking your pension' Journey Under Your pension options section
        Given I am on the home page with completed Helping You Plan
        When I select 'Retire later or delay taking your pension' with data testId 'task-6' from the list
        Then I should be taken to the page to get pension guidance for 'Retire later or delay taking your pension'
        When I select 'No' for 'Does this option interest you?' question and click on the continue button on the start journey page for 'Retire later or delay taking your pension'
        Then I should be taken back to the homepage with a Completed status for the section with 'task-6' on the Your pension options section

    Scenario: Complete 'Get a guaranteed income' Journey Under Your pension options section
        Given I am on the home page with completed Helping You Plan
        When I select 'Get a guaranteed income' with data testId 'task-7' from the list
        Then I should be taken to the page to get pension guidance for 'Get a guaranteed income'
        When I select 'Yes' for 'Does this option interest you?' question and click on the continue button on the start journey page for 'Get a guaranteed income'
        Then I should be taken back to the homepage with a Completed status for the section with 'task-7' on the Your pension options section

    Scenario: Complete 'Get a flexible income' Journey Under Your pension options section
        Given I am on the home page with completed Helping You Plan
        When I select 'Get a flexible income' with data testId 'task-8' from the list
        Then I should be taken to the page to get pension guidance for 'Get a flexible income'
        When I select 'Yes' for 'Does this option interest you?' question and click on the continue button on the start journey page for 'Get a flexible income'
        Then I should be taken back to the homepage with a Completed status for the section with 'task-8' on the Your pension options section

    Scenario: Complete 'Take your pension as a number of lump sums' Journey Under Your pension options section
        Given I am on the home page with completed Helping You Plan
        When I select 'Take your pension as a number of lump sums' with data testId 'task-9' from the list
        Then I should be taken to the page to get pension guidance for 'Take your pension as a number of lump sums'
        When I select 'Yes' for 'Does this option interest you?' question and click on the continue button on the start journey page for 'Take your pension as a number of lump sums'
        Then I should be taken back to the homepage with a Completed status for the section with 'task-9' on the Your pension options section

    Scenario: Complete 'Take your pot in one go' Journey Under Your pension options section
        Given I am on the home page with completed Helping You Plan
        When I select 'Take your pot in one go' with data testId 'task-10' from the list
        Then I should be taken to the page to get pension guidance for 'Take your pot in one go'
        When I select 'Yes' for 'Does this option interest you?' question and click on the continue button on the start journey page for 'Take your pot in one go'
        Then I should be taken back to the homepage with a Completed status for the section with 'task-10' on the Your pension options section

    Scenario: Complete 'Mix your options' Journey Under Your pension options section
        Given I am on the home page with completed Helping You Plan
        When I select 'Mix your options' with data testId 'task-11' from the list
        Then I should be taken to the page to get pension guidance for 'Mix your options'
        When I select 'Yes' for 'Does this option interest you?' question and click on the continue button on the start journey page for 'Mix your options'
        Then I should be taken back to the homepage with a Completed status for the section with 'task-11' on the Your pension options section

    Scenario: Complete 'Your appointment summary' section
        Given I am on the home page with pension options completed
        When I select 'View your summary document and to-do list' with data testId 'task-12' from the list
        Then I should be taken to the page to view the completed appointment journeys summary
        When I click on the back button to return to the homepage to view completed appointment summary section
        Then I should be taken back to the homepage with a Completed status for the section with 'task-12' on the Your appointment summary

    Scenario: Complete Save and Come Back Later Feature
        Given I am on the home page with completed Helping You Plan
        When I click on the 'Save and come back later' button on the homepage
        Then I should be taken to the 'Save and come back later' page
        When I enter a valid email address in the email address field on the save and come back later form
        Then I should be sent an email to come back later to complete journey

    Scenario: Generate a summary Feature
        Given I am on the home page with pension options completed
        When I select 'View your summary document and to-do list' with data testId 'task-12' from the list
        Then I should be able to generate appointment summary