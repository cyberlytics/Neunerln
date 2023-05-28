import type { Card } from "./card";


export class PublicGameMetadata {
    cardCountPerPlayer: { [userId: string]: number; };
    drawingPileCount: number;
    discardPile: Card[];
    players: string[];
    currentPlayerName: string | undefined;

    constructor(cardCountPerPlayer: { [userId: string]: number; }, drawingPileCount: number, discardPile: Card[], players: string[], currentPlayerName: string | undefined) {
        this.cardCountPerPlayer = cardCountPerPlayer;
        this.drawingPileCount = drawingPileCount;
        this.discardPile = discardPile;
        this.players = players;
        this.currentPlayerName = currentPlayerName;
    }
}