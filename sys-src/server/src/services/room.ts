import { Card } from "../types/card";
import { CardColor } from "../types/cardColor";
import { CardNumber } from "../types/cardNumber";
import { Player } from "src/types/player";
import { getRandomElementFromArray, shuffle } from "./helperFunctions";

export class Room {
    // room
    id: string;
    name: string;
    ingame: boolean = false;
    specialCards: string[];
    startingHandCards: number = 6;
    maxPlayers: number;
    players: Player[];

    // game
    drawPile: Card[];
    discardPile: Card[];
    currentPlayer: Player | null;

    constructor(id: string, name: string, specialCards: string[], maxPlayers: number) {
        this.id = id;
        this.name = name;
        this.specialCards = specialCards;
        this.players = [];
        this.maxPlayers = maxPlayers;

        this.drawPile = this.getDeck();
        this.discardPile = [];
        this.currentPlayer = null;
    }

    playerCount() {
        return this.players.length;
    }

    isFull() {
        return (this.playerCount() >= this.maxPlayers);
    }

    startGame() {
        this.ingame = true;
        
        shuffle(this.players);
        shuffle(this.drawPile);
        this.distributeCards();
        
        // public game metadata
        this.currentPlayer = getRandomElementFromArray(this.players);

        console.log(`${this.name}: game started`);
    }

    distributeCards() {
        this.players.forEach(player => {
            if (player?.name == null) {
                return;
            }
            
            player.handCards = [];
            for (let i = 0; i < this.startingHandCards; i++) {
                player.handCards.push(<Card>this.drawPile.pop());
            }
        });

        this.discardPile.push(<Card>this.drawPile.pop());
    }
    
    getDeck() {
        return [
            // herz
            new Card(CardNumber.six, CardColor.herz),
            new Card(CardNumber.seven, CardColor.herz),
            new Card(CardNumber.eight, CardColor.herz),
            new Card(CardNumber.nine, CardColor.herz),
            new Card(CardNumber.ten, CardColor.herz),
            new Card(CardNumber.unter, CardColor.herz),
            new Card(CardNumber.ober, CardColor.herz),
            new Card(CardNumber.king, CardColor.herz),
            new Card(CardNumber.ace, CardColor.herz),
    
            // blatt
            new Card(CardNumber.six, CardColor.blatt),
            new Card(CardNumber.seven, CardColor.blatt),
            new Card(CardNumber.eight, CardColor.blatt),
            new Card(CardNumber.nine, CardColor.blatt),
            new Card(CardNumber.ten, CardColor.blatt),
            new Card(CardNumber.unter, CardColor.blatt),
            new Card(CardNumber.ober, CardColor.blatt),
            new Card(CardNumber.king, CardColor.blatt),
            new Card(CardNumber.ace, CardColor.blatt),
            
            // eichel
            new Card(CardNumber.six, CardColor.eichel),
            new Card(CardNumber.seven, CardColor.eichel),
            new Card(CardNumber.eight, CardColor.eichel),
            new Card(CardNumber.nine, CardColor.eichel),
            new Card(CardNumber.ten, CardColor.eichel),
            new Card(CardNumber.unter, CardColor.eichel),
            new Card(CardNumber.ober, CardColor.eichel),
            new Card(CardNumber.king, CardColor.eichel),
            new Card(CardNumber.ace, CardColor.eichel),
            
            // scheln
            new Card(CardNumber.six, CardColor.schellen),
            new Card(CardNumber.seven, CardColor.schellen),
            new Card(CardNumber.eight, CardColor.schellen),
            new Card(CardNumber.nine, CardColor.schellen),
            new Card(CardNumber.ten, CardColor.schellen),
            new Card(CardNumber.unter, CardColor.schellen),
            new Card(CardNumber.ober, CardColor.schellen),
            new Card(CardNumber.king, CardColor.schellen),
            new Card(CardNumber.ace, CardColor.schellen)
        ]
    }
}