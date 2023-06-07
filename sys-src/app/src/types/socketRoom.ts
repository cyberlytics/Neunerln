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
    
    NextPlayer = 'nextPlayer',
    playCard = 'playCard',
    cardMoveFeedback = 'cardMoveFeedback'
}