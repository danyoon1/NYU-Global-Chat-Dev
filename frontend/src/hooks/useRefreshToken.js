import axios from '../api/axios';
import useAuth from './useAuth';
import { jwtDecode } from 'jwt-decode';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        const decoded = response?.data?.accessToken
            ? jwtDecode(response.data.accessToken)
            : undefined;

        setAuth({
            user: decoded.UserInfo.username,
            accessToken: response.data.accessToken,
            verification: response.data.verification
        });

        console.log(response.data.verification)

        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken;