import React, { useState } from 'react';
import { House, BookOpenCheck, ChartLine, AlarmClock, Pin, UserRoundPlus, Users, Grid2x2Plus, Book, FileArchive, Menu } from 'lucide-react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div
                className={`${isOpen ? "block" : "hidden"} fixed inset-0 bg-black/30 z-40 md:hidden`}
                onClick={() => setIsOpen(false)}
            ></div>
            <div>
                <Menu onClick={() => setIsOpen(!isOpen)} className={`${isOpen ? "hidden" : "block"} fixed mt-1.5 md:hidden lg:hidden rounded-lg bg-slate-900 p-1 text-white w-9 h-9 m-1.5 z-50`} />
            </div>
            <div className={`${isOpen ? "block rounded-md fixed top-16 h-full" : "hidden"} mr-1 bg-white shadow-lg md:block md:fixed md:top-16 md:h-full lg:fixed lg:top-16 lg:h-full lg:block z-50`}>
                <ul className='p-2'>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><House className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /> <p className='md:hidden lg:block'>Home</p> </li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><BookOpenCheck className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /> <p className='md:hidden lg:block'>Notas </p></li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><ChartLine className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /> <p className='md:hidden lg:block'>Frequências </p></li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><AlarmClock className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /> <p className='md:hidden lg:block'>Horários </p></li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><Pin className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /> <p className='md:hidden lg:block'>Avisos </p></li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><UserRoundPlus className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /> <p className='md:hidden lg:block'>Usuários </p></li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><Users className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /><p className='md:hidden lg:block'> Turmas</p> </li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><Book className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /><p className='md:hidden lg:block'> Disciplinas </p></li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><Grid2x2Plus className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /> <p className='md:hidden lg:block'> Matriculas </p> </li>
                    <li className='flex text-1 p-2 cursor-pointer m-1 border-white border-b-2 text-slate-900 hover:border-b-2 hover:border-slate-900 transition'><FileArchive className='md:block md:mr-0 lg:block w-6 h-6 mr-2 lg:mr-2' /><p className='md:hidden lg:block'> Materiais</p> </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar