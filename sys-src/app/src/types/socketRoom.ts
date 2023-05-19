export enum SocketRoom {
    onConnection = 'connection',
    onDisconnect = 'disconnect',

    onCreateRoom = 'createRoom',
    onJoinRoom = 'joinRoom',
    onRoomJoined = 'roomJoined',
    onStartGame = "startGame",

    publishOpenRooms = 'publishOpenRooms',

    requestHandCards = 'requestHandCards',
    getHandCards = 'getHandCards',
    
    getGameMetadata = 'getGameMetadata',
}