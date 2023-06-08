import { PublicGameMetadata } from "../types/publicGameMetadata";
import { app } from "../app";
import { Player } from "../types/player";
import { PublicRoomData } from "../types/publicRoomData";
import { SocketRoom } from "../types/socketRoom";
import { Room } from "./room";
import { Card } from "src/types/card";

let RoomID: Room;

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

    return this;
  }



  connectUser(socket: any) {
    // send rooms to new client
    socket.emit(
      SocketRoom.lobbyRoomsChanged,
      this.getLobbyData());
      
    socket.on(
      SocketRoom.roomCreated, (userName: string, specialCards: string[], maxPlayers: number) =>
      this.createRoom(socket.id, userName, specialCards, maxPlayers),

    );

    socket.on(
      SocketRoom.roomJoined, (roomId: string, userName: string) =>
      this.joinRoom(socket, roomId, userName),
    );

    socket.on(
      SocketRoom.handcardsRequested, (roomId: string) =>
      this.sendHandCards(socket, roomId)
    
    );

    socket.on(
      SocketRoom.disconnected, () =>
      this.disconnectUser(socket.id)
    );

    socket.on(
      SocketRoom.playCard, (roomId: string, card: Card) =>
        this.playCard(socket, roomId, card)
    );

    socket.on(
      SocketRoom.drawCard, (roomId: string, card: Card) =>
        this.drawCard(socket, roomId, card)
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
  
  createRoom(userId: string, userName: string, specialCards: string[], maxPlayers: number) {
    // create and save new room
    const newRoom: Room = new Room(
      userId,
      `Room of ${userName}`,
      specialCards,
      maxPlayers
    );
    this.rooms.push(newRoom);
    
    // send updated lobby rooms to clients
    this.io.emit(
      SocketRoom.lobbyRoomsChanged,
      this.getLobbyData()
    );

    this.logRooms();
  }

  playCard(socket: any, roomId: string, card: Card) {
    let currentRoom = this.rooms.find((room) => room.id == roomId);
    if (currentRoom == null) {
      return;
    }

    // move functions to room/game class
    // check if players turn
    if (currentRoom?.currentPlayer?.id != socket.id) {
      // send user feedback -> not his turn
      socket.emit(
        SocketRoom.cardMoveFeedback,
        "Not your turn!"
      );
      return;
    }

   //Check for nine in specialcards and if nine is played
    let nine:boolean = false;
    if((currentRoom.specialCards.includes("nine")) && (card.number == "9")){
      nine = true;
    }

    if(!nine){
    // check if card an be played
    let lastDiscardCard = currentRoom.discardPile[currentRoom?.discardPile.length - 1]; 
    if (lastDiscardCard?.color != card.color
      && lastDiscardCard?.number != card.number) {

      // send user feedback -> invalid move
      socket.emit(
        SocketRoom.cardMoveFeedback,
        "you can't place this card"
      );
      return;
      }
    }


      
    // process cardmove
    // * add card to discard pile
    currentRoom.discardPile.push(card);
   

    // * remove card from current player
    if (currentRoom.currentPlayer == null) {
      return;
    }
    currentRoom.currentPlayer.handCards = 
      currentRoom.currentPlayer?.handCards
        .filter((handcard) => !(handcard.color == card.color && handcard.number == card.number));

   
        // * set new current player if card is not in special cards
       let number:string = this.CardnumberToString(card);
        if(currentRoom.specialCards.includes(number)){

          currentRoom.currentPlayer = this.SpecialMove(socket, number, socket.id, currentRoom);

          
        }else{
          const currentIndex = currentRoom.players.findIndex(player => player.id === socket.id);
          const nextIndex = (currentIndex + 1) % currentRoom.players.length;
          const nextPlayer = currentRoom.players[nextIndex];
          currentRoom.currentPlayer = nextPlayer;
        }

    // update for everyone
    this.updateGamedata(currentRoom);
  }

  CardnumberToString(card: Card){
    let cardnumber: string = "";
    if(card.number == "6"){
      cardnumber = "six";
    }else if(card.number == "7"){
      cardnumber = "seven";
    }else if(card.number == "8"){
      cardnumber = "eight";
    }else if(card.number == "9"){
      cardnumber = "nine";
    }else if(card.number == "10"){
      cardnumber = "ten";
    }else if(card.number == "U"){
      cardnumber = "unter";
    }else if(card.number == "O"){
      cardnumber = "ober";
    }else if(card.number == "K"){
      cardnumber = "king";
    }else if(card.number == "A"){
      cardnumber = "ace";
    }

    return cardnumber;
  }
  
//Add Special Moves (without nine)
SpecialMove(socket:any, Cardnumber: string, socketid : String, currentRoom: Room, ){

var Nextplayer:Player;

if(Cardnumber == "seven"){
  console.log("is in seven");
  //Next player has to take two cards
  const currentIndex = currentRoom.players.findIndex(player => player.id === socketid);
  const nextHandcardIndex = (currentIndex + 1) % currentRoom.players.length;
  const Nexthandcardplayer = currentRoom.players[nextHandcardIndex];
  //Take two cards
  Nexthandcardplayer.handCards.push(<Card>currentRoom.drawPile.pop());
  Nexthandcardplayer.handCards.push(<Card>currentRoom.drawPile.pop());

  //Todo if other player has a 7 he can play it 

}else if(Cardnumber == "eight"){
  console.log("is in eight");
  //Next player is skipped
  const currentIndex = currentRoom.players.findIndex(player => player.id === socketid);
  const nextIndex = (currentIndex + 2) % currentRoom.players.length;
  Nextplayer = currentRoom.players[nextIndex];
  return Nextplayer;


}else if(Cardnumber == "nine"){
  console.log("is in nine");
  //ToDo
  //Player can decide color of next card
  socket.emit(
          SocketRoom.cardMoveFeedback,
          "Wähle eine Farbe aus?"
        );
  

}else if(Cardnumber == "ten"){
  console.log("is in ten");
  //Give the player of your choice one card
  

}else if(Cardnumber == "ace"){
console.log("is in ace");
  //You can play another card
  const currentIndex = currentRoom.players.findIndex(player => player.id === socketid);
  Nextplayer = currentRoom.players[currentIndex];
  return Nextplayer;

}

const currentIndex = currentRoom.players.findIndex(player => player.id === socketid);
const nextIndex = (currentIndex + 1) % currentRoom.players.length;
Nextplayer = currentRoom.players[nextIndex];

return Nextplayer

}

  drawCard(socket: any, roomId: string, card: Card) {
    let currentRoom = this.rooms.find((room) => room.id == roomId);
    if (currentRoom == null) {
      return;
    }

    // check if players turn
    if (currentRoom?.currentPlayer?.id != socket.id) {
      // send user feedback -> not his turn
      socket.emit(
        SocketRoom.cardMoveFeedback,
        "Not your turn!"
      );
      return;
    }

    // declare the top card
    let lastDrawCard = currentRoom.drawPile[currentRoom?.drawPile.length - 1]; 

    // process cardmove
    // * add draw pile to handcards
    currentRoom.currentPlayer?.handCards.push(lastDrawCard);
    
     // * remove card from draw pile
    currentRoom.drawPile.pop();

    // * set new current player
    const currentIndex = currentRoom.players.findIndex(player => player.id === socket.id);

    //Spieler ist nach dem ziehen dirket nochmal dran, egal ob eine der Karten gepasst hätte oder nicht. Spieler kann unendlich oft ziehen.
    const nextPlayer = currentRoom.players[currentIndex];
    currentRoom.currentPlayer = nextPlayer;

    // update for everyone
    this.updateGamedata(currentRoom);
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
      this.rooms = this.rooms.filter(room => room.id != room.id);
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
    }, {} as { [userName: string]: number; })

        const gameMetadata = new PublicGameMetadata(
          cardsPerPlayer,
          room.drawPile.length,
          room.discardPile,
          room.players.map((player) => player.name),
          room.currentPlayer?.name,
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

  RoomId(room: Room| null){
    
    if(room !== null){
    RoomID = room;
    return RoomID;
    }else{
      return RoomID;
    }
  }
}