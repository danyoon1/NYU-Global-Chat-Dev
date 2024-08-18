import { Outlet } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    // strict mode counter
    const effectRan = useRef(false);

    useEffect(() => {

        if (!effectRan.current) {

            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }

            !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

            return () => {
                effectRan.current = true;
            }
        }

    }, []);

    return (
        <>
            {!isLoading
                ? <Outlet />
                : <p>Loading...</p>
            }
        </>
    )
}

export default PersistLogin