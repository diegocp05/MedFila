import { useEffect, useState } from 'react';
import { Search, Calendar, FileText, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Consultation {
  id: string;
  createdAt: string;
  notes: string;
  diagnosis: string;
  prescription: string;
  doctor: { name: string; role: string };
}

interface PatientHistory {
  id: string;
  name: string;
  age: number;
  consultations: Consultation[];
}

export function History() {
  const [patients, setPatients] = useState<PatientHistory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const url = new URL('http://localhost:3334/api/consultations/history');
        if (search) url.searchParams.append('search', search);

        const res = await fetch(url.toString(), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Erro ao buscar histórico", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce simple
    const timeout = setTimeout(fetchHistory, 500);
    return () => clearTimeout(timeout);
  }, [search, token]);

  return (
    <div className="p-8 bg-zinc-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 flex items-center gap-3">
              <FileText className="text-teal-600 w-8 h-8" />
              Histórico de Pacientes
            </h1>
            <p className="text-zinc-500 mt-1">Consulte prontuários e atendimentos anteriores</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar paciente por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-zinc-300 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all shadow-sm bg-white"
            />
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 font-medium text-zinc-500">Carregando histórico...</div>
        ) : patients.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-zinc-300">
            <p className="text-zinc-500 text-lg font-medium">Nenhum registro encontrado.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {patients.map(patient => (
              <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="bg-zinc-50 border-b border-zinc-200 p-4 px-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-800">{patient.name}</h2>
                    <p className="text-sm text-zinc-500">{patient.age} anos</p>
                  </div>
                </div>
                
                <div className="p-6">
                  {patient.consultations.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">Nenhum prontuário registrado (provável evasão ou aguardando).</p>
                  ) : (
                    <div className="space-y-6">
                      {patient.consultations.map(consult => (
                        <div key={consult.id} className="relative pl-6 border-l-2 border-zinc-200 pb-2 last:pb-0">
                          <div className="absolute w-3 h-3 bg-teal-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-zinc-700 flex items-center gap-1.5 text-sm">
                              <Calendar className="w-4 h-4 text-zinc-400" />
                              {new Date(consult.createdAt).toLocaleDateString()} às {new Date(consult.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-medium">
                              Dr(a). {consult.doctor.name}
                            </span>
                          </div>
                          <div className="bg-zinc-50 rounded-lg p-4 text-sm text-zinc-700 border border-zinc-100">
                            <p className="mb-2"><strong className="text-zinc-800">Evolução:</strong> {consult.notes}</p>
                            {consult.diagnosis && <p className="mb-2"><strong className="text-zinc-800">Diagnóstico:</strong> {consult.diagnosis}</p>}
                            {consult.prescription && <p><strong className="text-zinc-800">Conduta:</strong> {consult.prescription}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
