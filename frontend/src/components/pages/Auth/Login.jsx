import { GraduationCap } from 'lucide-react';
import { useState } from 'react';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login realizado com sucesso!');
                console.log(data.token);

                localStorage.setItem('meuToken', data.token);

            } else {
                alert('Erro: ' + data.message);
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        }
    }
    return (
        <div className="w-screen h-screen bg-amber-50 flex justify-center p-6 items-center bg-opacity-80">
            <div className="w-[600px]">
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-12 rounded-md shadow-lg gap-1.5 flex flex-col items-center">

                    <GraduationCap className="text-slate-900 w-20 h-20" />
                    <h1 className="text-3xl text-slate-900 font-bold text-center">
                        PORTAL DO ALUNO
                    </h1>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-left text-slate-900 bg-gray-100 bg-opacity-15 p-2 rounded-md w-full outline-slate-900 px-4 py-2"
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-left text-slate-900 bg-gray-100 p-2 rounded-md w-full outline-slate-900 px-4 py-2"
                    />

                    <button className="text-center bg-slate-900 text-white p-2 rounded-md w-full py-2 cursor-pointer">
                        Login
                    </button>
                    <a type='submit'><p className="text-slate-900">Esqueceu sua senha?</p></a>

                </form>
            </div>
        </div>
    );
}

export default Login;
