import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Game from '../game/Game.vue'
import { PublicGameMetadata } from '@/types/publicGameMetadata'
import { Card } from '@/types/card'
import { CardNumber } from '@/types/cardNumber'
import { CardColor } from '@/types/cardColor'


describe('Game', () => {
    it('loads props correctly', () => {
        const userName = 'foo';
        const publicGameMetadata = new PublicGameMetadata({}, 34, [ new Card(CardNumber.king, CardColor.herz)], [ userName ], userName);
        const handCards = [ new Card(CardNumber.king, CardColor.herz) ];

        const gameComponent = mount(Game, { props: { 
            userName: userName,
            publicGameMetadata: publicGameMetadata,
            handCards: handCards
        }});

        expect(gameComponent.props().userName).toBe(userName);

        expect(gameComponent.props().publicGameMetadata.drawingPileCount).toBe(34);
        expect(gameComponent.props().publicGameMetadata.discardPile.length).toBe(1);
        expect(gameComponent.props().publicGameMetadata.players.length).toBe(1);
        expect(gameComponent.props().publicGameMetadata.currentPlayerName).toBe(userName);

        expect(gameComponent.props().handCards.length == 1);
    })
})

describe('Game', () => {
    it('computes player correctly', () => {
        const userName = 'foo';
        const players = [ 'enemy1', userName, 'enemy2', 'enemy3' ];
        const publicGameMetadata = new PublicGameMetadata({}, 34, [ new Card(CardNumber.king, CardColor.herz)], players, 'enemy3');

        const gameComponent = mount(Game, { props: { 
            userName: userName,
            publicGameMetadata: publicGameMetadata
        }});

        expect(gameComponent.vm.player).toBe(userName);
    })
})

describe('Game', () => {
    it('computes unorderedEnemies correctly', () => {
        const userName = 'foo';
        const players = [ 'enemy1', userName, 'enemy2', 'enemy3' ];
        const publicGameMetadata = new PublicGameMetadata({}, 34, [ new Card(CardNumber.king, CardColor.herz)], players, 'enemy3');

        const gameComponent = mount(Game, { props: { 
            userName: userName,
            publicGameMetadata: publicGameMetadata
        }});

        expect(gameComponent.vm.unorderedEnemies).toEqual([ 'enemy1', 'enemy2', 'enemy3' ]);
    })
})

describe('Game', () => {
    it('computes orderedEnemies correctly', () => {
        const userName = 'foo';
        const players = [ 'enemy1', userName, 'enemy2', 'enemy3' ];
        const publicGameMetadata = new PublicGameMetadata({}, 34, [ new Card(CardNumber.king, CardColor.herz)], players, 'enemy3');

        const gameComponent = mount(Game, { props: { 
            userName: userName,
            publicGameMetadata: publicGameMetadata
        }});

        expect(gameComponent.vm.orderedEnemies).toEqual([ 'enemy2', 'enemy3', 'enemy1' ]);
    })
})
