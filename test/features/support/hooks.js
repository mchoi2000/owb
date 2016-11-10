'use strict';

var myHooks = function () {
  this.Before(function() {
    this.testUser = {
      _id: 'testUserId',
      fname: 'Bungaree',
      lname: 'Chubbins',
      email: 'testUser@test.com',
      roles: [
        'operator'
      ],
      info: {}
    };
  });

  this.After(function() {
    this.browser.destroy();

    let promises = [];
    promises.push(clearDB(this.usersDB));

    return Promise.all(promises);
  });
};

function clearDB(database) {
  return database.allDocs()
    .then(results => {
      let docs = results.rows
        .filter(row => !row.id.startsWith('_design/'))
        .map(row => ({_id: row.id, _rev: row.value.rev, _deleted: true}));

      return database.bulkDocs(docs);
    });
}

module.exports = myHooks;
