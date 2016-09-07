'use strict';

const Promise = require('bluebird');

const stores = {
  memory: require('./storages/memory'),
  redis: require('./storages/redis')
};

class Room {
  constructor(id) {
    this.store = Room.store;
    this.id = id;
  }

  static get(id) {
    return Promise.resolve(new Room(id));
  }

  push(clientId) {
    return this.store.push(this.id, clientId);
  }

  remove(clientId) {
    return this.store.remove(this.id, clientId);
  }

  getClients() {
    // TODO: resolve circular require
    const Client = require('./client');
    return this.store.getList(this.id)
      .then(clientIdArray => Promise.all(clientIdArray.map(clientId => Client.getOrNew(clientId))));
  }

  static init(option) {
    if (!stores[option.store]) {
      throw new Error(`no such store: ${option.store}`);
    }

    Room.send = option.send;
    Room.store = new (stores[option.store].Room);
  }

  broadcast(message) {
    return this.getClients().then(clients => {
      return Promise.all(clients.map(client => client.send(message)));
    });
  }
}

Room.store = new (stores.memory.Room);

module.exports = Room;
