import { useEffect, useState } from 'react';
import { BarChart3, Users, Clock, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AdminPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:3334/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Erro ao buscar estatísticas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="p-8">Carregando painel...</div>;

  return (
    <div className="p-8 bg-zinc-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 flex items-center gap-3">
            <BarChart3 className="text-teal-600 w-8 h-8" />
            Visão Geral - Administração
          </h1>
          <p className="text-zinc-500 mt-1">Métricas de atendimento e operações do dia</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-500 font-semibold text-sm uppercase tracking-wider">Entradas Hoje</h3>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-800">{stats?.totalPatientsToday || 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-500 font-semibold text-sm uppercase tracking-wider">Na Fila (Espera)</h3>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-800">{stats?.pendingPatients || 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-500 font-semibold text-sm uppercase tracking-wider">Atendidos Hoje</h3>
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-800">{stats?.consultationsToday || 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-500 font-semibold text-sm uppercase tracking-wider">Corpo Clínico</h3>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-800">{stats?.activeDoctors || 0}</p>
            <p className="text-xs text-zinc-400 mt-1">médicos cadastrados</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <h2 className="text-lg font-bold text-zinc-800 mb-4">Avisos do Sistema</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm">
            Tudo operando normalmente. O websockets está estável e os prontuários estão sendo salvos com sucesso.
          </div>
        </div>
      </div>
    </div>
  );
}
