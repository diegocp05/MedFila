import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Activity } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DOCTOR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3334/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }

      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row-reverse font-sans">
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 text-white max-w-md text-right">
          <Activity className="w-20 h-20 mb-8 ml-auto" />
          <h1 className="text-5xl font-bold mb-4">Junte-se ao MedFila</h1>
          <p className="text-blue-100 text-xl font-medium leading-relaxed">
            Faça parte da revolução no atendimento hospitalar. Crie sua conta para gerenciar filas e otimizar o tempo dos pacientes e médicos.
          </p>
        </div>
      </div>
      
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-zinc-800">Criar Conta</h2>
            <p className="text-zinc-500 mt-2 font-medium">Preencha seus dados profissionais</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">E-mail Profissional</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Senha Segura</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Cargo / Perfil</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium bg-white"
              >
                <option value="DOCTOR">Médico / Corpo Clínico</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 text-lg mt-2"
            >
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
            
            <div className="text-center mt-6">
              <span className="text-zinc-500 font-medium">Já tem uma conta? </span>
              <Link to="/login" className="text-blue-600 font-bold hover:underline transition-all">
                Faça login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
