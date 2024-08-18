import { io } from 'socket.io-client';

const URL = 'http://localhost:1738';
// const URL = 'https://nyu-global-chat-5zpe.onrender.com';

export const socket = io(URL, {
    autoConnect: false
});