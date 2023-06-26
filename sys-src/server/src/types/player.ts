import type { Card } from "./card";

export class Player {
    id: string;
    name: string;
    handCards: Card[];
    ready: boolean;

    constructor(id: string, name : string) {
        this.id = id;
        this.name = name;
        this.handCards = [];
        this.ready = false;
    }
}