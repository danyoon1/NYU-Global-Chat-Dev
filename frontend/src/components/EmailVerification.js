import { useState } from "react";
import axios from '../api/axios';
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const EMAIL_URL = '/verification';

const EmailVerification = () => {

    const { auth, setAuth } = useAuth();

    const { username } = useParams();
    const { token } = useParams();
    const navigate = useNavigate();

    const [validationFailed, setValidationFailed] = useState(false);

    // test on production
    const activateVerification = () => {
        verifyEmailToken(username, token);
    }

    const verifyEmailToken = async (user, emailToken) => {
        const verificationInfo = {
            username: user,
            emailToken
        }

        try {
            const response = await axios.post(EMAIL_URL, verificationInfo,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (response.status === 201) {
                setAuth({
                    ...auth,
                    verification: true
                });
                navigate('../../login');
            }
        } catch (err) {
            console.error(err);
            setValidationFailed(true);
        }
    }

    return (
        <div>
            {!validationFailed
                ? <section className="Verification">
                    <span>Click the button to verify your email.</span>
                    <br />
                    <button onClick={activateVerification}>Verify</button>
                </section>
                : <section className="Verification">Verification token expired.</section>
            }
        </div>
    )
}

export default EmailVerification