import React from 'react'
import { House, BookOpenCheck, ChartLine, AlarmClock, Pin, UserRoundPlus, Users, Grid2x2Plus, Book, FileArchive } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className='bg-white w-1/9 pt-2 shadow-lg'>
            <ul className='p-2'>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><House className='w-6 h-6 mr-1' /> Home </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><BookOpenCheck className='w-6 h-6 mr-1' /> Notas </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><ChartLine className='w-6 h-6 mr-1' /> Frequências </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><AlarmClock className='w-6 h-6 mr-1' /> Horários </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><Pin className='w-6 h-6 mr-1' /> Avisos </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><UserRoundPlus className='w-6 h-6 mr-1' /> Usuários </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><Users className='w-6 h-6 mr-1' /> Turmas </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><Book className='w-6 h-6 mr-1' /> Disciplinas </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><Grid2x2Plus className='w-6 h-6 mr-1' /> Matriculas </li>
                <li className='flex text-1 p-2 cursor-pointer border-white border-b-2 text-slate-900 rounded-sm hover:bg-gray-100 hover:border-b-2 hover:border-slate-900 transition'><FileArchive className='w-6 h-6 mr-1' /> Materiais </li>
            </ul>
        </div>
    )
}

export default Sidebar