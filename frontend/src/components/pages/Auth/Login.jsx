import { GraduationCap } from 'lucide-react';

const Login = () => {
    return (
        <div className="w-screen h-screen bg-amber-50 flex justify-center p-6 items-center bg-opacity-80">
            <div className="w-[600px]">
                <div className="space-y-4 bg-white p-12 rounded-md shadow-lg gap-1.5 flex flex-col items-center">
                    <GraduationCap className="text-slate-900 w-20 h-20" />
                    <h1 className="text-3xl text-slate-900 font-bold text-center">
                        PORTAL DO ALUNO
                    </h1>
                    <input
                        type="email"
                        placeholder="E-mail"
                        className="text-left text-slate-900 bg-gray-500/15 bg-opacity-15 p-2 rounded-md w-full outline-slate-900 px-4 py-2"
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        className="text-left text-slate-900 bg-gray-500/15 p-2 rounded-md w-full outline-slate-900 px-4 py-2"
                    />

                    <button className="text-center bg-slate-900 text-white p-2 rounded-md w-full py-2 cursor-pointer">
                        Login
                    </button>
                    <a href="" target="_blank"><p className="text-slate-900">Esqueceu sua senha?</p></a>

                </div>
            </div>
        </div>
    );
}

export default Login;
