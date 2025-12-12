import React from 'react'
import Navbar from '../layout/NavBar'
import Sidebar from '../layout/Sidebar'

const Home = () => {
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-amber-50/80 flex flex-row mt-16">
                <Sidebar className="fixed" />
                <p className='text-2xl text-slate-900 p-6'>Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!Welcome to portal do aluno!</p>
            </div>
        </>
    )
}

export default Home