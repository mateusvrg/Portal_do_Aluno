import React from 'react'
import Navbar from '../layout/NavBar'
import Sidebar from '../layout/Sidebar'

const Home = () => {
    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="min-h-screen">Home</div>
        </>
    )
}

export default Home