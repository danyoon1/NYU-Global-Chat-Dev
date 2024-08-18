import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('');
    }

    return (
        <nav>
            <ul className='nav-list'>
                <li className='nav-left'><Link to='/'>Home</Link></li>
                {!auth?.user
                    ? (
                        <>
                            <li className='nav-right'><Link to='register'>Register</Link></li>
                            <li className='nav-right'><Link to='login'>Login</Link></li>
                        </>
                    )
                    : (
                        <>
                            <li className='nav-right'>Logged in as {auth.user}</li>
                            <li className='nav-right'><Link to='profile'><span>Profile</span></Link></li>
                            <li className='nav-right'><Link><span onClick={signOut}>Logout</span></Link></li>
                        </>
                    )
                }

            </ul>
        </nav>
    )
}

export default Nav