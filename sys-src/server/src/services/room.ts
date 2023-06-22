import { Card } from "../types/card";
import { CardColor } from "../types/cardColor";
import { CardNumber } from "../types/cardNumber";
import { Player } from "src/types/player";
import { getRandomElementFromArray, shuffle } from "./helperFunctions";
import { randomUUID } from 'crypto';

export class Room {
    // room
    id: string;
    name: string;
    specialCards: string[];
    startingHandCards: number = 6;
    maxPlayers: number;
    players: Player[];
    
    // game
    choosenColor: string = '';
    playedseveninarow: number = 0;
    TenGiveCard:boolean = false;
    choosenPlayer: string = '';
    ingame: boolean = false;
    drawPile: Card[] = [];
    discardPile: Card[] = [];
    currentPlayer: Player | null = null;

    constructor(name: string, specialCards: string[], maxPlayers: number) {
        this.id = randomUUID();
        this.name = name;
        this.specialCards = specialCards;
        this.players = [];
        this.maxPlayers = maxPlayers;

        this.resetGame();
    }

    resetGame() {
        this.ingame = false;
        this.drawPile = this.getDeck();
        this.discardPile = [];
        this.currentPlayer = null;

        this.players.forEach(player => {
            player.handCards = [];
        });
    }

    playerCount() {
        return this.players.length;
    }

    isFull() {
        return (this.playerCount() >= this.maxPlayers);
    }

    isEveryPlayerReady() {
        return this.players.every(player => player.ready);
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
    
            // gras
            new Card(CardNumber.six, CardColor.gras),
            new Card(CardNumber.seven, CardColor.gras),
            new Card(CardNumber.eight, CardColor.gras),
            new Card(CardNumber.nine, CardColor.gras),
            new Card(CardNumber.ten, CardColor.gras),
            new Card(CardNumber.unter, CardColor.gras),
            new Card(CardNumber.ober, CardColor.gras),
            new Card(CardNumber.king, CardColor.gras),
            new Card(CardNumber.ace, CardColor.gras),
            
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