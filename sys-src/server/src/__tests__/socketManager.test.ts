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