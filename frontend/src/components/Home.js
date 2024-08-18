import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react";
import useAuth from '../hooks/useAuth';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { auth } = useAuth();
    const dialogRef = useRef(null);

    const toggleDialog = () => {
        if (!dialogRef.current) {
            return;
        }

        dialogRef.current.hasAttribute('open')
            ? dialogRef.current.close()
            : dialogRef.current.showModal();
    }

    const enterChat = () => {
        if (!auth?.user) {
            navigate('login', { state: { from: location }, replace: true });
        } else if (!auth?.verification) {
            toggleDialog();
        } else {
            navigate('chat');
        }
    }

    return (
        <section className="Home">
            <h1><span>NYU</span><br /><span>Global Chat</span></h1>
            <p id='description'>NYU Global Chat is an open source project designed to allow unrestricted communication
                exclusively between members of the NYU community.</p>
            <button id='enter' onClick={enterChat}><span>Enter Chat</span></button>
            <dialog
                className="dialog"
                ref={dialogRef}
                onClick={(e) => {
                    if (e.currentTarget === e.target) toggleDialog();
                }}>
                <div className='dialog-box'>
                    <span className='dialog-text'>Please verify your email.</span>
                    <button className='dialog-button' onClick={toggleDialog}>Close</button>
                </div>
            </dialog>
        </section>
    )
}

export default Home