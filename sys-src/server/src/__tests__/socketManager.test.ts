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
        let socket = { 
            id: '1',
            emit: () => {},
            on: () => {}
        };
        expect(() => socketManager.connectUser(socket)).not.toThrow();
    })
})

describe('createRoom', () => {
    it('creates room correctly', () => {
        let userId = '1234';
        let userName = 'foo';
        let specialCards = [ 'bar1', 'bar2'];
        let maxPlayers = 2;

        socketManager.createRoom(userId, userName, specialCards, maxPlayers);
        
        expect(socketManager.rooms.length).toBe(1);

        let room = socketManager.rooms[0];
        expect(room.id).toBe(userId);
        expect(room.name).toBe(`Room of ${userName}`);
        expect(room.specialCards).toBe(specialCards);
        expect(room.maxPlayers).toBe(maxPlayers);
    })
})

describe('joinRoom', () => {
    it('adds user to room correctly', () => {
        let roomCreatorId = 'creatorId'
        let roomCreaterName  = 'creatorName'
        let specialCards = [ 'bar1', 'bar2'];
        let maxPlayers = 2;

        let joinUserId = 'joinId';
        let joinUserName = 'joinName';

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        socketManager.joinRoom({ id: joinUserId, join: () => {}}, roomCreatorId, joinUserName);
        
        let room = socketManager.rooms[0];
        expect(room.playerCount()).toBe(1);
        expect(room.players[0].id).toBe(joinUserId);
        expect(room.players[0].name).toBe(joinUserName);
    })
})

describe('leaveRoom', () => {
    it('removes user from joined room', () => {
        let userId = 'joinId';
        socketManager.createRoom('1', '1', [ 'seven' ], 2);
        socketManager.joinRoom({ id: userId, join: () => {}}, '1', 'joinName');
                
        let room = socketManager.rooms[0];
        expect(room.playerCount()).toBe(1);

        socketManager.leaveRoom(room, userId);
        expect(room.playerCount()).toBe(0);
    })
})

describe('leaveRoom', () => {
    it('closes room if empty', () => {
        let userId = 'joinId';
        socketManager.createRoom('1', '1', [ 'seven' ], 2);
        socketManager.joinRoom({ id: userId, join: () => {}}, '1', 'joinName');
        socketManager.leaveRoom(socketManager.rooms[0], userId);

        expect(socketManager.rooms.length).toBe(0);
    })
})

describe('sendHandCards', () => {
    it('does not throw exception', () => {
        let roomCreatorId = 'creatorId'
        let roomCreaterName  = 'creatorName'
        let specialCards = [ 'bar1', 'bar2'];
        let maxPlayers = 2;

        let joinUserId = 'joinId';
        let joinUserName = 'joinName';

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        socketManager.joinRoom({ id: joinUserId, join: () => {}}, roomCreatorId, joinUserName);
        
        expect(
            () => socketManager.sendHandCards({ id: joinUserId, emit: () => {}}, roomCreatorId))
            .not.toThrow();
    })
})

describe('getLobbyData', () => {
    it('only gets correct games', () => {
        // full room
        socketManager.createRoom('1', '1', [ 'seven' ], 2);
        socketManager.joinRoom({ id: 'join1', join: () => {}}, '1', 'join1');
        socketManager.joinRoom({ id: 'join2', join: () => {}}, '1', 'join2');

        // empty room
        socketManager.createRoom('2', '2', [ 'seven' ], 2);
        
        let lobbyData = socketManager.getLobbyData();
        expect(lobbyData.length).toBe(1);
        expect(lobbyData[0].id).toBe('2');
        expect(lobbyData[0].currentPlayers).toBe(0);
    })
})

describe('logRooms', () => {
    it('does not throw exception', () => {
        socketManager.roomUpdateLog = true;
        expect(() => socketManager.logRooms()).not.toThrow();
    })
})

describe('ChooseColor', () => {
    it('does not throw exeption',() => {
        let roomCreatorId = 'creatorId'
        let roomCreaterName  = 'creatorName'
        let specialCards = [ 'nine', 'bar2'];
        let maxPlayers = 2;

        let color = 'Eichel'

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        socketManager.ChooseColor(color, roomCreatorId);
        let room = socketManager.rooms[0];
        expect(room.choosenColor).toBe(color);
    })
})

describe('checkforninecolor', () => {
    let roomCreatorId = 'creatorId'
    let roomCreaterName  = 'creatorName'
    let specialCards = [ 'nine', 'bar2'];
    let maxPlayers = 2;

    test("Return Eichel Path", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Eichel';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_eichel.svg');
    });

    test("Return Herz Path", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
    let room = socketManager.rooms[0];
        room.choosenColor = 'Herz';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_herz.svg');
    });

    test("Return Blatt Path", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
    let room = socketManager.rooms[0];
        room.choosenColor = 'Blatt';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_gras.svg');
    });

    test("Return Schellen Path", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
    let room = socketManager.rooms[0];
        room.choosenColor = 'Schellen';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_schellen.svg');
    });
})

describe('checkforninecolor', () => {
    let roomCreatorId = 'creatorId'
    let roomCreaterName  = 'creatorName'
    let specialCards = [ 'nine', 'bar2'];
    let maxPlayers = 2;

    test("Return Eichel Path", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Eichel';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_eichel.svg');
    });

    test("Return Herz Path", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Herz';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_herz.svg');
    });

    test("Return Blatt Path", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        room.choosenColor = 'Blatt';
        const Path = socketManager.checkforninecolor(room);
        expect(Path).toBe('../src/assets/Bay_gras.svg');
    });

    test("Return Schellen Path", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
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

    test("sevenTest", ()=>{

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.SpecialMove(null,'seven', '', room)
        expect(room.playedseveninarow).toBe(1);
    });

    test("eightTest", ()=>{

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom({ id: joinUser1Id, join: () => {}}, roomCreatorId, joinUser1Name);
        socketManager.joinRoom({ id: joinUser2Id, join: () => {}}, roomCreatorId, joinUser2Name);
        socketManager.joinRoom({ id: joinUser3Id, join: () => {}}, roomCreatorId, joinUser3Name);
        let expectedPlayer = room.players[2];
        const Player = socketManager.SpecialMove(null,'eight', joinUser1Id, room)
        expect(Player).toBe(expectedPlayer);
    });

    test("nineTest", ()=>{
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
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
        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
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

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
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
        let roomCreatorId = 'creatorId'
        let roomCreaterName  = 'creatorName'
        let specialCards = [ 'ten'];
        let maxPlayers = 2;

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        socketManager.GivePlayerYourCard('player', roomCreatorId);
        let room = socketManager.rooms[0];
        expect(room.choosenPlayer).toBe('player');
    })
})

describe("addCardsAfterSeven", ()=>{

    let roomCreatorId = 'creatorId'
    let roomCreaterName  = 'creatorName'
    let specialCards = [ 'nine', 'seven', 'eight', 'ten', 'ace'];
    let maxPlayers = 2;
    let joinUser1Id = 'join1Id';
    let joinUser1Name = 'join1Name';
    let card = new Card(CardNumber.ten, CardColor.eichel)
    let card2 = new Card(CardNumber.seven, CardColor.eichel)

    it("two Cards should be added to current User", ()=>{

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom({ id: joinUser1Id, join: () => {}}, roomCreatorId, joinUser1Name);
        room.playedseveninarow=1;
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.ten, CardColor.schellen)], ready:true};
        room.discardPile = [new Card(CardNumber.eight, CardColor.gras), new Card(CardNumber.seven, CardColor.gras),new Card(CardNumber.six, CardColor.gras)]
        room.drawPile = [new Card(CardNumber.ace, CardColor.herz), new Card(CardNumber.eight, CardColor.herz)]
        socketManager.addCardsAfterSeven(room, card)
        
        expect(room.drawPile.length).toBe(0);
        expect(room.playedseveninarow).toBe(0);
        expect(room.currentPlayer?.handCards?.length).toBe(3);
    });

    it("no Cards should be added to current User", ()=>{

        socketManager.createRoom(roomCreatorId, roomCreaterName, specialCards, maxPlayers);
        let room = socketManager.rooms[0];
        socketManager.joinRoom({ id: joinUser1Id, join: () => {}}, roomCreatorId, joinUser1Name);
        room.playedseveninarow=1;
        room.currentPlayer= { id:joinUser1Id, name:joinUser1Name, handCards:[new Card(CardNumber.ten, CardColor.schellen)], ready:true};
        room.discardPile = [new Card(CardNumber.eight, CardColor.gras), new Card(CardNumber.seven, CardColor.gras),new Card(CardNumber.seven, CardColor.herz)]
        room.drawPile = [new Card(CardNumber.ace, CardColor.herz), new Card(CardNumber.eight, CardColor.herz)]
        socketManager.addCardsAfterSeven(room, card2)
        
        expect(room.drawPile.length).toBe(2);
        expect(room.playedseveninarow).toBe(1);
        expect(room.currentPlayer?.handCards?.length).toBe(1);
    });

})