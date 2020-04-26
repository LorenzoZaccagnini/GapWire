import _ from 'lodash';
import uuid from 'uuid/v4';
import {
  getIO,
  getRedis
} from './index'

export default class Socket {
  constructor(opts) {
    const {
      roomId,
      socket,
      room,
      roomIdOriginal
    } = opts

    this._roomId = roomId
    this.socket = socket;
    this.roomIdOriginal = roomIdOriginal;
    this.room = room;
    if (room.isLocked) {
      this.sendRoomLocked();
      return
    }

    this.init(opts)
  }

  async init(opts) {
    const {
      roomId,
      socket,
      room
    } = opts
    await this.joinRoom(roomId, socket.id)
    this.handleSocket(socket)
  }

  sendRoomLocked() {
    this.socket.emit('ROOM_LOCKED');
  }

  async saveRoom(room) {
    const json = {
      ...room,
      updatedAt: Date.now(),
    }

    return getRedis().hsetAsync('rooms', this._roomId, JSON.stringify(json))
  }

  async destroyRoom() {
    return getRedis().hdel('rooms', this._roomId)
  }

  fetchRoom() {
    return new Promise(async (resolve, reject) => {
      const res = await getRedis().hgetAsync('rooms', this._roomId)
      resolve(JSON.parse(res || '{}'))
    })
  }

  joinRoom(roomId, socketId) {


    return new Promise((resolve, reject) => {
      getIO().of('/').adapter.remoteJoin(socketId, roomId, (err) => {
        if (err) {
          reject()
        }
        resolve()
      });
    });
  }

  async handleSocket(socket) {
    socket.on('ENCRYPTED_MESSAGE', (payload) => {
      socket.to(this._roomId).emit('ENCRYPTED_MESSAGE', payload);
    });

    socket.on('USER_ENTER', async (payload) => {


      let room = await this.fetchRoom()
      if (await typeof this._roomId !== 'undefined') {
        console.log(this._roomId);
        let userNum = await Object.keys(socket.adapter.rooms[this._roomId].sockets).length
        console.log(userNum);


        if (userNum > 2) {
          console.log("more than 2");
          socket.disconnect(true);
          return;
        }
      } else {
        socket.disconnect(true);
        return;
      }


      if (_.isEmpty(room)) {
        room = {
          id: this._roomId,
          users: [],
          isLocked: false,
          createdAt: Date.now(),
        }
      }




      const newRoom = {
        ...room,
        users: [...(room.users || []), {
          socketId: socket.id,
          publicKey: payload.publicKey,
          isOwner: (room.users || []).length === 0,
        }]
      }
      await this.saveRoom(newRoom)

      getIO().to(this._roomId).emit('USER_ENTER', {
        ...newRoom,
        id: this.roomIdOriginal
      });

      console.log('entered');
    })

    socket.on('TOGGLE_LOCK_ROOM', async (data, callback) => {
      const room = await this.fetchRoom()
      const user = (room.users || []).find(u => u.socketId === socket.id && u.isOwner)

      if (!user) {
        callback({
          isLocked: room.isLocked,
        })
        return
      }

      await this.saveRoom({
        ...room,
        isLocked: !room.isLocked,
      })

      socket.to(this._roomId).emit('TOGGLE_LOCK_ROOM', {
        locked: !room.isLocked,
        publicKey: user && user.publicKey
      });

      callback({
        isLocked: !room.isLocked,
      })
    });

    socket.on('disconnect', () => this.handleDisconnect(socket));

    socket.on('USER_DISCONNECT', () => this.handleDisconnect(socket));
  }

  async handleDisconnect(socket) {
    let room = await this.fetchRoom()

    const user = await (room.users || []).find(u => u.socketId === socket.id)

    console.log("user: ", user);

    const newRoom = {
      ...room,
      users: (room.users || []).filter(u => u.socketId !== socket.id).map((u, index) => ({
        ...u
      }))
    }

    await this.saveRoom(newRoom)

    getIO().to(this._roomId).emit('USER_EXIT', room.users);

    if (typeof user.isOwner !== 'undefined' && await user.isOwner) {
      console.log("lock room");
      getIO().of('/').clients(function(error, clients) {
        if (error) throw error;
        for (var i = 0; i < clients.length; i++) {
          if (typeof getIO().sockets.connected[clients[i]] !== 'undefined') {
            getIO().sockets.connected[clients[i]].disconnect(true)
          }
        }
      })
    }

    if (newRoom.users && newRoom.users.length === 0) {
      console.log("destroy room");
      await this.destroyRoom()
    }


    socket.disconnect(true);
  }

}
