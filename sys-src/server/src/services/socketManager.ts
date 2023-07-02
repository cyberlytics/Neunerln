import { PublicGameMetadata } from "../types/publicGameMetadata";
import { app } from "../app";
import { Player } from "../types/player";
import { PublicRoomData } from "../types/publicRoomData";
import { SocketRoom } from "../types/socketRoom";
import { Room } from "./room";
import { Card } from "src/types/card";
import { shuffle } from "./helperFunctions";






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
      SocketRoom.drawCard, (roomId: string) =>
        this.drawCard(socket, roomId)
    );

    socket.on(
      SocketRoom.ready, (roomId: string, ready: boolean) =>
      this.setPlayerReadyState(socket, roomId, ready)
    );

    socket.on(
      SocketRoom.debug, (data: any) => {
        // use for debugging: e.g. trigger from frontend
        this.handleGameFinished(data);
      }
    );

    socket.on(
      SocketRoom.nineColor, (Color: string, roomId:string) =>
      this.ChooseColor(Color, roomId)
    );
    
    socket.on(
      SocketRoom.playedTen, (player: string, roomId:string,) =>
      this.GivePlayerYourCard(player, roomId)
      
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
      `Raum von ${userName}`,
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

    return newRoom.id;
  }

  playCard(socket: any, roomId: string, card: Card) {
    const currentRoom = this.getRoom(roomId);
    if (currentRoom == null) {
      return;
    }

    //addseven
    if(currentRoom?.specialCards.includes('seven') && card?.number!='7'){
      this.addCardsAfterSeven(currentRoom, card.number, true);
      }

    // move functions to room/game class
    // check if players turn
    if (currentRoom.currentPlayer?.id != socket.id) {
      // send user feedback -> not his turn
      socket.emit(
        SocketRoom.cardMoveFeedback,
        "Du bist nicht am Zug!"
      );
      return;
    }

    if(currentRoom.TenGiveCard){

      if(currentRoom.currentPlayer?.handCards==null){
        return;
      }
      const ChoosenPlayer = currentRoom.players.find(player => player.name === currentRoom?.choosenPlayer);
      ChoosenPlayer?.handCards.push(<Card>card);
      currentRoom.currentPlayer.handCards = currentRoom?.currentPlayer.handCards.filter((choosencard) => !(choosencard.number == card.number && choosencard.color == card.color));
      currentRoom.TenGiveCard=false;
      const currentIndex = currentRoom.players.findIndex(player => player.id === socket.id);
      const nextIndex = (currentIndex + 1) % currentRoom.players.length;
      const nextPlayer = currentRoom.players[nextIndex];
      currentRoom.currentPlayer = nextPlayer;
      
      
    }else{
    //let seven:boolean = false;
    let lastDiscardCard = currentRoom.discardPile[currentRoom?.discardPile.length - 1];

   //Check for nine in specialcards and if nine is played
    let nine:boolean = false;
    if((currentRoom.specialCards.includes("nine")) && (card.number == "9")){
      nine = true;
    }
let playedninebefor = false;
    if(!nine){
    // check if card an be played
  
    if(lastDiscardCard?.number == '9') {
      let wishedthisninecolor= this.checkforninecolor(currentRoom);
      playedninebefor = true;
      if(wishedthisninecolor !=  card.color){   
        socket.emit(
          SocketRoom.cardMoveFeedback,
          "Du kannst diese Karte nicht spielen!"
        );
        return;
      }

    }
    if(!playedninebefor){
    if (lastDiscardCard?.color != card.color
      && lastDiscardCard?.number != card.number) {

      // send user feedback -> invalid move
      socket.emit(
        SocketRoom.cardMoveFeedback,
        "Du kannst diese Karte nicht spielen!"
      );
      return;
      }
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
        
        this.checkGameFinished(currentRoom.id, card);
   
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

    currentRoom.playedseveninarow++;
    //check if next Player has seven 
    //if he does do hasseven=true;
    //if he doesnt, hasseven=false;
    const currentIndex = currentRoom.players.findIndex(player => player.name === currentRoom.currentPlayer?.name);
    const nextIndex = (currentIndex + 1) % currentRoom.players.length;
    let Nextsevenplayer = currentRoom.players[nextIndex];
    let hasseven=false;
    for(let i=0; i < Nextsevenplayer?.handCards?.length; i++){
      if(Nextsevenplayer.handCards[i].number == "7" ){
        hasseven=true;
      }
    }

   

    if(!hasseven){
      this.addCardsAfterSeven(currentRoom,Cardnumber,hasseven);
    }
  

}else if(Cardnumber == "eight"){
  //Next player is skipped
  const currentIndex = currentRoom.players.findIndex(player => player.id === socketid);
  const nextIndex = (currentIndex + 2) % currentRoom.players.length;
  Nextplayer = currentRoom.players[nextIndex];
  return Nextplayer;


}else if(Cardnumber == "nine"){
  //ToDo
  //Player can decide color of next card
  socket.emit(
          SocketRoom.nineColor,
          "Wähle eine Farbe aus?"
        );
  

}else if(Cardnumber == "ten"){
  //Give the player of your choice one card
  currentRoom.TenGiveCard=true;
  socket.emit(
    SocketRoom.playedTen,
    "Wählen einen Spieler aus, den du eine Karte schieben willst?", currentRoom.currentPlayer?.name
  );
  const currentIndex = currentRoom.players.findIndex(player => player.id === socketid);
  Nextplayer = currentRoom.players[currentIndex];
  return Nextplayer;

}else if(Cardnumber == "ace"){
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


addCardsAfterSeven(currentRoom:Room, cardnumber:string, hasseven:boolean){

  let previousDiscardCard = currentRoom.discardPile[currentRoom?.discardPile.length - 2];
  console.log(previousDiscardCard);

if(hasseven){
if((previousDiscardCard?.number== "7") && cardnumber!='7'){
  for(let i= 0; i < currentRoom?.playedseveninarow; i++){
    currentRoom?.currentPlayer?.handCards.push(<Card>currentRoom.drawPile.pop());
    currentRoom?.currentPlayer?.handCards.push(<Card>currentRoom.drawPile.pop());
    }
    currentRoom.playedseveninarow = 0;
}
}else{
  const currentIndex = currentRoom.players.findIndex(player => player.name === currentRoom?.currentPlayer?.name);
  const nextIndex = (currentIndex + 1) % currentRoom.players.length;
  let Nextsevenplayer = currentRoom.players[nextIndex];

      for(let i= 0; i < currentRoom?.playedseveninarow; i++){
        Nextsevenplayer?.handCards.push(<Card>currentRoom.drawPile.pop());
        Nextsevenplayer?.handCards.push(<Card>currentRoom.drawPile.pop());
        }   
        currentRoom.playedseveninarow = 0;
}
}

  drawCard(socket: any, roomId: string) {
    let currentRoom = this.getRoom(roomId);
    if (currentRoom == null) {
      return;
    }


    
    
    // check if players turn
    if (currentRoom?.currentPlayer?.id != socket.id) {
      // send user feedback -> not his turn
      socket.emit(
        SocketRoom.cardMoveFeedback,
        "Du bist nicht am Zug!"
      );
      return;
    }

    // declare the top card of drawPile
    let lastDrawCard = currentRoom.drawPile[currentRoom?.drawPile.length - 1];
    // declare the top card of discardPile
    let lastDiscardCard = currentRoom.discardPile[currentRoom?.discardPile.length - 1]; 
    let handcardLength: number = 0;
    let handcardMatches: boolean = false;
    let Wished: boolean = false;

    //check if nine was played last and check for wishedColor
    if(currentRoom.specialCards.includes("nine") && lastDiscardCard.number == "9"){
      Wished = true; 
    }

    // check if handcards are defined
    if (currentRoom.currentPlayer?.handCards) {
      handcardLength = currentRoom.currentPlayer.handCards.length;
    }

    // check if any handcard match to the discard card
    for (let i = 0; i < handcardLength; i++) {
      // nine is in specialCards and the top Card
      if(Wished){
        // one of the handcards match with a choosen color card
        if (currentRoom.currentPlayer?.handCards[i].color == currentRoom.choosenColor)
        {
          handcardMatches = true;
          socket.emit(
            SocketRoom.cardMoveFeedback,
            "Spiele einer deiner Handkarten!"
          );
          return;
        }

      }
      else
      {
        // check if any handcard match to the discard card
        if (currentRoom.currentPlayer?.handCards[i].color == lastDiscardCard.color
          || currentRoom.currentPlayer?.handCards[i].number == lastDiscardCard.number
          || (currentRoom.specialCards.includes("nine") && currentRoom.currentPlayer?.handCards[i].number == '9')){
            handcardMatches = true;
            socket.emit(
              SocketRoom.cardMoveFeedback,
              "Spiele einer deiner Handkarten!"
            );
            return;
        }
      }
    }
    // if handcard matches, then you can and should draw a card
    if (handcardMatches == false){
        // * add draw pile to handcards
        currentRoom.currentPlayer?.handCards.push(lastDrawCard);
    
        // * remove card from draw pile
        currentRoom.drawPile.pop();
    }

    // check drawPile.length
    this.shuffleDrawingPile(roomId);

    // * set new current player
    const currentIndex = currentRoom.players.findIndex(player => player.id === socket.id);


    // * if DiscardCard (number or color) is not the same as drawn card, then the nextplayer is next
    if (lastDiscardCard?.color == lastDrawCard?.color
      || lastDiscardCard?.number == lastDrawCard?.number
      || (lastDrawCard?.number == '9' && currentRoom.specialCards.includes("nine"))) {

        // currentplayer is still on the move 
        const nextPlayer = currentRoom.players[currentIndex];
        currentRoom.currentPlayer = nextPlayer;   
    }

    else {
      // next player is on the move 
      const nextIndex = (currentIndex + 1) % currentRoom.players.length;
      const nextPlayer = currentRoom.players[nextIndex];
      currentRoom.currentPlayer = nextPlayer;
    }

    this.updateGamedata(currentRoom);
  
  }

  joinRoom(socket: any, roomId: string, userName: string) {
    const room = this.getRoom(roomId);
    if (!room
      || room.ingame) {
      return;
    }

    // add and subscribe player to room
    room.players.push(new Player(socket.id, userName));
    socket.join(room.id);

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
    
    // inform current player
    this.io.to(room.currentPlayer?.id).emit(
      SocketRoom.cardMoveFeedback,
      "Du bist an der Reihe!"
    );
  }

  sendHandCards(socket: any, roomId: string) {
    // get user's handcards
    var correspondingRoom = this.getRoom(roomId);
    var handCards = correspondingRoom?.players.find((player) => player.id == socket.id)?.handCards;

    // send back to user
    socket.emit(
      SocketRoom.handCardsPublished,
      handCards
    );
  }

  shuffleDrawingPile(roomId: string) {
      // if drawPile is < 2, then shuffle
      let currentRoom = this.getRoom(roomId);
      if (currentRoom == null) {
        return;
      }
      if(currentRoom?.drawPile?.length <= 2) {
        this.io.to(roomId).emit(
          SocketRoom.cardMoveFeedback,
          "Der Ziehstapel wird neu gemischt!"
        );
        // discardPile without topcard
        let newDeck = currentRoom?.discardPile.slice(0, -1); 
        // topcard of discardPile
        let lastCard = currentRoom?.discardPile.slice(-1);      
        // drawpile + newDeck
        currentRoom.drawPile.push(...newDeck);
        shuffle(currentRoom.drawPile);
        // only one discardPile
        currentRoom.discardPile = lastCard;
      }
  }

  // check if game is finished
  checkGameFinished(roomId: string, card: Card) {
    let currentRoom = this.getRoom(roomId);
    if (currentRoom == null) {
      return;
    }
    // if handcards empty
    if (currentRoom?.currentPlayer?.handCards.length === 0) {
      // check you last card which now is on the discard pile
      if (card.number == "8" || card.number == "A") {
        // check if lobby is 3 or 4
        if (currentRoom.players.length > 2) {
          // check if ace is in specialcards
          if ((currentRoom.specialCards.includes("ace")) && card.number == "A") {
            console.log("not finished_ace3or4players");
          }
          else {
            console.log("finished_3or4players");
            this.handleGameFinished(roomId);
          }
        }
        // lobby with 2 players
        if (currentRoom.players.length === 2) {
          // check if eight is in specialcards
          if ((currentRoom.specialCards.includes("eight")) && card.number == "8") {
            console.log("not finished_eight2players");
          }
          // check if ace is in specialcards
          else if ((currentRoom.specialCards.includes("ace")) && card.number == "A") {
            console.log("not finished_ace2players");
          }
          else {
            console.log("finished_2players");
            this.handleGameFinished(roomId);
          }
        }
      }
      else {
        console.log("finished not last card 8 or A");
        this.handleGameFinished(roomId);
      }
    }
  }

  handleGameFinished(roomId: string) {

    let currentRoom = this.getRoom(roomId);
    if (currentRoom == null) {
      return;
    }
    // inform clients
    this.io.to(roomId).emit(
      SocketRoom.gameFinishedFeedback,
     currentRoom.currentPlayer?.name  + " hat diese Spielrunde gewonnen!",
    );

    // reset room
    let room = this.getRoom(roomId);
    if (room == null) {
      return;
    }
    room.resetGame();

    // update clients with resetted room
    this.updateGamedata(room);
  }

  getRoom(roomId: string) {
    let room = this.rooms.find((room) => room.id == roomId);
    return room;
  }

  setPlayerReadyState(socket: any, roomId: string, ready: boolean) {
    // get room
    const room = this.getRoom(roomId);
    if (!room
      || room.ingame) {
      return;
    }

    // get player
    const player = room.players.find((player) => player.id == socket.id);
    if (!player) {
      return;
    }

    player.ready = ready;

    // start game if room full and every player ready
    if (room.isFull() && room.isEveryPlayerReady()) {
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

 ChooseColor(color: string, roomId:string){
  
  let currentRoom = this.rooms.find((room) => room.id == roomId);
  if (currentRoom == null) {
    return;
  }

  let ChoosenColorString:string = color + " wurde gewählt";
  this.io.to(roomId).emit(
    SocketRoom.choosenNineColor,
    ChoosenColorString,
  );

  currentRoom.choosenColor = color;

 }

 checkforninecolor(currentRoom: Room){
  console.log(currentRoom.choosenColor + " = farbe gewählt");
  let wishedninecolor:string = '';
  if(currentRoom.choosenColor=='Eichel'){
    wishedninecolor='https://uc108663c6c36ea8400ce631a026.previews.dropboxusercontent.com/p/thumb/AB_DXZtFCMrcYLyJj2var4-FQmh3fcpbnYEzHkiq4fK5YRvE6yCJQTiwNjziWYjlS-ByN9UGu6rHDX5GAJbD0jzrDvpnLQiIPRqUCnSoP61ogVhqFQEldVYJ24V6lO5Pgg9-ZZgwiCvihlcHaRLH4geoYDzHKmELAufGZIk_5DbrNyW0qX3fgcmTZkpVWMYuoR1QY728jvHUIps8VecvTRKRBV3pz8B5fp4QqtZjNjsSrGY4DE8l_jM66oYRZ4webLdpmgLcZ047utkdZxkjfKJaWsUnaLNHnT686jhcVD1Ey4V57rRliFRXAjMmp2eiGmiTyPcbD1VWx5bscUt3-DSOvqxrGa3zEtn6kY2PNxjOgjSLyqZ_eo6caqIk2MyAYLw/p.png';
    return wishedninecolor;
  }else if(currentRoom.choosenColor=='Schellen'){
    wishedninecolor='https://ucca5ced69163afe4de1051dd046.previews.dropboxusercontent.com/p/thumb/AB_uaepilBk6nOHe3y3-Kr23Oa4dK8gWKejVcrbtCTYz6I4pazIPXG_nYiS4VskN-qp1bBSPgYsxS09RfYVENW3q0IV9DwzKe5UqhyXdsYcaQzqUV2fXzUThWepzVNmzjHnYInotMjJB_vWcqB_9JWKRm0e1TvgTC_93z2T8WIUP_1rvKeFDYarWeDemhO1UdzvG0y7BO4fLWIQM-qmQqa0C2JJFLKqRdWrJ7kf4sEYYzENivko2r7zJkjprV_W9NSbp28P-mcNVZwuZGUFS8lB-HI7FPoY-TQMkMOAgox6Em95zqa-TpiMXkAh0zq6r10Gj7Etfh8-sM68dpqy1Bfyy9ckrPnoYdWkjj1BbG3PzbxXf9ERjlgaWORjGV-4POvk/p.png';
    return wishedninecolor;
  }else if(currentRoom.choosenColor=='Herz'){
    wishedninecolor='https://uc0edef0999f56ae148f23f11368.previews.dropboxusercontent.com/p/thumb/AB9YNyZf-CIVUTxkFBUsW3pUc6raiguHsrSUfOB3vapmIpbFPyxqoYUzoY92FRZ-E-_Z29aZiKC-fmrW6LrTx5dH_RMJdtqSDVpaySyfPcSpolCwQRJwDS7_NcCVzKzyOF5CUXEqBl0kp1Zx9d4moM0ZB88IHfJrmUG0h5v1nJ2pLvyHw1IMu2QYZFPDskv815u29PAakbLZP5xpSOEWSR8T_B8f_OTVMtq_i_eOgM6updBQGbwJ-Wru_DJssmchSqLUZWP_o8kTXwIhG-UM4N5IgfaP9cp3Dl_qEIBl6fsxvcd3p3X-PPsCiR2kkm-ndviz_S_44p-Vb53QwdpIfSjIS6HulN5EL7SwT10eGF-dMayHd27O95DzHNpR1Tj-qpc/p.png';
    return wishedninecolor;
  }else if(currentRoom.choosenColor=='Blatt'){
    wishedninecolor='https://uc8de4228acb20a0fd867710758b.previews.dropboxusercontent.com/p/thumb/AB92SPF5Enh1nu8YP0xxmHBkxjuN8-f-cVR8Cdb54dB8UFrwI3WVWvjlbSzAxGZSi1jO7qlr2_PWu0yeMbgF9fGq2nn82NlS86eYGkXKYe5W5rDXTBVfrfI2pi9ry97ml-rCdONZ6L7oOjFa5e528-hOZdxl_nGDkhpvlEoVSbGpwoDTJM8BW3JwRiK-wTqsJSLxVafChiE0VgWNyvSZQHrNN9brFpBe8896QdNuiNzwHpfIxwyDgEoVFmZs8ATqFh_amqCZ0ukYBaEus3jN1zyFUsVgK1coFlV-hHx2_vYDXXSAkyP105JQLbgQlMfVuZhvxAFcmCaHgP-WN0LulNVDG4svdi2wSM_xTQspykHeySTAtjH7SYrdLLBnZ2ICH44/p.png';
    return wishedninecolor;
  }else{
    let lastDiscardCard = currentRoom.discardPile[currentRoom?.discardPile.length - 1];
    wishedninecolor = lastDiscardCard.color;
    return wishedninecolor;
  }
 }

GivePlayerYourCard(choosenplayer: string, roomId:string){

  let currentRoom = this.rooms.find((room) => room.id == roomId);
  if (currentRoom == null) {
    return;
  }
  currentRoom.choosenPlayer = choosenplayer;

}
}

