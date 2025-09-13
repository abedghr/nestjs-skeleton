import { Injectable } from '@nestjs/common';

@Injectable()
export class UserStatusService {
    constructor() {}

    async setUserOnline(userId: string, socketId: string) {
        return {userId, socketId}
    }

    async setUserOffline(userId: string) {
        return userId
    }

    async updateLastSeen(userId: string){
        return userId;
    }

    async getOnlineUsers() {
    }
}
