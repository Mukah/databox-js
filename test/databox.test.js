var path = require('path'),
  assert = require('assert'),
  util = require('util'),
  Databox = require(path.join('../lib/', 'databox.js'));

describe('Databox', function () {

  describe('Setup', function () {
    it('Should set push_token', function () {
      var push_token = 123;
      var d = new Databox({
        'push_token': push_token
      });

      assert.equal(d.push_token, push_token);
    });

    it('Should cry if no \'push_token\'', function () {
      assert.throws(function () {
        new Databox();
      }, Error);

      assert.throws(function () {
        new Databox({});
      }, Error);
    });
  });

  describe('Config', function () {
    var databox, config;
    beforeEach(function () {
      databox = new Databox({
        'push_token': "some_token"
      });
      config = databox.config;
    });

    it('Should have valid user_agent', function () {
      assert(config.user_agent.match(/^databox\-js\/\d+\.\d+\.\d+/i) !== null);
    });

    it('Should have push_host', function () {
      assert(config.push_host.match(/databox/) !== null);
    });

    it('Should have valid accept', function () {
      assert(config.accept.match(/^application\/vnd\.databox\.v\d\+json/) !== null);
    });
  });

  describe('Pushing', function () {
    var databox;
    before(function () {
      databox = new Databox({
        'push_token': 'token'
      });
    });

    it('Should push KPI w/ #push', function (done) {
      var key = 'me.key';
      var value = 299;

      Databox.prototype._pushJSONRequest = function (options, data, cb) {
        var i_value = data[0][util.format('$%s', key)];
        assert.equal(i_value, value);
        done();
      };

      databox.push({
        key: key,
        value: value
      });
    });

    it('Should push KPI w/ #push and additional attributes', function (done) {
      var key = 'test';
      var value = 300;

      Databox.prototype._pushJSONRequest = function (options, data, cb) {
        var i_value = data[0][util.format('$%s', key)];
        assert.equal(i_value, value);
        assert.equal(data[0].me, 'Oto');
        done();
      };

      databox.push({
        key: key,
        value: value,
        attributes: {
          'me': 'Oto'
        }
      });

    });

    it('Should push KPI w/ #push & callback', function (done) {
      var key = 'me.key';
      var value = 299;

      Databox.prototype._pushJSONRequest = function (options, data, cb) {
        cb([{status: 'ok'}]);
      };

      databox.push({
        key: key,
        value: value
      }, function (data) {
        assert(data !== null);
        done();
      });
    });

    it('Should push KPIs w/ #insertAll', function (done) {
      var key = 'me.key';
      var value = 299;

      Databox.prototype._pushJSONRequest = function (options, data, cb) {
        var i_value = data[0][util.format('$%s', key)];
        assert.equal(i_value, value);
        assert(data.length, 2);
        done();
      };

      databox.insertAll([
        {
          key: key,
          value: value
        }, {
          key: key,
          value: value,
          date: '2015-01-01 12:00:00'
        }
      ]);
    });
  });
});
