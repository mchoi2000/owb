'use strict';

// jshint unused:false
const should = require('should');
const denodeify = require('../../../server/components/utils/index').denodeify;
const RESTRequest = denodeify(require('request'));
const JWTService = require('../../../server/config/auth/jsonWebTokenService');

module.exports = function () {

  this.When(/^I click on the login button$/, function () {
    return this.browser.clickLink('Sign In');
  });

  this.When(/^I input qualification form data$/, function () {
    return this.browser
      .fill('offName', 'Test Offering')
      .fill('desc', 'Test Offering Description')
      .clickLink('Cloud Application (SaaS)')
      .then(() => this.browser.clickLink('Analytics'))
      .then(() => this.browser.clickLink('Analytics - All'))
      .then(() => {
        this.browser.fill('offURL', 'http://ibm.com')
          .choose('#providerTypes-0')
          .choose('#bluemixRadios-0')
          .choose('#billingSystemRadios-1')
          .choose('#onboardingRadios-0')
          .choose('#pidRadios-0')
          .fill('dateGA', '01/01/2016')
          .fill('dateLive', '02/25/2050')
          .clickLink('Offering manager');
      })
      .then(() => {
        this.browser.fill('#MMFN_input', 'Otok')
          .fill('#MMLN_input', 'Barleyfoot')
          .fill('#MMEmail_input', 'magictavern@puppies.supplies');
      });
  });

  this.When(/^I input cognitive qualification form data$/, function() {
    return this.browser.clickLink('Cognitive Application')
      .then(() => {
        return this.browser.choose('#providerTypes-0')
          .fill('offName', 'Test Qualification')
          .fill('dateLive', '02/25/2050')
          .fill('#OCFN_input', 'Otok')
          .fill('#OCLN_input', 'Barleyfoot')
          .fill('#OCEmail_input', 'magictavern@puppies.supplies');
      });
  });

  this.When(/^I press submit qualification$/, function () {
    return this.browser.pressButton('#submitQualification');
  });

  this.When(/^I approve the qualification for Provider Workbench$/, function () {
    return this.browser.pressButton('#approve1')
      .then(() => {
        return this.browser.fill('comments', 'You Approve')
          .choose('#approval_choice-0')
          .pressButton('Approve and Send');
      });
  });

  this.When(/^I approve the qualification$/, function () {
    return this.browser.pressButton('#approve1')
      .then(() => {
        return this.browser.fill('comments', 'You Approve')
          .choose('#approval_choice-1')
          .pressButton('Approve and Send');
      });
  });

  this.When(/^I return the qualification$/, function () {
    return this.browser.pressButton('Return Offering')
      .then(() => {
        return this.browser.fill('comments', 'You Return')
          .pressButton('Return and Send');
      });
  });

  this.When(/^I input content form data$/, {timeout: 120 * 1000}, function () {
    return this.browser.fill('metawords', 'Meta Keywords')
      .select('#idealIndustry', 'Automotive')
      .select('idealRole', 'Analytics')
      .clickLink('#taxonomy_option_0')
            .then(() => {
        return this.browser.select('category', 'Cognitive')
            .select('topic', 'Customer journeys')
            .check('#deployment_0')
            .clickLink('#serviceType_option_0');
        })
      .then(() => {
        return this.browser.fill('natName', 'Natural Language Name')
        .fill('offeringHeadline', 'Offering headline')
        .fill('desc', 'Meta Description')
        .attach('offeringImage', './test/testImage.png')
        .fill('#benefit_0', 'Benefit Headline')
        .fill('#benefit_description_0', 'Benefit Description')
        .clickLink('#benefit_type_0_option_0');
      })
      .then(() => {
        return this.browser.fill('#benefit_1', 'Benefit Headline')
          .fill('#benefit_description_1', 'Benefit Description')
          .clickLink('#benefit_type_1_option_1');
      })
      .then(() => {
        return this.browser.fill('#benefit_2', 'Benefit Headline')
          .fill('#benefit_description_2', 'Benefit Description')
          .clickLink('#benefit_type_2_option_2');
      })
      .then(() => {
        return this.browser.fill('#name_feature_0', 'Feature Name 1')
          .fill('#feature_description_0', 'Feature Description 1')
          .choose('#feature_0_media_type_0')
          .fill('#feature_0_video_url', 'http://featureVideo1.com')
          .attach('#featureThumbnailImg_0', './test/testImage.png')
          .fill('#name_feature_1', 'Feature Name 2')
          .fill('#feature_description_1', 'Feature Description 2')
          .choose('#feature_1_media_type_0')
          .fill('#feature_1_video_url', 'http://featureVideo2.com')
          .attach('#featureThumbnailImg_1', './test/testImage.png')
          .fill('#testimonial_customer_quote_0', 'Customer Quote 1')
          .fill('#testimonial_customer_role_0', 'Customer Role 1')
          .fill('#testimonial_customer_company_0', 'Customer Company 1')
          .clickLink('#community_resource_type_0_option_1');
      })
       .then(() => {
        return this.browser.fill('#community_resource_link_0', 'http://communityResource1.com')
          .clickLink('#community_resource_type_1_option_1');
      })
      .then(() => {
        return this.browser.fill('#community_resource_link_1', 'http://communityResource2.com')
          .fill('#intro_sentences', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
            'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim' +
            'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo' +
            'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
            'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,' +
            'sunt in culpa qui officia deserunt mollit anim id est laborum')
          .choose('#heroMediaType_0')
          .fill('#hero_video_url', 'http://heroVideo.com')
          .fill('#case_study_name_0', 'Case Study Name 1')
          .fill('#case_study_description_0', 'Case Study Description 1')
          .clickLink('#case_study_0_type_option_0');
      })
      .then(() => {
        return this.browser.fill('#case_study_0_url', 'http://caseStudy1Video.com')
          .fill('#customer_quote_0', 'Customer Quote')
          .fill('#customer_role_0', 'Customer Role')
          .fill('#customer_company_0', 'Customer Company')
          .fill('#use_case_headline_0', 'Use Case Headline 1')
          .fill('#problem_description_0', 'Problem Description 1')
          .fill('#solution_description_0', 'Solution Description 1')
          .choose('#useCase_0_media_type_0')
          .fill('#use_case_0_video_url', 'http://useCase1Video.com')
          .fill('#use_case_headline_1', 'Use Case Headline 2')
          .fill('#problem_description_1', 'Problem Description 2')
          .fill('#solution_description_1', 'Solution Description 2')
          .choose('#useCase_1_media_type_0')
          .fill('#use_case_1_video_url', 'http://useCase2Video.com')
          .fill('#name_capability_0', 'Capability Name 1')
          .fill('#capability_description_0', 'Capability Description 1')
          .choose('#capability_0_media_type_0')
          .fill('#capability_0_video_url', 'http://capabilityVideo1.com')
          .fill('#tech_spec_bullet_0', 'Technical Specification Bullet 1')
          .fill('#tech_spec_paragraph_0', 'Technical Specification Paragraph 1')
          .fill('#soft_bullet_0', 'Software Requirement Bullet 1')
          .fill('#soft_spec_paragraph_0', 'Software Requirement Paragraph 1')
          .fill('#hard_bullet_0', 'Harware Requirement Bullet 1')
          .fill('#hard_spec_paragraph_0', 'Hardware Requirement Paragraph 1')
          .fill('#recOffering0_seachTerm', 'Watson')
          .wait({element: 'ul>li>a[name="recommendedOfferings_option"]'});
      })
      .then(() => {
        return this.browser.clickLink('ul#recOffering0_list a[id="0"]');
      })
      .then(() => {
        return this.browser.fill('#recOffering1_seachTerm', 'IBM')
        .wait({element: 'ul>li>a[name="recommendedOfferings_option"]'});
      })
      .then(() => {
        return this.browser.clickLink('ul#recOffering1_list a[id="0"]');
      })
      .then(() => {
        this.browser.fill('#resource_name_0', 'Resource Name 1')
          .fill('#resource_description_0', 'Resource Description 1')
          .clickLink('#resource_type_0_option_0');
      })
      .then(() => {
        return this.browser.fill('#resource_link_0', 'http://resourceLink1.com')
          .fill('#resource_name_1', 'Resource Name 2')
          .fill('#resource_description_1', 'Resource Description 2')
          .clickLink('#resource_type_1_option_0');
      })
      .then(() => {
        return this.browser.fill('#resource_link_1', 'http://resourceLink2.com')
          .fill('#resource_name_2', 'Resource Name 3')
          .fill('#resource_description_2', 'Resource Description 3')
          .clickLink('#resource_type_2_option_0');
      })
      .then(() => {
        return this.browser.fill('#resource_link_2', 'http://resourceLink3.com')
          .clickLink('#faqType0_option_0');
      })
      .then(() => {
        return this.browser.fill('#faq_question_0', 'Question 1')
          .fill('#faq_answer_0', 'Answer 1')
          .fill('#faq_link_0', 'http://faqLink.com')
          .clickLink('#faqType1_option_0');
      })
      .then(() => {
        return this.browser.fill('#faq_question_1', 'Question 1')
          .fill('#faq_answer_1', 'Answer 1')
          .fill('#faq_link_1', 'http://faqLink.com')
          .fill('#support_chat_link', 'http://support.com')
          .fill('#searchable_knowledge_base_link', 'http://search.com')
          .fill('#support_phone_num', '555-555-5555')
          .choose('#publishOption_0');
      });
  });

  this.When(/^I input cognitive content form data$/, function() {
    return this.browser.fill('companyName', 'Company Name')
      .clickLink('#companyHQ_option_0')
      .then(() => {
        return this.browser.attach('logo', './test/testImage.png')
          .clickLink('Analytics');
      })
      .then(() => this.browser.clickLink('Analytics - All'))
      .then(() => {
        return this.browser.fill('natName', 'natural language name')
          .fill('shortDesc', 'short description')
          .fill('longDesc', 'long description')
          .fill('webURL', 'http://google.com')
          .fill('metaKeys', 'Meta Keywords')
          .fill('metaDesc', 'Meta Description')
          .check('#targetAud_0')
          .select('industry', 'Automotive')
          .select('idealRole', 'Analytics')
          .select('taxonomy', 'Cloud')
          .select('topics', 'Personalization')
          .check('#deviceType_0')
          .choose('#paymentType_0')
          .select('apiUsed', 'Dialog');
      });
  });

  this.When(/^I press save content$/, {timeout: 110 * 1000}, function () {
    return this.browser.pressButton('#saveBtn');
  });

  this.When(/^I press submit content$/, {timeout: 90 * 1000}, function () {
    return this.browser.pressButton('#submitBtn');
  });

  this.When(/^I press publish cognitive content$/, {timeout: 90 * 1000}, function() {
    return this.browser.pressButton('#submitBtn')
      .then(() => this.browser.pressButton('#submitBtn'))
      .then(() => this.browser.pressButton('#confirmCogPublish'));
  });

  this.When(/^I click approve content$/, function() {
    return this.browser.pressButton('#approve1')
      .then(() => this.browser.pressButton('Yes, Approve'));
  });

  this.When(/^I click return content$/, function() {
    return this.browser.pressButton('#return1')
      .then(() => this.browser.fill('#desc_comments', 'You are returned')
        .pressButton('Return and Send'));
  });

  this.When(/^I input commerce form data$/, function() {
    return this.browser.fill('#plan_name_input_0', 'Edition Name')
      .fill('#desc_textarea_0', 'Edition Description')
      .fill('#plan_1_detail_input_1', 'Detail 1')
      .fill('#plan_1_detail_input_2', 'Detail 2')
      .fill('#plan_1_detail_input_3', 'Detail 3')
      .clickLink('#planType0_option_2')
      .then(() => {
        return this.browser.choose('#plan_0_customer_configure_radios-0');
      });
  });

  this.When(/^I press save commerce$/, function() {
    return this.browser.pressButton('#save');
  });

  this.When(/^I press submit commerce$/, function() {
    return this.browser.pressButton('#submit')
      .then(() => this.browser.pressButton('#approve2'));
  });

  this.When(/^I return to the first tab$/, function() {
    this.browser.tabs.current = 0;
    this.browser._eventLoop.setActiveWindow(this.browser.tabs.current);
  });

  this.When(/^I click approve commerce$/, function(cb) {
    this.browser.pressButton('#approve1')
      .then(() => this.browser.pressButton('Yes, approve'))
      .then(() => {
        cb();
      });
  });

  this.When(/^I click mark complete commerce$/, function(cb) {
    this.browser.pressButton('Mark as complete')
      .then(() => this.browser.pressButton('Yes, mark as complete'))
      .then(() => {
        cb();
      });
  });

  this.When(/^I click return commerce$/, function() {
    return this.browser.pressButton('#return1')
      .then(() => this.browser.fill('#desc_comments', 'I return you').pressButton('#return2'));
  });

  this.When(/^I fill out integration form$/, function() {
    this.browser.fill('#offering_controller_url', 'https://endpoint.com')
      .fill('#offering_controller_username', 'username')
      .fill('#offering_controller_password', 'password')
      .choose('#user_mgmt-1')
      .fill('#op_team_email', 'test@email.com');
  });

  this.When(/^I click the save integration button$/, function() {
    return this.browser.pressButton('#end_page_save_close');
  });

  this.When(/^I click the test button$/, function() {
    return this.browser.pressButton('Run All Tests');
  });

  this.When(/^I click mark complete$/, function() {
    return this.browser.pressButton('Mark As Complete');
  });

  this.When(/^I click on team settings$/, function() {
    return this.browser.pressButton('Manage Team');
  });

  this.When(/^I invite a registered provider$/, function() {
    return this.browser.fill('invitees_0', this.otherUser.email + ',')
      .pressButton('Send');
  });

  this.When(/^I invite a unregistered provider$/, function() {
    return this.browser.fill('invitees_0', this.unregistered + ',')
      .pressButton('Send');
  });

  this.When(/^I remove an editor$/, function() {
    return this.browser.pressButton('Remove')
      .then(() => this.browser.pressButton('Save Changes'));
  });

  this.When(/^I remove an invited provider$/, function() {
    return this.browser.pressButton('Remove')
      .then(() => this.browser.pressButton('Save Changes'));
  });

  this.When(/^I make an editor an owner$/, function() {
    return this.browser.pressButton('Make Owner')
      .then(() => this.browser.pressButton('Yes, I\'m Sure'))
      .then(() => this.browser.pressButton('Save Changes'));
  });

  this.When(/^I input services form data$/, function() {
    return this.browser.fill('#serviceName', 'BehaviorTest')
      .fill('#roles', 'test')
      .fill('#description', 'test')
      .pressButton('#createService')
      .then(() => {
        return this.browser.clickLink('#service_name_0');
      })
      .then(() => {
        return this.browser.on('alert', function(message) {
          should.exist(message);
        });
      });
  });

  this.Then(/^I create my JWT Token$/, function() {
    this.secretJWTToken = JWTService.constructJWT({
      _id: 'BehaviorTest',
      roles: 'test',
      description: 'test'
    });
    should.exist(this.secretJWTToken);
  });

  this.Then(/^I verify that my JWT Token works$/, function() {
    return RESTRequest({
      url: this.locationBase + 'api/build/start',
      method: 'POST',
      rejectUnauthorized: false,
      body: JSON.stringify({
        build: 'draft'
      }),
      headers: {
        Authorization: 'JWT ' + this.secretJWTToken,
        'Content-Type': 'application/json'
      }
    }).then(function resolve(response) {
      response.body.should.be.exactly('[]');
    }).catch(function reject(err) {
      should.not.exist(err);
    });
  });
};
