@login
Feature: Provider Workbench Login

  Users can login and be forwarded to a page based on their role.

  Background:
    Given I am registered
    And I am on the landing page

  Scenario: Provider logs in
    Given I am a provider
    And I have a product
    When I click on the login button
    Then I am on the provider dashboard
    And I can see my product

  Scenario: Qualification reviewer logs in
    Given I am a qualificationReviewer
    When I click on the login button
    Then I am on the qualification review dashboard

  Scenario: Content reviewer logs in
    Given I am a contentReviewer
    When I click on the login button
    Then I am on the content review dashboard

  Scenario: Commerce reviewer logs in
    Given I am a commerceReviewer
    When I click on the login button
    Then I am on the commerce review dashboard

  Scenario: Cmm reviewer logs in
    Given I am a cmmReviewer
    When I click on the login button
    Then I am on the cmm review dashboard
