'use strict';

const Promise = require('bluebird');

class Client {
  constructor() {
    this.data = {};
  }

  get(id) {
    return Promise.resolve(this.data[id]);
  }

  set(id, value) {
    this.data[id] = value;
    return Promise.resolve(true);
  }

  remove(id) {
    delete this.data[id];
    return Promise.resolve(true);
  }
}

class Room {
  constructor() {
    this.data = {};
  }

  get(id) {
    return Promise.resolve(this.data[id] || []);
  }

  push(id, clientId) {
    const curr = this.data[id] = this.data[id] || [];
    const index = curr.indexOf(clientId);

    if (index > -1) {
      throw new Error('client already in room:' + id);
    }

    curr.push(clientId);
    return Promise.resolve(curr);
  }

  remove(id, clientId) {
    const curr = this.data[id] || [];
    const index = curr.indexOf(clientId);
    if (index === -1) {
      throw new Error('no such clientId ' + clientId);
    }

    curr.splice(index, 1);
    return Promise.resolve(curr);
  }

  getList(id) {
    return Promise.resolve(this.data[id] || []);
  }
}

module.exports = { Client, Room };
