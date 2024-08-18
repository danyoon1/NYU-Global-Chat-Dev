import { useState, useEffect, useRef } from 'react';
import { socket } from './Socket';
import { jwtDecode } from 'jwt-decode';
import useAuth from '../hooks/useAuth';

const COLOR_CODES = {
    'User': 0,
    'Admin': 1
}

const Chat = () => {

    const { auth } = useAuth();

    const [connected, setConnected] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const [msgHistory, setMsgHistory] = useState([]);
    const [numUsers, setNumUsers] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [typingUsers, setTypingUsers] = useState([]);
    const [bottom, setBottom] = useState(true);
    const [activityTimer, setActivityTimer] = useState(null);

    const initCon = useRef(false);
    const msgRef = useRef();
    const endRef = useRef(null);

    useEffect(() => {

        if (!initCon.current) {
            socket.connect();
            msgRef.current.focus();

            socket.once('connect', () => {
                setConnected(true);
                socket.emit('initializeUser', {
                    name: auth.user,
                    roles: jwtDecode(auth?.accessToken)?.UserInfo?.roles
                });
            });
        }

        return () => {
            if (initCon.current) {
                socket.removeAllListeners();
                socket.disconnect(true);
                initCon.current = false;
            }
            initCon.current = true;
        }
    }, []);

    useEffect(() => {
        if (bottom) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [msgHistory]);

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 10;
        setBottom(bottom);
    }

    const sendActivity = () => {
        socket.emit('activity', auth.user);

        clearTimeout(activityTimer);
        let timer = setTimeout(() => {
            socket.emit('stopActivity', auth.user);
        }, 1500);
        setActivityTimer(timer);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (msgInput) {
            socket.emit('message', {
                name: auth.user,
                text: msgInput
            });
            setMsgInput('');
        }
        msgRef.current.focus();
    }

    socket.on('disconnect', () => {
        setConnected(false);
    });

    socket.on('message', (data) => {
        setMsgHistory([
            ...msgHistory,
            { name: data.name, text: data.text, color: data.color, time: data.time }
        ]);
    });

    socket.on('updateActivity', (users) => {
        setTypingUsers(users.filter((user) => user.slice(0, user.length - 1) !== auth.user));
    });

    socket.on('updateConnections', (data) => {
        setNumUsers(data.count);
        setIsLoading(false);
    });

    socket.on('displayMessages', (data) => {
        setMsgHistory(data.messages.map((msg) => (
            { name: msg.sender, text: msg.message, color: msg.color, time: msg.datetime.slice(-8) }
        )));
    });

    return (
        <section className='Chat'>
            <p className='online'>{`Online Users: ${isLoading ? 'Loading...' : numUsers}`}</p>
            <div className='chat-container' onScroll={handleScroll}>
                <ul className='chat-display'>
                    {msgHistory.map((msg, i) => (
                        <li key={i}>
                            <span
                                className={`${msg.color === 1 ? 'admin' : 'user'} msg-name`}>
                                {`${msg.name}`}
                            </span>
                            <span className='msg-separator'>:</span>
                            <span className='msg-text'>{msg.text}</span>
                            <span className='msg-time'>{msg.time}</span>
                        </li>
                    ))}
                </ul>
                <div
                    className='chat-end'
                    ref={endRef}
                />
            </div>
            <ul className='activity'>{
                typingUsers.length > 0 && typingUsers.length === 1
                    ? <li key={typingUsers[0]}>
                        <span>
                            <span className={parseInt(typingUsers[0].slice(-1)) === COLOR_CODES.Admin ? 'admin' : 'user'}>
                                {`${typingUsers[0].slice(0, typingUsers[0].length - 1)}`}
                            </span>{' is typing...'}
                        </span>
                    </li>
                    : typingUsers.map((user, i) => {
                        const name = user.slice(0, user.length - 1);
                        const color = parseInt(user.slice(-1));
                        console.log(color)
                        if (i === 0) {
                            return (
                                <li key={name}>
                                    <span className={color === COLOR_CODES.Admin ? 'admin' : 'user'}>
                                        {name}
                                    </span>
                                </li>)
                        } else if (i === typingUsers.length - 1) {
                            return (
                                <li key={name}>
                                    <span>{', '}
                                        <span className={color === COLOR_CODES.Admin ? 'admin' : 'user'}>
                                            {name}
                                        </span> {' are typing...'}
                                    </span>
                                </li>
                            )
                        } else {
                            return (
                                <li key={name}>
                                    <span>{', '}
                                        <span className={color === COLOR_CODES.Admin ? 'admin' : 'user'}>
                                            {name}
                                        </span>
                                    </span>
                                </li>
                            )
                        }
                    })
            }</ul>
            <form className='chat-form' onSubmit={sendMessage}>
                <input
                    type='text'
                    id='message'
                    className='chat-input'
                    placeholder='Your message...'
                    onChange={(e) => setMsgInput(e.target.value)}
                    value={msgInput}
                    required
                    ref={msgRef}
                    autoComplete='off'
                    onKeyDown={sendActivity}
                />
                <button type='submit' className='chat-submit'>Send</button>
            </form>
        </section>
    )
}

export default Chat