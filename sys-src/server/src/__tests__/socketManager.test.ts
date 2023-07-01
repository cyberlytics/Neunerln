import { Card } from '../types/card';
import { SocketManager } from '../services/socketManager';
import { CardNumber } from '../types/cardNumber';
import { CardColor } from '../types/cardColor';




let socketManager: SocketManager;

beforeEach(() => {
    socketManager = new SocketManager().initialize();
});

describe('initialize', () => {
    it('does not throw exception', () => {
        expect(() => socketManager.initialize()).not.toThrow();
    })
})

describe('connectUser', () => {
    it('does not throw exception', () => {
        socketManager.userConnectionLog = true;
        expect(() => socketManager.connectUser(getSocketMock())).not.toThrow();
    })
})

describe('createRoom', () => {
    it('creates room correctly', () => {
        let userName = 'foo';
        let specialCards = [ 'bar1', 'bar2'];
        let maxPlayers = 2;

        let roomId = socketManager.createRoom(getSocketMock() , userName, specialCards, maxPlayers);
        
        expect(socketManager.rooms.length).toBe(1);

        let room = socketManager.rooms[0];
        expect(room.id).toBe(roomId);
        expect(room.name).toBe(`Raum von ${userName}`);
        expect(room.specialCards).toBe(specialCards);
        expect(room.maxPlayers).toBe(maxPlayers);
    })
})

describe('joinRoom', () => {
    it('adds user to room correctly', () => {
        let roomCreaterName  = 'creatorName'
        let specialCards = [ 'bar1', 'bar2'];
        let maxPlayers = 2;

        let joinUserId = 'joinId';
        let joinUserName = 'joinName';

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        socketManager.joinRoom(getSocketMock(joinUserId), roomId, joinUserName);
        
        let room = socketManager.rooms[0];
        expect(room.playerCount()).toBe(1);
        expect(room.players[0].id).toBe(joinUserId);
        expect(room.players[0].name).toBe(joinUserName);
    })
})

describe('leaveRoom', () => {
    it('removes user from joined room', () => {
        let userId = 'joinId';
        let roomId = socketManager.createRoom(getSocketMock(), '1', [ 'seven' ], 2);
        socketManager.joinRoom(getSocketMock(userId), roomId, 'joinName');
                
        let room = socketManager.rooms[0];
        expect(room.playerCount()).toBe(1);

        socketManager.leaveRoom(room, userId);
        expect(room.playerCount()).toBe(0);
    })
})

describe('leaveRoom', () => {
    it('closes room if empty', () => {
        let userId = 'joinId';
        let roomId = socketManager.createRoom(getSocketMock(), '1', [ 'seven' ], 2);
        socketManager.joinRoom(getSocketMock(userId), roomId, 'joinName');
        socketManager.leaveRoom(socketManager.rooms[0], userId);

        expect(socketManager.rooms.length).toBe(0);
    })
})

describe('sendHandCards', () => {
    it('does not throw exception', () => {
        let roomCreaterName  = 'creatorName'
        let specialCards = [ 'bar1', 'bar2'];
        let maxPlayers = 2;

        let joinUserName = 'joinName';

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        socketManager.joinRoom(getSocketMock(), roomId, joinUserName);
        
        expect(() => socketManager.sendHandCards(getSocketMock(), roomId)).not.toThrow();
    })
})

describe('getLobbyData', () => {
    it('only gets correct games', () => {
        // full room
        let roomId1 = socketManager.createRoom({ emit: () => {} }, '1', [ 'seven' ], 2);
        socketManager.joinRoom(getSocketMock(), roomId1, 'join1');
        socketManager.joinRoom(getSocketMock(), roomId1, 'join2');

        // empty room
        let roomId2 = socketManager.createRoom(getSocketMock(), '2', [ 'seven' ], 2);
        
        let lobbyData = socketManager.getLobbyData();
        expect(lobbyData.length).toBe(1);
        expect(lobbyData[0].id).toBe(roomId2);
        expect(lobbyData[0].currentPlayers).toBe(0);
    })
})

describe('logRooms', () => {
    it('does not throw exception', () => {
        socketManager.roomUpdateLog = true;
        expect(() => socketManager.logRooms()).not.toThrow();
    })
})

// ToDo PickMa: add tests for
// * disconnectUser()
// * joinRoom() on non existing or ingame room
// * leaveRoom() without closing it

function getSocketMock(id = '') {
    return {
        id: id,
        join: () => {},
        emit: () => {},
        on: () => {}
    };
}

describe('ChooseColor', () => {
    it('does not throw exeption',() => {
        let roomCreaterName  = 'creatorName'
        let specialCards = [ 'nine'];
        let maxPlayers = 2;

        let color = 'Eichel'

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        socketManager.ChooseColor(color, roomId);
        let room = socketManager.rooms[0];
        expect(room.choosenColor).toBe(color);
    })
})

