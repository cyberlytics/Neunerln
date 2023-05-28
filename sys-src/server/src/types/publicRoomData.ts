export class PublicRoomData {
    id: string;
    name: string;
    specialCards: string[];
    startingHandCards: number;
    currentPlayers: number;
    maxPlayers: number;
    
    constructor(id: string, name: string, specialCards: string[], startingHandCards: number, currentPlayers: number, maxPlayers: number) {
            this.id = id;
            this.name = name;
            this.startingHandCards = startingHandCards;
            this.specialCards = specialCards;
            this.currentPlayers = currentPlayers;
            this.maxPlayers = maxPlayers;
    }
}