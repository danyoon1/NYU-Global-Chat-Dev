import { useState } from "react";

const Profile = () => {

    const [school, setSchool] = useState('');
    const [year, setYear] = useState('');
    const [bio, setBio] = useState('');

    return (
        <section className='Profile'>
            <div className='profile-container'>
                <h2>Edit Profile</h2>
                <form className='profile-form'>
                    <div>
                        <label htmlFor="school">
                            School:
                        </label>
                        <input
                            type="text"
                            id='school'
                            autoComplete="off"
                            onChange={(e) => setSchool(e.target.value)}
                            value={school}
                        />
                    </div>
                    <div>
                        <label htmlFor="year">
                            Year:
                        </label>
                        <input
                            type="text"
                            id='year'
                            autoComplete="off"
                            onChange={(e) => setYear(e.target.value)}
                            value={year}
                        />
                    </div>
                    <div>
                        <label htmlFor="bio">
                            Biography:
                        </label>
                        <input
                            type="text"
                            id='bio'
                            autoComplete="off"
                            onChange={(e) => setBio(e.target.value)}
                            value={bio}
                        />
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Profile