describe('checkforninecolor', () => {
    let roomCreaterName  = 'creatorName'
    let specialCards = [ 'nine'];
    let maxPlayers = 2;

    test("Return Eichel Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Eichel';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_eichel.svg');
    });

    test("Return Herz Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
    let room = socketManager.rooms[0];
        room.choosenColor = 'Herz';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_herz.svg');
    });

    test("Return Blatt Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
    let room = socketManager.rooms[0];
        room.choosenColor = 'Blatt';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_gras.svg');
    });

    test("Return Schellen Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
    let room = socketManager.rooms[0];
        room.choosenColor = 'Schellen';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_schellen.svg');
    });

    test("Return Undefined Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.discardPile = [new Card(CardNumber.nine, CardColor.schellen)]
        room.choosenColor = '';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe(room.discardPile[0].color);
    });

})


describe('CardNumbertoString', () => {

    test("Return Six", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.six, CardColor.eichel));
        expect(cardnumber).toBe('six');
    });

     test("Return Seven", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.seven, CardColor.eichel));
        expect(cardnumber).toBe('seven');
    });

     test("Return Eight", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.eight, CardColor.eichel));
        expect(cardnumber).toBe('eight');
    });

     test("Return Nine", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.nine, CardColor.eichel));
        expect(cardnumber).toBe('nine');
    }); 

     test("Return Ten", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.ten, CardColor.eichel));
        expect(cardnumber).toBe('ten');
    });

     test("Return Ober", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.ober, CardColor.eichel));
        expect(cardnumber).toBe('ober');
    });

     test("Return Unter", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.unter, CardColor.eichel));
        expect(cardnumber).toBe('unter');
    });

     test("Return King", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.king, CardColor.eichel));
        expect(cardnumber).toBe('king');
    });

     test("Return Ace", ()=>{
        let cardnumber = '';
        cardnumber= socketManager.CardnumberToString(new Card(CardNumber.ace, CardColor.eichel));
        expect(cardnumber).toBe('ace');
    });
})

describe('checkforninecolor', () => {
    let roomCreaterName  = 'creatorName'
    let specialCards = [ 'nine', 'bar2'];
    let maxPlayers = 2;

    test("Return Eichel Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Eichel';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_eichel.svg');
    });

    test("Return Herz Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Herz';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_herz.svg');
    });

    test("Return Blatt Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Blatt';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_gras.svg');
    });

    test("Return Schellen Path", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Schellen';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_schellen.svg');
    });
})


describe('SpezialMove', () => {
    let roomCreatorId = 'creatorId'
    let roomCreaterName  = 'creatorName'
    let specialCards = [ 'nine', 'seven', 'eight', 'ten', 'ace'];
    let maxPlayers = 2;
    let joinUser1Id = 'join1Id';
    let joinUser1Name = 'join1Name';
    let joinUser2Id = 'join2Id';
    let joinUser2Name = 'join2Name';
    let joinUser3Id = 'join3Id';
    let joinUser3Name = 'join3Name';

    test("sevenTest/NextplayerHasNoSeven", ()=>{


        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom({ id: joinUser1Id, join: () => {}}, roomId, joinUser1Name);
        socketManager.joinRoom({ id: joinUser2Id, join: () => {}}, roomId, joinUser2Name);
        room.players[0]= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.ten, CardColor.schellen)], ready:true};
        room.players[1]= { id:joinUser2Id, name:joinUser2Name, handCards:[new Card(CardNumber.ace, CardColor.eichel), new Card(CardNumber.seven, CardColor.eichel)], ready:true};
        room.playedseveninarow = 0;
        room.currentPlayer= room.players[0];
        socketManager.SpecialMove( null, 'seven', roomId, room);
        expect(room.playedseveninarow).toBe(1);
    });

    test("sevenTest/NextplayerHasSeven", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom({ id: joinUser1Id, join: () => {}}, roomId, joinUser1Name);
        socketManager.joinRoom({ id: joinUser2Id, join: () => {}}, roomId, joinUser2Name);
        room.players[0]= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.ten, CardColor.schellen)], ready:true};
        room.players[1]= { id:joinUser2Id, name:joinUser2Name, handCards:[new Card(CardNumber.seven, CardColor.eichel)], ready:true};
        room.playedseveninarow = 0;
        room.currentPlayer= room.players[0];
        socketManager.SpecialMove( null, 'seven', roomId, room);

        expect(room.playedseveninarow).toBe(1);
    });

    test("eightTest", ()=>{

        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom({ id: joinUser1Id, join: () => {}}, roomCreatorId, joinUser1Name);
        socketManager.joinRoom({ id: joinUser2Id, join: () => {}}, roomCreatorId, joinUser2Name);
        socketManager.joinRoom({ id: joinUser3Id, join: () => {}}, roomCreatorId, joinUser3Name);
        let expectedPlayer = room.players[2];
        const Player = socketManager.SpecialMove(null,'eight', joinUser1Id, room)
        expect(Player).toBe(expectedPlayer);
    });

    test("nineTest", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.userConnectionLog = true;
        let socket = { 
            id: '1',
            emit: () => {},
            on: () => {}
        };
        expect(() => socketManager.SpecialMove(socket, 'nine', roomCreatorId , room)).not.toThrow();

    });

    test("tenTest", ()=>{
        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.userConnectionLog = true;
        let socket = { 
            id: '1',
            emit: () => {},
            on: () => {}
        };
        expect(() => socketManager.SpecialMove(socket, 'ten', roomCreatorId , room)).not.toThrow();

    });

    test("aceTest", ()=>{

        socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom({ id: joinUser1Id, join: () => {}}, roomCreatorId, joinUser1Name);
        socketManager.joinRoom({ id: joinUser2Id, join: () => {}}, roomCreatorId, joinUser2Name);
        let expectedPlayer = room.players[0];
        const Player = socketManager.SpecialMove(null,'ace', joinUser1Id, room)
        expect(Player).toBe(expectedPlayer);
    });


})

