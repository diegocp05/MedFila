import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, ArrowLeft, Save, User, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const consultationSchema = z.object({
  notes: z.string().min(5, 'Prontuário deve ter pelo menos 5 caracteres'),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  action: z.enum(['DISMISSED', 'COMPLETED'])
});

type ConsultationData = z.infer<typeof consultationSchema>;

export function ConsultationRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ConsultationData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { action: 'COMPLETED' }
  });

  useEffect(() => {
    // Buscar detalhes do paciente (reaproveitando a fila por enquanto)
    const fetchPatient = async () => {
      try {
        const res = await fetch('http://localhost:3334/api/patients/queue');
        const queue = await res.json();
        const p = queue.find((q: any) => q.id === id);
        if (p) setPatient(p);
      } catch (err) {
        console.error("Erro ao buscar paciente", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const onSubmit = async (data: ConsultationData) => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3334/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: id,
          ...data
        })
      });

      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      alert("Erro ao salvar consulta");
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!patient) return <div className="p-8">Paciente não encontrado ou já finalizado.</div>;

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-zinc-500 hover:text-teal-600 mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a Fila
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Info Paciente */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-800 mb-1">{patient.name}</h2>
              <p className="text-zinc-500 mb-6">{patient.age} anos</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Motivo da Triagem</label>
                  <div className="flex flex-wrap gap-2">
                    {patient.symptoms.map((s: string) => (
                      <span key={s} className="bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-md text-xs font-medium">
                        {s.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Chegada</label>
                  <p className="text-sm text-zinc-700 flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-zinc-400" />
                    {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Prontuário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="border-b border-zinc-100 bg-zinc-50/50 p-6 flex items-center gap-3">
                <Activity className="text-teal-600 w-6 h-6" />
                <h1 className="text-xl font-bold text-zinc-800">Prontuário Eletrônico</h1>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-zinc-700 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-zinc-400" />
                    Evolução / Anotações Clínicas *
                  </label>
                  <textarea 
                    {...register('notes')}
                    rows={6}
                    className="w-full border border-zinc-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none text-sm"
                    placeholder="Descreva o quadro clínico, exame físico e evolução..."
                  />
                  {errors.notes && <span className="text-red-500 text-xs mt-1 block">{errors.notes.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Hipótese Diagnóstica</label>
                    <input 
                      {...register('diagnosis')}
                      type="text"
                      className="w-full border border-zinc-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-sm"
                      placeholder="Ex: Amigdalite Bacteriana, CID-10..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Desfecho</label>
                    <select 
                      {...register('action')}
                      className="w-full border border-zinc-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-sm bg-white"
                    >
                      <option value="COMPLETED">Alta / Encaminhado</option>
                      <option value="DISMISSED">Evasão / Desistência</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Receituário / Conduta</label>
                  <textarea 
                    {...register('prescription')}
                    rows={4}
                    className="w-full border border-zinc-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none text-sm"
                    placeholder="Medicamentos prescritos ou orientações de alta..."
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Salvando...' : 'Salvar Prontuário'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
