import type { CardNumber } from "./cardNumber";
import type { CardColor } from "./cardColor";

export class Card {
    number: CardNumber;
    color: CardColor;

    constructor(number: CardNumber, color: CardColor) {
        this.number = number;
        this.color = color;
    }
}