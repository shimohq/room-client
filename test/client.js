'use strict';

const expect = require('chai').expect;
const Client = require('../client');
const Room = require('../room');

describe('collab_server.client', function () {

  beforeEach(function *() {
    Client.store.data = {};
    Room.store.data = {};
  });

  describe('#update', function () {
    it('should update well', function *() {
      const client = yield Client.new(1, { rev: 1 });
      yield client.update({ rev: 2 });

      const data = yield client.get();
      expect(data.rev).to.eql(2);
    });
  });

  describe('#join', function () {
    it('join room successfully', function *() {
      const client = yield Client.getOrNew(1, { rev: 333 });

      yield client.join('room:1');

      const room = yield Room.get('room:1');
      const clients = yield room.getClients();

      expect(clients).to.have.length(1);
      expect(clients[0].id).to.eql(1);

      const data = yield client.get();

      expect(data.rev).to.eql(333);
    });
  });

  describe('#inRoom', function () {
    it('should have property roomId in store', function *() {
      const client = yield Client.getOrNew(34, { rev: 333 });

      yield client.join('room:2');

      const data = yield client.get();
      expect(data).to.have.property('roomId', 'room:2');
    });
  });

  describe('#leave', function () {
    it('should have no property roomId', function *() {
      const client = yield Client.getOrNew(340, { rev: 333 });
      yield client.join('room:3');

      yield client.leave();

      const data = yield client.get();

      expect(!data.roomId).to.eql(true);

      const room = yield Room.get('room:3');
      const clients = yield room.getClients();

      expect(clients).to.have.length(0);
    });
  });

  describe('#destroy', function () {
    it('should destroy successfully', function *() {
      const client = yield Client.getOrNew(123123, { rev: 23423 });
      yield client.join('room:4');
      yield client.destroy();

      expect(Object.keys(Client.store.data)).to.have.length(0);
      const room = yield Room.get('room:4');
      const clients = yield room.getClients();

      expect(clients).to.have.length(0);
    });
  });
});
