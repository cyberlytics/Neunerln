import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Lobby from '../game/Lobby.vue'
import { PublicRoomData } from '@/types/publicRoomData'


describe('Lobby', () => {
    it('computes players correctly', () => {
        const userName = 'foo';
        const publicRoomData = new PublicRoomData(userName, 'bar', [], 6, 0, 2);

        const lobbyComponent = mount(Lobby, { props: { 
            userName: userName,
             rooms: [ publicRoomData ]
        }});

        expect(lobbyComponent.props().rooms.length).toBe(1);
        expect(lobbyComponent.props().userName).toBe(userName);
    })
})
