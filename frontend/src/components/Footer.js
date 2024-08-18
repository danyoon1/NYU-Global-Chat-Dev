import React from 'react'

const Footer = () => {
    const today = new Date();

    return (
        <div className='Footer'><a href="https://www.youtube.com/watch?v=X5-xWQMpmgo" target='_blank' rel='noreferrer'>Copyright &copy; {today.getFullYear()}</a></div>
    )
}

export default Footer