import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const controller = new AbortController();

        const getAllUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                const userNames = response.data.map(user => user.username);
                setUsers(userNames);
            } catch (err) {
                if (err.code !== 'ERR_CANCELED') {
                    console.error(err);
                    navigate('/', { state: { from: location }, replace: true });
                }
            }
        }

        getAllUsers();

        return () => {
            controller.abort();
        }

    }, []);

    return (
        <article>
            <h2>List of All Users</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user}</li>)}
                    </ul>
                ) : (
                    <p>No users in database</p>
                )
            }
        </article>
    );
}

export default Users;