import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stethoscope, CheckCircle2 } from 'lucide-react';

const checkinSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  age: z.number().min(0, "Idade inválida"),
  symptoms: z.array(z.string()).min(1, "Selecione ao menos um sintoma")
});

type CheckinData = z.infer<typeof checkinSchema>;

const availableSymptoms = [
  { id: 'dor_no_peito', label: 'Dor no peito ou aperto' },
  { id: 'falta_de_ar', label: 'Falta de ar intensa' },
  { id: 'desmaio', label: 'Desmaio ou confusão mental' },
  { id: 'febre_alta', label: 'Febre alta (> 39ºC)' },
  { id: 'dor_intensa', label: 'Dor intensa e súbita' },
  { id: 'sangramento', label: 'Sangramento ativo' },
  { id: 'tosse', label: 'Tosse persistente' },
  { id: 'coriza', label: 'Coriza / Sintomas gripais' },
  { id: 'dor_leve', label: 'Dor leve a moderada' }
];

export function Checkin() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CheckinData>({
    resolver: zodResolver(checkinSchema),
    defaultValues: { symptoms: [] }
  });

  const selectedSymptoms = watch('symptoms');

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setValue('symptoms', selectedSymptoms.filter(s => s !== id), { shouldValidate: true });
    } else {
      setValue('symptoms', [...selectedSymptoms, id], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CheckinData) => {
    try {
      const res = await fetch('http://localhost:3334/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      alert("Erro de conexão");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-zinc-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-zinc-800">Check-in Realizado!</h2>
          <p className="text-zinc-500 mb-6 font-medium">Por favor, aguarde ser chamado no painel pelo médico.</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg font-semibold w-full shadow-lg shadow-blue-500/30">
            Novo Check-in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-zinc-50 font-sans">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center shadow-inner">
          <div className="bg-white/20 p-4 rounded-full inline-block mb-4 shadow-lg">
            <Stethoscope className="w-10 h-10 mx-auto opacity-100" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Autoatendimento</h1>
          <p className="opacity-90 mt-2 font-medium text-blue-50">Preencha seus dados para entrar na fila inteligente</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Nome Completo</label>
              <input type="text" {...register('name')} className="w-full border border-zinc-300 rounded-xl p-3.5 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Digite seu nome completo" />
              {errors.name && <span className="text-red-500 text-xs mt-1.5 font-medium block">{errors.name.message}</span>}
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Idade</label>
              <input type="number" {...register('age', { valueAsNumber: true })} className="w-full border border-zinc-300 rounded-xl p-3.5 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ex: 35" />
              {errors.age && <span className="text-red-500 text-xs mt-1.5 font-medium block">{errors.age.message}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-4">O que você está sentindo? (Marque todos que se aplicam)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {availableSymptoms.map(s => {
                const isSelected = selectedSymptoms.includes(s.id);
                return (
                  <div 
                    key={s.id} 
                    onClick={() => toggleSymptom(s.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm shadow-blue-500/10' : 'bg-white border-zinc-200 hover:border-blue-300 hover:bg-zinc-50'}`}
                  >
                    <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-zinc-600'}`}>{s.label}</span>
                  </div>
                )
              })}
            </div>
            {errors.symptoms && <span className="text-red-500 text-xs mt-2 font-medium block">{errors.symptoms.message}</span>}
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 active:scale-[0.98] text-lg">
            {isSubmitting ? 'Registrando na fila...' : 'Confirmar e Entrar na Fila'}
          </button>
        </form>
      </div>
    </div>
  );
}
