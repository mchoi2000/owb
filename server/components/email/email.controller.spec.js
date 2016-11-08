//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

/* jshint unused: false */
var moment = require('moment');
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');

var emailData = {
  template: '/inviteUserEmail.html',
  recipient: 'test@test.com',
  from: 'noreplyEmail@us.ibm.com',
  fromname: 'Operator Workbench Team',
  replyto: 'realEmail@us.ibm.com',
  subject: 'Test Subject',
  first: 234,
  last: 123,
  testDate: new Date('1997-08-29T10:14:00'),
  providerName: 'testName'
};

function MockFS(err, fileData) {
  var self = this;

  self.readFile = function(path, enc, callback) {
    path.should.equal(__dirname + '/templates/' + emailData.template);
    enc.should.equal('utf8');
    if (err) {
      return callback(err, null);
    }

    return callback(null, fileData);
  };
}

let mockConfig = {
  sendgridApiKey: 'Test.API.Key'
};

describe('Email Controller', function() {
  it('should send email', function(done) {

    let mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.method.should.equal('POST');
          request.path.should.equal('/v3/mail/send');
          request.body.personalizations[0].tos[0].email.should.equal(emailData.recipient[0]);
          request.body.from.email.should.equal(emailData.from);
          request.body.from.name.should.equal(emailData.fromname);
          request.body.subject.should.equal(emailData.subject);
          request.body.content[0].type.should.equal('text/html');
          request.body.content[0].value.should.equal(emailData.providerName);
          return Promise.resolve({statusCode: 202,
            body: '',
            headers: {}
          });
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;

    var fsMock = new MockFS(null, '{{providerName}}');
    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.statusCode.should.equal(202);
        done();
      });
  });

  it('should send email with attachments', function(done) {

    emailData.files = [
      {
      filename: 'fileName1',
      type: 'text',
      content: Buffer.from('file content for file fileName1')
    },
      {
      filename: 'fileName2',
      type: 'text',
      content: Buffer.from('file content for file fileName2')
    }
    ];

    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.method.should.equal('POST');
          request.path.should.equal('/v3/mail/send');
          request.body.personalizations[0].tos[0].email.should.equal(emailData.recipient[0]);
          request.body.from.email.should.equal(emailData.from);
          request.body.from.name.should.equal(emailData.fromname);
          request.body.subject.should.equal(emailData.subject);
          request.body.content[0].type.should.equal('text/html');
          request.body.content[0].value.should.equal(emailData.providerName);

          request.body.attachments[0].filename.should.equal(emailData.files[0].filename);
          request.body.attachments[0].type.should.equal(emailData.files[0].type);
          request.body.attachments[0].content.should
         .equal(Buffer.from(emailData.files[0].content).toString('base64'));
          request.body.attachments[1].filename.should.equal(emailData.files[1].filename);
          request.body.attachments[1].type.should.equal(emailData.files[1].type);
          request.body.attachments[1].content.should
         .equal(Buffer.from(emailData.files[1].content).toString('base64'));
          return Promise.resolve({statusCode: 202,
            body: '',
            headers: {}
          });
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;

    var fsMock = new MockFS(null, '{{providerName}}');
    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.statusCode.should.equal(202);
        done();
      });
  });

  it('should give file error', function(done) {

    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(new Error('read error'));

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend, fs: fsMock, '../../config/environment': mockConfig
    });

    email.send(emailData)
      .catch(function(err) {
        done();
      });
  });

  it('should give send error', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          return Promise.reject(new Error('send error'));
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{providerName}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .catch(function(err) {
        done();
      });
  });

  it('should compile date', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          let dateString = moment(emailData.testDate).format('dddd, MMMM Do YYYY');
          let modifiedDate = dateString.replace('August 29th 1997', 'August 29<sup>th</sup> 1997');
          request.body.content[0].value.should.equal(modifiedDate);
          return Promise.resolve({message: 'success'});
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{{date testDate}}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.message.should.equal('success');
        done();
      });
  });

  it('should compile bad date', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.body.content[0].value.should.equal('');
          return Promise.resolve({message: 'success'});
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{date undef}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.message.should.equal('success');
        done();
      });
  });

  it('should compile time', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.body.content[0].value.should
         .equal(moment.utc(emailData.testDate).format('hh:mm:ss a'));
          return Promise.resolve({message: 'success'});
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{time testDate}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.message.should.equal('success');
        done();
      });
  });

  it('should compile bad time', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.body.content[0].value.should.equal('');
          return Promise.resolve({message: 'success'});
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{time undef}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.message.should.equal('success');
        done();
      });
  });

  it('should compile if', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.body.content[0].value.should.equal('false');
          return Promise.resolve({message: 'success'});
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{#ifPWB first \'lol\' last}}true{{else}}false{{/ifPWB}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.message.should.equal('success');
        done();
      });
  });

  it('should compile if EITHER', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.body.content[0].value.should.equal('true');
          return Promise.resolve({message: 'success'});
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{#ifPWB first \'EITHER\' last}}true{{else}}false{{/ifPWB}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.message.should.equal('success');
        done();
      });
  });

  it('should compile if 1 undef', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.body.content[0].value.should.equal('true');
          return Promise.resolve({message: 'success'});
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{#ifPWB undef \'EITHER\' last}}true{{else}}false{{/ifPWB}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.message.should.equal('success');
        done();
      });
  });

  it('should compile if 2 undefs', function(done) {
    var mockSend = function(apiKey) {
      apiKey.should.equal(mockConfig.sendgridApiKey);
      return {
        API: function(request) {
          request.body.content[0].value.should.equal('false');
          return Promise.resolve({message: 'success'});
        },
        emptyRequest: () => { return {}; }
      };
    };
    mockSend.mail = require('sendgrid').mail;
    var fsMock = new MockFS(null, '{{#ifPWB undef \'EITHER\' undef}}true{{else}}false{{/ifPWB}}');

    var email = proxyquire('./email.controller', {
      sendgrid: mockSend,
      fs: fsMock,
      '../../config/environment': mockConfig
    });

    email.send(emailData)
      .then(function(data) {
        data.message.should.equal('success');
        done();
      });
  });
});
