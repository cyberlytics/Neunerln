import type { Card } from "./card";

export class Player {
    id: string;
    name: string;
    handCards: Card[];

    constructor(id: string, name : string) {
        this.id = id;
        this.name = name;
        this.handCards = [];
    }
}