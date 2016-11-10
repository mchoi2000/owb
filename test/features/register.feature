@register
Feature: Operator Workbench Login

  Users can register and be forwarded to the cmm review page.

  Scenario: CMM reviewer goes to Register page
    Given I am not registered
    When I visit the registration page
    And I fill the registration form
    And I click on join now button
    Then I am registered
    And I am on the cmm dashboard
