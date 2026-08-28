import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Check, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string[];
  riskScore: number;
  colorCode: 'RED' | 'YELLOW' | 'GREEN' | 'ORANGE' | 'BLUE';
  status: string;
  createdAt: string;
}

const colorMap = {
  RED: 'bg-red-500 border-red-600',
  ORANGE: 'bg-orange-500 border-orange-600',
  YELLOW: 'bg-yellow-500 border-yellow-600',
  GREEN: 'bg-green-500 border-green-600',
  BLUE: 'bg-blue-500 border-blue-600',
};

const labelMap = {
  RED: 'Emergência (0 min)',
  ORANGE: 'Muito Urgente (10 min)',
  YELLOW: 'Urgente (60 min)',
  GREEN: 'Pouco Urgente (120 min)',
  BLUE: 'Não Urgente (240 min)',
};

export function Dashboard() {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useAuth();

  const fetchQueue = async () => {
    try {
      const res = await fetch('http://localhost:3334/api/patients/queue');
      const data = await res.json();
      setQueue(data);
    } catch (error) {
      console.error("Erro ao buscar fila", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    const socket = io('http://localhost:3334');
    
    socket.on('queue_updated', () => {
      fetchQueue();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    await fetch(`http://localhost:3334/api/patients/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 flex items-center gap-3">
              <Activity className="text-blue-600 w-8 h-8" />
              Painel de Triagem
            </h1>
            <p className="text-zinc-500 mt-1">Fila de espera em tempo real</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-zinc-200 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold text-zinc-700 truncate max-w-[150px]">{user?.name}</span>
            </div>
            <button onClick={logout} className="p-2.5 text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-white border border-zinc-200 shadow-sm">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 font-medium text-zinc-500">Carregando fila...</div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {queue.map(patient => (
                <motion.div
                  key={patient.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-white rounded-xl shadow-md border border-zinc-200 overflow-hidden flex flex-col md:flex-row"
                >
                  <div className={`w-full md:w-4 ${colorMap[patient.colorCode]} transition-colors`} />
                  
                  <div className="p-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-zinc-800">{patient.name}</h3>
                        <span className="bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded text-sm font-semibold">{patient.age} anos</span>
                      </div>
                      <p className="text-zinc-500 text-sm mb-3">Sintomas: {patient.symptoms.map(s => s.replace(/_/g, ' ')).join(', ')}</p>
                      
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className={`px-2.5 py-1 rounded-full text-white ${colorMap[patient.colorCode].split(' ')[0]}`}>
                          {labelMap[patient.colorCode]}
                        </span>
                        <span className="flex items-center gap-1 text-zinc-500 ml-2">
                          <Clock className="w-4 h-4" />
                          {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
                      <button 
                        onClick={() => updateStatus(patient.id, 'IN_CONSULTATION')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-4 py-2.5 rounded-lg transition-colors border border-blue-200"
                      >
                        <Check className="w-5 h-5" />
                        Chamar
                      </button>
                      <button 
                        onClick={() => updateStatus(patient.id, 'DISMISSED')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 font-semibold px-4 py-2.5 rounded-lg transition-colors border border-zinc-200"
                      >
                        <X className="w-5 h-5" />
                        Dispensar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {queue.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-zinc-300">
                <p className="text-zinc-500 text-lg font-medium">Nenhum paciente na fila no momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
