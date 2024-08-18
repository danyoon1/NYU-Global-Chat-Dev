import Nav from './Nav';
import Footer from './Footer';
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <main className='App'>
            <Nav />
            <Outlet />
            <Footer />
        </main>
    )
}

export default Layout