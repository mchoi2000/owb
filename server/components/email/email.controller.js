//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const config = require('../../config/environment');
const fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');
const logger = require('../../components/logger').get('access');
const denodeify = require('../../components/utils').denodeify;
//const sendgrid = require('sendgrid').SendGrid(config.sendgridApiKey);
var sendgrid = require('sendgrid')(config.sendgridApiKey);
const mailHelper = require('sendgrid').mail;

handlebars.registerHelper('ifPWB',
  function registerHelperCallback(parameter1, operation, parameter2, result) {
    switch (operation) {
      case 'EITHER':
        return (!(parameter1 === undefined || parameter1 === '')) ||
        (!(parameter2 === undefined || parameter2 === '')) ?
          result.fn(this) : result.inverse(this);
      default:
        return result.inverse(this);
    }
  }
);

handlebars.registerHelper('time', function timeHelper(date) {
  let timeString = '';
  if (date !== undefined && date !== '') {
    timeString = moment.utc(date).format('hh:mm:ss a');
  }
  return timeString;
});

handlebars.registerHelper('date', function dateHelper(date) {
  let dateString = '';
  if (date !== undefined && date !== '') {
    dateString = moment.utc(date).format('dddd, MMMM Do YYYY');
    let regEx = /[0-9](st|nd|rd|th)/;                             //Match a digit followed by 'st', 'nd', 'rd', 'th'
    let regExMatch = dateString.match(/[0-9](st|nd|rd|th)/);      //dateString = 'March 22nd 2016'
    let digit = regExMatch[0].charAt(0);                          //regExMatch[0] = '2nd'
    let ordinal = '<sup>' + regExMatch[1] + '</sup>';             //regExMatch[1] = 'nd'
    dateString = dateString.replace(regEx, digit + ordinal)       //Finally replace 2nd with 2<sup>nd</sup>
  }
  return dateString;
});

module.exports.send = sendEmail;
function sendEmail(emailData) {
  return denodeify(fs.readFile)(__dirname + '/templates/' + emailData.template, 'utf8')
  .then(function compileSend(emailTemplate) {
    let email = new mailHelper.Mail();
    email.setFrom(new mailHelper.Email(emailData.from, emailData.fromname));
    email.setSubject(emailData.subject);

    if (emailData.recipient.constructor !== Array) {
      emailData.recipient = [emailData.recipient];
    }
    let personalization = new mailHelper.Personalization();
    emailData.recipient.forEach(function (to) {
      personalization.addTo(new mailHelper.Email(to));
    });
    email.addPersonalization(personalization);

    let emptyTemplate = handlebars.compile(emailTemplate);
    email.addContent(new mailHelper.Content('text/html', emptyTemplate(emailData)));

    if (emailData.files) {
      emailData.files.forEach(function (file) {
        let attachment = new mailHelper.Attachment();
        // NOTE: Content must be Base64 encoded
        attachment.setContent(file.content.toString('base64'));
        attachment.setType(file.type);
        attachment.setFilename(file.filename);
        email.addAttachment(attachment);
      });
    }

    let request = sendgrid.emptyRequest();

    request.test = config.sendgridTest;
    request.port = config.sendgridPort;
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = email.toJSON();
    return sendgrid.API(request);
  })
  .then(function resolveSend(response) {
    logger.info('Sent email %s to %s', emailData.template, emailData.recipient);
    return response;
  })
  .catch(function logError(reason) {
    logger.warn('Error sending email %s to %s', emailData.template, emailData.recipient);
    logger.error(reason.stack);
    throw reason;
  });
}
