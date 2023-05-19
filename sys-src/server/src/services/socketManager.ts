import { PublicGameMetadata } from "../types/publicGameMetadata";
import { app } from "../app";
import { Player } from "../types/player";
import { PublicRoomData } from "../types/publicRoomData";
import { SocketRoom } from "../types/socketRoom";
import { Room } from "./room";


export class SocketManager {
  // logging
  userConnectionLog = false;
  roomUpdateLog = true;
    
  io = require('socket.io')(app, {
    cors: {
      origin: "*"
    }
  });
  
  rooms: Room[] = [];

  subscribe() {
    this.io.on(SocketRoom.onConnection, (socket: any) => {
      if (this.userConnectionLog) {
        console.log(`Client ${socket.id} connected. (${this.io.engine.clientsCount})`);
      }
  
      // send rooms to new client
      socket.emit(SocketRoom.publishOpenRooms, this.getLobbyData());
  
      socket.on(SocketRoom.onCreateRoom, (userName: string, specialCards: string[], maxPlayers: number) => {
        const newRoom: Room = new Room(
          socket.id,
          `Room of ${userName}`,
          specialCards,
          maxPlayers
        );
        this.rooms.push(newRoom);
        this.io.emit(SocketRoom.publishOpenRooms, this.getLobbyData());
  
        this.LogRooms();
      });
  
      socket.on(SocketRoom.onJoinRoom, (roomId: string, userName: string) => {
        const room = this.rooms.find((room) => room.id == roomId);
        if (!room) {
          return;
        }
  
        if (room.ingame) {
          return;
        }
  
        room.players.push(new Player(socket.id, userName));
        socket.join(room.id);
        // this.io.to(room.id).emit(SocketRoom.onRoomJoined, userName);
  
        if (room.isFull()) {
          room.startGame();
        }

        this.io.emit(SocketRoom.publishOpenRooms, this.getLobbyData());
        this.io.to(room.id).emit(SocketRoom.onStartGame);
  
        var cardsPerPlayer: { [userName: string]: number; } = {};
        room.players.forEach((player) => {
          cardsPerPlayer[player.name] = player.handCards.length;
        });
        this.io.to(room.id).emit(SocketRoom.getGameMetadata, new PublicGameMetadata(
          cardsPerPlayer,
          room.drawPile.length,
          room.discardPile,
          room.players.map((player) => player.name),
          room.currentPlayer?.name
        ));
      });
  
      socket.on(SocketRoom.requestHandCards, (roomId: string) => {
        var correspondingRoom = this.rooms.find((room) => room.id == roomId);
        var handCards = correspondingRoom?.players.find((player) => player.id == socket.id)?.handCards;
        socket.emit(SocketRoom.getHandCards, handCards);
      });
  
      socket.on(SocketRoom.onDisconnect, () => {
        let playerId = socket.id;
  
        // find joined game
        let joinedRoom = this.rooms.filter(room => room.players.some((player: Player) => player.id == playerId))[0];
        if (!joinedRoom) {
          return;
        }
  
        // leave joined games
        joinedRoom.players = joinedRoom.players.filter((player: Player) => player.id != playerId);
  
        // close room if empty
        if (joinedRoom.players.length == 0) {
          this.rooms = this.rooms.filter(room => room.id != joinedRoom.id);
  
        }
  
        this.io.emit(SocketRoom.publishOpenRooms, this.getLobbyData());
  
        if (this.userConnectionLog) {
          console.log(`Client ${socket.id} disconnected. (${this.io.engine.clientsCount})`);
        }
      });
    });
  }

  getLobbyData() {
    return this.rooms
      .filter((room) => !room.isFull())
      .filter((room) => !room.ingame)
      .map((room) => new PublicRoomData(room.id, room.name, room.specialCards, room.startingHandCards, room.playerCount(), room.maxPlayers))
  }

  LogRooms() {
    if (this.roomUpdateLog) {
      console.log(`rooms: open (${(this.getLobbyData()).length}) / all (${this.rooms.length})`);
    }
}
}
