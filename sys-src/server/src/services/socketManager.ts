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

  initialize() {
    this.io.on(
      SocketRoom.connection, (socket: any) =>
      this.connectUser(socket)
    );

    console.log('SocketManager initialized');
    return this;
  }

  connectUser(socket: any) {
    // send rooms to new client
    socket.emit(
      SocketRoom.lobbyRoomsChanged,
      this.getLobbyData());
      
    socket.on(
      SocketRoom.createRoom, (userName: string, specialCards: string[], maxPlayers: number) =>
      this.createRoom(socket, userName, specialCards, maxPlayers)
    );

    socket.on(
      SocketRoom.roomJoined, (roomId: string, userName: string) =>
      this.joinRoom(socket, roomId, userName)
    );

    socket.on(
      SocketRoom.handcardsRequested, (roomId: string) =>
      this.sendHandCards(socket, roomId)
    );

    socket.on(
      SocketRoom.disconnected, () =>
      this.disconnectUser(socket.id)
    );

    if (this.userConnectionLog) {
      console.log(`Client ${socket.id} connected. (${this.io.engine.clientsCount})`);
    }
  }
 
  disconnectUser(userId: string) {
    // find joined game
    let joinedRoom = this.rooms.filter(room => room.players.some((player: Player) => player.id == userId))[0];
    if (joinedRoom) {
      this.leaveRoom(joinedRoom, userId);
    }


    if (this.userConnectionLog) {
      console.log(`Client ${userId} disconnected. (${this.io.engine.clientsCount})`);
    }
  }
  
  createRoom(socket: any, userName: string, specialCards: string[], maxPlayers: number) {
    // create and save new room
    const newRoom: Room = new Room(
      `Room of ${userName}`,
      specialCards,
      maxPlayers
    );
    this.rooms.push(newRoom);
    
    // send feedback to creator
    socket.emit(
      SocketRoom.roomCreated,
      newRoom.id
    );

    // send updated lobby rooms to clients
    this.io.emit(
      SocketRoom.lobbyRoomsChanged,
      this.getLobbyData()
    );

    this.logRooms();
  }

  joinRoom(socket: any, roomId: string, userName: string) {
    const room = this.rooms.find((room) => room.id == roomId);
        if (!room
          || room.ingame) {
          return;
        }

        // add and subscribe player to room
        room.players.push(new Player(socket.id, userName));
        socket.join(room.id);
  
        // start game if full
        if (room.isFull()) {
          room.startGame();
          this.io.to(room.id).emit(SocketRoom.gameStarted);
        }

        // update lobby rooms
        this.io.emit(
          SocketRoom.lobbyRoomsChanged,
          this.getLobbyData()
        );
  
        this.updateGamedata(room);
  }

  leaveRoom(room: Room, userId: string) {
    // leave joined games
    room.players = room.players.filter((player: Player) => player.id != userId);

    // close room if empty
    if (room.players.length == 0) {
      this.logRooms();
      this.rooms = this.rooms.filter(r => r.id != room.id);
      this.logRooms();
    }

    // update room members
    else {
      this.updateGamedata(room);
    }

    // update lobby data
    this.io.emit(
      SocketRoom.lobbyRoomsChanged,
      this.getLobbyData()
    ); 
  }

  updateGamedata(room: Room) {
    // get new game data
    const cardsPerPlayer = room.players.reduce((result, player) => {
      result[player.name] = player.handCards.length;
      return result;
    }, {} as { [userName: string]: number; });
    const gameMetadata = new PublicGameMetadata(
      cardsPerPlayer,
      room.drawPile.length,
      room.discardPile,
      room.players.map((player) => player.name),
      room.currentPlayer?.name
    )

    // update room members with new game data
    this.io.to(room.id).emit(
      SocketRoom.gamedataPublished,
      gameMetadata
    );
  }

  sendHandCards(socket: any, roomId: string) {
    // get user's handcards
    var correspondingRoom = this.rooms.find((room) => room.id == roomId);
    var handCards = correspondingRoom?.players.find((player) => player.id == socket.id)?.handCards;

    // send back to user
    socket.emit(
      SocketRoom.handCardsPublished,
      handCards
    );
  }

  getLobbyData() {
    return this.rooms
      .filter((room) => !room.isFull())
      .filter((room) => !room.ingame)
      .map((room) => new PublicRoomData(room.id, room.name, room.specialCards, room.startingHandCards, room.playerCount(), room.maxPlayers))
  }

  logRooms() {
    if (this.roomUpdateLog) {
      console.log(`rooms: open (${(this.getLobbyData()).length}) / all (${this.rooms.length})`);
    }
}
}