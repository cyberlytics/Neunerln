export enum SocketRoom {
    connection = 'connection',
    disconnected = 'disconnect',

    roomCreated = 'roomCreated',
    roomJoined = 'roomJoined',
    gameStarted = "gameStarted",

    lobbyRoomsChanged = 'lobbyRoomsChanged',

    handcardsRequested = 'handcardsRequested',
    handCardsPublished = 'getHandCards',
    
    gamedataPublished = 'gamedataPublished',
    
    nextPlayer = 'nextPlayer',
    drawCard = 'drawCard',
    playCard = 'playCard',
    cardMoveFeedback = 'cardMoveFeedback',
    ready = 'ready'
}