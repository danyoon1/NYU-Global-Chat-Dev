import { useEffect, useState } from "react";
import Select from 'react-select';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import useProfileOptions from "../hooks/useProfileOptions";

const USERS_URL = '/users';

const Profile = () => {

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const [school, setSchool] = useState(null);
    const [year, setYear] = useState(null);
    const [bio, setBio] = useState('');

    const [isValidSubmission, setIsValidSubmission] = useState(false);

    const { schoolOptions, yearOptions } = useProfileOptions();

    const dropdownStyles = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: 'black',
            borderColor: state.isFocused ? '#00ff33' : 'grey',
            boxShadow: 'none',
            '&:hover': { borderColor: '#00ff33' }
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isFocused ? '#3b383c' : 'black',
        }),
        menu: (baseStyles) => ({
            ...baseStyles,
            background: 'transparent',
            borderColor: '#00ff33'
        }),
        singleValue: (baseStyles) => ({
            ...baseStyles,
            color: '#00ff33'
        }),
        input: (baseStyles) => ({
            ...baseStyles,
            color: '#00ff33'
        })
    }

    useEffect(() => {

        const controller = new AbortController();

        const initializeProfile = async () => {

            try {
                const response = await axiosPrivate.get(`${USERS_URL}/getProfile/${auth.user}`, {
                    signal: controller.signal
                });

                setSchool(schoolOptions[response?.data?.school]);
                setYear(yearOptions[response?.data?.year]);
                setBio(response?.data?.bio);

            } catch (err) {
                if (err.code !== 'ERR_CANCELED') {
                    console.error(err);
                }
            }
        }

        initializeProfile();

        return () => {
            controller.abort();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsValidSubmission(true);

        try {
            const response = await axiosPrivate.post(`${USERS_URL}/setProfile`,
                JSON.stringify({ user: auth.user, school: school.value, year: year.value, bio })
            );

            setIsValidSubmission(false);
        } catch (err) {
            console.error(err);
            setIsValidSubmission(false);
        }
    }

    return (
        <section className='Profile'>
            <div className='profile-container'>
                <h2>Edit Profile</h2>
                <form className='profile-form' onSubmit={handleSubmit}>
                    <div className="profile-item">
                        <label htmlFor="school">
                            School:
                        </label>
                        <div className="dropdown-container">
                            <Select
                                className="profile-dropdown"
                                id='school'
                                options={schoolOptions}
                                onChange={setSchool}
                                value={school}
                                styles={dropdownStyles}
                            ></Select>
                        </div>
                    </div>
                    <div className="profile-item">
                        <label htmlFor="year">
                            Year:
                        </label>
                        <div className="dropdown-container">
                            <Select
                                className="profile-dropdown"
                                id='year'
                                options={yearOptions}
                                onChange={setYear}
                                value={year}
                                styles={dropdownStyles}
                            ></Select>
                        </div>
                    </div>
                    <div className="profile-item">
                        <label htmlFor="bio" id='bio-label'>
                            {`Biography: `}
                        </label>
                        <textarea
                            id='bio'
                            autoComplete="off"
                            onChange={(e) => setBio(e.target.value)}
                            value={bio}
                            maxLength={60}
                            placeholder="60 character maximum..."
                            cols={25}
                            rows={3}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isValidSubmission ? true : false}
                    >Save Changes</button>
                    <p className={isValidSubmission ? 'instructions' : 'offscreen'}>Waiting for server response... This may take a while...</p>
                </form>
            </div>
        </section>
    )
}

export default Profile