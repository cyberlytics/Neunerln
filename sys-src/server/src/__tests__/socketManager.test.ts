import { SocketManager } from '../services/socketManager';

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
        expect(room.name).toBe(`Room of ${userName}`);
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