describe("GivePlayerYourCard", ()=>{
    it('does not throw exeption',() => {
        let roomCreaterName  = 'creatorName'
        let specialCards = [ 'ten'];
        let maxPlayers = 2;

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        socketManager.GivePlayerYourCard('player', roomId);
        let room = socketManager.rooms[0];
        expect(room.choosenPlayer).toBe('player');
    })
})

describe("addCardsAfterSeven", ()=>{

    let roomCreaterName  = 'creatorName'
    let specialCards = [ 'nine', 'seven', 'eight', 'ten', 'ace'];
    let maxPlayers = 2;
    let joinUser1Id = 'join1Id';
    let joinUser1Name = 'join1Name';
    let card = new Card(CardNumber.ten, CardColor.eichel)
    let card2 = new Card(CardNumber.seven, CardColor.eichel)

    it("two Cards should be added to current User", ()=>{

        let roomId= socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
        room.playedseveninarow=1;
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.ten, CardColor.schellen)], ready:true};
        room.discardPile = [new Card(CardNumber.eight, CardColor.gras), new Card(CardNumber.seven, CardColor.gras),new Card(CardNumber.six, CardColor.gras)]
        room.drawPile = [new Card(CardNumber.ace, CardColor.herz), new Card(CardNumber.eight, CardColor.herz)]
        socketManager.addCardsAfterSeven(room, card.number, true)
        

        expect(room.drawPile.length).toBe(0);
        expect(room.playedseveninarow).toBe(0);
        expect(room.currentPlayer?.handCards?.length).toBe(3);
    });

    it("no Cards should be added to current User", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
        room.playedseveninarow=1;
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.ten, CardColor.schellen)], ready:true};
        room.discardPile = [new Card(CardNumber.eight, CardColor.gras), new Card(CardNumber.seven, CardColor.gras),new Card(CardNumber.seven, CardColor.herz)]
        room.drawPile = [new Card(CardNumber.ace, CardColor.herz), new Card(CardNumber.eight, CardColor.herz)]
        socketManager.addCardsAfterSeven(room, card2.number, true)
        
        expect(room.drawPile.length).toBe(2);
        expect(room.playedseveninarow).toBe(1);
        expect(room.currentPlayer?.handCards?.length).toBe(1);
    });

})

describe("playCard", ()=>{

    let roomCreaterName  = 'creatorName'
    let specialCards = [ 'nine'];
    let maxPlayers = 2;
    let joinUser1Id = 'join1Id';
    let joinUser1Name = 'join1Name';
  

    it("play a card with the same color", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
       
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.ace, CardColor.eichel)], ready:true};
        room.discardPile = [new Card(CardNumber.seven, CardColor.eichel)]
        socketManager.playCard(getSocketMock(joinUser1Id), roomId, room.currentPlayer.handCards[0]);
        
        expect(room.discardPile.length).toBe(2);
        expect(room.currentPlayer.handCards.length).toBe(0);
        expect(room.TenGiveCard).toBe(false);

    });

    it("play a card with the same number", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
       
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.eight, CardColor.herz)], ready:true};
        room.discardPile = [new Card(CardNumber.eight, CardColor.eichel)]
        socketManager.playCard(getSocketMock(joinUser1Id), roomId, room.currentPlayer.handCards[0]);
        
        expect(room.discardPile.length).toBe(2);
        expect(room.currentPlayer.handCards.length).toBe(0);
        expect(room.TenGiveCard).toBe(false);

    });

    it("play a card with a other number", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
       
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.eight, CardColor.herz)], ready:true};
        room.discardPile = [new Card(CardNumber.ace, CardColor.eichel)]
        socketManager.playCard(getSocketMock(joinUser1Id), roomId, room.currentPlayer.handCards[0]);
        
        expect(room.discardPile.length).toBe(1);
        expect(room.currentPlayer.handCards.length).toBe(1);
        expect(room.TenGiveCard).toBe(false);

    });

    it("play a card with a other color", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
       
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.eight, CardColor.eichel)], ready:true};
        room.discardPile = [new Card(CardNumber.ace, CardColor.schellen)]
        socketManager.playCard(getSocketMock(joinUser1Id), roomId, room.currentPlayer.handCards[0]);
        
        expect(room.discardPile.length).toBe(1);
        expect(room.currentPlayer.handCards.length).toBe(1);
        expect(room.TenGiveCard).toBe(false);

    });


})


