'use strict';

const expect = require('chai').expect;
const Room = require('../room');

describe('collab_server.room', function () {

  describe('room#push', function () {
    it('should has a item in list', function *() {
      const room = yield Room.get(123);

      yield room.push('client 1');

      const clients = yield room.getClients();

      expect(clients).to.have.length(1);
    });
  });

  describe('room#remove', function () {
    it('should has nothing in list', function *() {
      const room = yield Room.get(1234);
      yield room.push('client 2');
      yield room.remove('client 2');

      const clients = yield room.getClients();

      expect(clients).to.have.length(0);
    });
  });
});
