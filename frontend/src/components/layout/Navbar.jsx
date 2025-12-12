import { GraduationCap, User } from 'lucide-react';

const NavBar = () => {
    return (
        <header className="fixed top-0 z-60 w-full flex flex-row justify-between items-center h-16 bg-slate-900 text-8">
            <div className="flex ml-8 flex-row items-center cursor-pointer">
                <GraduationCap className="text-white w-8 h-8 mr-3" />
                <div className="text-white text-xl">Portal do Aluno</div>
            </div>
            <div className="mr-8">
                <User className="text-white w-8 h-8 cursor-pointer" />
            </div>
        </header>
    )
}

export default NavBar