describe("check if game is finished", ()=>{
    let roomCreaterName  = 'creatorName'
    let specialCards = ['eight', 'ace'];
    let maxPlayers = 2;
    let joinUser1Id = 'join1Id';
    let joinUser1Name = 'join1Name';


    it("your last handcard is a eight", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];

        const mockHandleGameFinished = jest.spyOn(socketManager, 'handleGameFinished');

        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[], ready:true};
        room.discardPile = [new Card(CardNumber.ten, CardColor.eichel)];
        socketManager.checkGameFinished(roomId, new Card(CardNumber.eight, CardColor.eichel));
        
        expect(mockHandleGameFinished).not.toHaveBeenCalled();
    });

    it("your last handcard is a ace", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        const mockHandleGameFinished = jest.spyOn(socketManager, 'handleGameFinished');

        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[], ready:true};
        room.discardPile = [new Card(CardNumber.ten, CardColor.eichel)];
        socketManager.checkGameFinished(roomId, new Card(CardNumber.ace, CardColor.eichel));
        
        expect(mockHandleGameFinished).not.toHaveBeenCalled();
    });

    it("your last handcard is a seven", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        const mockHandleGameFinished = jest.spyOn(socketManager, 'handleGameFinished');

        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[], ready:true};
        room.discardPile = [new Card(CardNumber.ten, CardColor.eichel)];
        socketManager.checkGameFinished(roomId, new Card(CardNumber.seven, CardColor.eichel));
        
        expect(mockHandleGameFinished).toHaveBeenCalled();
    });

})


describe("check if deck shuffle", ()=>{
    let roomCreaterName  = 'creatorName'
    let specialCards = ['eight', 'ace'];
    let maxPlayers = 2;
    let joinUser1Id = 'join1Id';
    let joinUser1Name = 'join1Name';


    it("discard pile = 1 -> shuffle", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];

        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[], ready:true};
        room.discardPile = [new Card(CardNumber.ten, CardColor.eichel), new Card(CardNumber.ace, CardColor.eichel)];
        room.drawPile = [new Card(CardNumber.eight, CardColor.gras)];
        socketManager.shuffleDrawingPile(roomId);
        
        expect(room.drawPile.length).toBe(2);
        expect(room.discardPile.length).toBe(1);
    });

    it("discard pile = 3 -> dont shuffle", ()=>{

        let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];

        socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[], ready:true};
        room.discardPile = [new Card(CardNumber.seven, CardColor.eichel)];
        room.drawPile = [new Card(CardNumber.ten, CardColor.eichel), new Card(CardNumber.ace, CardColor.eichel), new Card(CardNumber.ace, CardColor.gras)];
        socketManager.shuffleDrawingPile(roomId);
        
        expect(room.drawPile.length).toBe(3);
    });

})

describe("drawCard", ()=>{
    let roomCreaterName  = 'creatorName'
     let specialCards = [''];
      let maxPlayers = 2;
      let joinUser1Id = 'join1Id';
      let joinUser1Name = 'join1Name';
 
 
      it("draw a Card", ()=>{
 
          let roomId = socketManager.createRoom(getSocketMock(), roomCreaterName, specialCards, maxPlayers);
          let room = socketManager.rooms[0];
         
          socketManager.joinRoom(getSocketMock(joinUser1Id), roomId, joinUser1Name);
 
          room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.unter, CardColor.schellen)], ready:true};
          room.drawPile = [new Card(CardNumber.six, CardColor.gras), new Card(CardNumber.ober, CardColor.gras)];
          room.discardPile = [new Card(CardNumber.ten, CardColor.eichel)];
          socketManager.drawCard(getSocketMock(joinUser1Id), roomId);
         
 
          expect(room.drawPile.length).toBe(1);
      });
 
  })