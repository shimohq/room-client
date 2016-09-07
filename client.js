'use strict';

const _ = require('lodash');

const stores = {
  memory: require('./storages/memory'),
  redis: require('./storages/redis')
};

const Room = require('./room');

class Client {
  constructor(id) {
    this.store = Client.store;
    this.id = id;
  }

  static init(option) {
    if (!stores[option.store]) {
      throw new Error(`no such store: ${option.store}`);
    }

    Client.send = option.send;
    Client.store = new (stores[option.store].Client);
  }

  static new(id, data) {
    const instance = new Client(id);
    return Client.store.set(id, data).then(() => instance);
  }

  static getOrNew(id, data) {
    return Client.get(id).then(client => {
      if (client) {
        return client.update(data).then(() => client);
      }

      return Client.new(id, data);
    });
  }

  static get(id) {
    return Client.store.get(id).then(data => data ? this.new(id, data) : null);
  }

  get() {
    return this.store.get(this.id);
  }

  update(data) {
    return this.store.get(this.id)
      .then(origin => this.store.set(this.id, _.assign(origin, data)));
  }

  join(roomId) {
    return this.get().then(data => {
      if (data.roomId) {
        throw new Error(`client ${this.id} already in a room ${roomId}`);
      }

      return this.update({ roomId }).then(() => {
        return Room.get(roomId).then(room => room.push(this.id));
      });
    });
  }

  getRoom() {
    return this.get().then(data => {
      if (data.roomId) {
        return Room.get(data.roomId);
      }

      return null;
    });
  }

  inRoom(roomId) {
    return this.get().then(data => data.roomId === roomId);
  }

  leave() {
    return this.get().then(data => {
      if (data.roomId) {
        return Promise.all([
          this.update({ roomId: null }),
          Room.get(data.roomId).then(room => room.remove(this.id))
        ]);
      }

      throw new Error('client is not in room:' + this.id);
    });
  }

  destroy() {
    return this.leave().then(() => this.store.remove(this.id));
  }

  send(message) {
    if (!Client.send) {
      throw new Error('Client send message method not set');
    }

    return Client.send(this, message);
  }
}

Client.store = new (stores.memory.Client);

module.exports = Client;
