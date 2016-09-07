# room-client
room &amp; client class stored by redis or memory

### API
(All methods return Promise)

##### Client

```javascript
// set store (default is memory)
Client.init({ store: 'redis', send: function () { console.log('send') });

// create instance
const client = yield Client.new(id, { data });

// get instance data stored
const data = yield client.get();

// get or create instance, if get, update current instance data
const client = yield Client.getOrNew(id, { data });

// get
const client = yield Client.get(id);

// update, use Object.assign
yield client.update({ data });

// join room
yield client.join(roomId);

// get current room instance
yield client.getRoom();

// is in some room
yield client.inRoom(roomId);

// leave current room
yield client.leave();

// leanve room and delete data in store
yield client.destroy()

// send message, (must set Client.send method)
yield client.send({ message: 'ok' });
```

##### Room

```javascript
// get or create a new room
const room = yield Room.get(roomId);

// add a new client
yield room.push(clientId);

// remove client
yield room.remove(clientId);

// get all clients
yield room.getClients();

// STATIC see Client.init
Room.init({ send, memory });

// broadcast to all clients messages
yield room.broadcast({ ok: true });

```
