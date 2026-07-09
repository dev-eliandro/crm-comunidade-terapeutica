/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Acolhido, 
  ActivityRecord, 
  IncidentRecord, 
  OutingRecord, 
  Medication, 
  EvolutionRecord, 
  FamilyCommunication,
  ResidentStatus
} from '../types';
import { 
  Printer, 
  Calendar, 
  Pill, 
  HeartHandshake, 
  User, 
  FileText, 
  Clock, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle,
  Upload,
  ArrowLeft,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import PrintView from './PrintView';

interface ResidentProfileProps {
  resident: Acolhido;
  onBack: () => void;
  onUpdateResident: (updated: Acolhido) => void;
}

export default function ResidentProfile({ resident, onBack, onUpdateResident }: ResidentProfileProps) {
  const [activeSubTab, setActiveSubTab] = useState<'prontuario' | 'psa' | 'frequencia' | 'medicacao' | 'desligamento'>('prontuario');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printAnexoType, setPrintAnexoType] = useState<'ALL' | 'I' | 'II' | 'III' | 'IV' | 'V'>('ALL');

  // Input States for adding sub-records
  const [newActivityType, setNewActivityType] = useState<'recreativa' | 'desenvolvimento_interior' | 'autocuidado' | 'capacitacao'>('recreativa');
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityResp, setNewActivityResp] = useState('');
  const [newActivityObs, setNewActivityObs] = useState('');

  const [newIncSituation, setNewIncSituation] = useState('');
  const [newIncStrategy, setNewIncStrategy] = useState('');
  const [newIncForward, setNewIncForward] = useState('');

  const [newOutingCompanion, setNewOutingCompanion] = useState('');
  const [newOutingTime, setNewOutingTime] = useState('');
  const [newOutingObs, setNewOutingObs] = useState('');

  const [newMedNome, setNewMedNome] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedFreq, setNewMedFreq] = useState(24);
  const [newMedTime1, setNewMedTime1] = useState('08:00');
  const [newMedTime2, setNewMedTime2] = useState('20:00');
  const [newMedTime3, setNewMedTime3] = useState('14:00');
  const [newMedTime4, setNewMedTime4] = useState('22:00');
  const [newMedObs, setNewMedObs] = useState('');

  const [newEvText, setNewEvText] = useState('');
  const [newEvProf, setNewEvProf] = useState('');

  // Photo uploading helper
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updated = { ...resident, fotoUrl: base64String };
        onUpdateResident(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. ADDING ACTIVITIES
  const handleAddActivity = () => {
    if (!newActivityName || !newActivityResp) return;
    const newAct: ActivityRecord = {
      id: `act-${Date.now()}`,
      tipo: newActivityType,
      atividade: newActivityName,
      data: new Date().toISOString().split('T')[0],
      responsavel: newActivityResp,
      observacoes: newActivityObs
    };
    const updated = {
      ...resident,
      atividades: [...(resident.atividades || []), newAct]
    };
    onUpdateResident(updated);
    setNewActivityName('');
    setNewActivityResp('');
    setNewActivityObs('');
  };

  const handleDeleteActivity = (id: string) => {
    const updated = {
      ...resident,
      atividades: (resident.atividades || []).filter(a => a.id !== id)
    };
    onUpdateResident(updated);
  };

  // 2. ADDING BEHAVIORAL INCIDENTS (Intercorrências)
  const handleAddIncident = () => {
    if (!newIncSituation || !newIncStrategy) return;
    const newInc: IncidentRecord = {
      id: `inc-${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      situacaoOcorrida: newIncSituation,
      estrategiasAdotadas: newIncStrategy,
      encaminhamentosRealizados: newIncForward
    };
    const updated = {
      ...resident,
      intercorrencias: [...(resident.intercorrencias || []), newInc]
    };
    onUpdateResident(updated);
    setNewIncSituation('');
    setNewIncStrategy('');
    setNewIncForward('');
  };

  const handleDeleteIncident = (id: string) => {
    const updated = {
      ...resident,
      intercorrencias: (resident.intercorrencias || []).filter(i => i.id !== id)
    };
    onUpdateResident(updated);
  };

  // 3. ADDING EXTERNAL OUTINGS (Saídas)
  const handleAddOuting = () => {
    if (!newOutingCompanion || !newOutingTime) return;
    const newOut: OutingRecord = {
      id: `out-${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      acompanhante: newOutingCompanion,
      horarioSaidaRetorno: newOutingTime,
      observacoes: newOutingObs
    };
    const updated = {
      ...resident,
      saidasExternas: [...(resident.saidasExternas || []), newOut]
    };
    onUpdateResident(updated);
    setNewOutingCompanion('');
    setNewOutingTime('');
    setNewOutingObs('');
  };

  const handleDeleteOuting = (id: string) => {
    const updated = {
      ...resident,
      saidasExternas: (resident.saidasExternas || []).filter(o => o.id !== id)
    };
    onUpdateResident(updated);
  };

  // 4. PRESCRIBE MEDICATIONS
  const handlePrescribeMedication = () => {
    if (!newMedNome || !newMedDose) return;
    
    // Determine schedules array based on selected hours frequency
    let schedules: string[] = [];
    if (newMedFreq === 24) {
      schedules = [newMedTime1];
    } else if (newMedFreq === 12) {
      schedules = [newMedTime1, newMedTime2];
    } else if (newMedFreq === 8) {
      schedules = [newMedTime1, newMedTime3, newMedTime2];
    } else if (newMedFreq === 6) {
      schedules = [newMedTime1, newMedTime3, newMedTime2, newMedTime4];
    }

    const newMed: Medication = {
      id: `${resident.id}-med-${Date.now()}`,
      nome: newMedNome,
      dosagem: newMedDose,
      frequenciaHoras: newMedFreq,
      horarios: schedules,
      dataInicio: new Date().toISOString().split('T')[0],
      ativo: true,
      observacoes: newMedObs,
      alertasAtivos: true
    };

    const updated = {
      ...resident,
      medicacoes: [...(resident.medicacoes || []), newMed]
    };
    
    onUpdateResident(updated);
    setNewMedNome('');
    setNewMedDose('');
    setNewMedFreq(24);
    setNewMedObs('');
  };

  const handleToggleMedicationStatus = (medId: string) => {
    const updatedMeds = (resident.medicacoes || []).map(med => {
      if (med.id === medId) {
        return { ...med, ativo: !med.ativo };
      }
      return med;
    });
    onUpdateResident({ ...resident, medicacoes: updatedMeds });
  };

  const handleDeleteMedication = (medId: string) => {
    const updated = {
      ...resident,
      medicacoes: (resident.medicacoes || []).filter(m => m.id !== medId)
    };
    onUpdateResident(updated);
  };

  // 5. ATTENDANCE SELECTION (Anexo IV Frequência)
  const handleAttendanceChange = (day: number, val: 'Presente' | 'Ausente' | 'Falta Justificada' | '') => {
    const currentMonthYear = '07/2026'; // Default reference month
    
    let updatedFreqs = [...(resident.frequencias || [])];
    let monthFreq = updatedFreqs.find(f => f.periodoReferencia === currentMonthYear);
    
    if (!monthFreq) {
      monthFreq = {
        periodoReferencia: currentMonthYear,
        registro: {}
      };
      updatedFreqs.push(monthFreq);
    }

    monthFreq.registro[day] = val;

    onUpdateResident({ ...resident, frequencias: updatedFreqs });
  };

  // 6. ADDING EVOLUTIONS
  const handleAddEvolution = () => {
    if (!newEvText || !newEvProf) return;
    const newEv: EvolutionRecord = {
      id: `ev-${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      profissional: newEvProf,
      registro: newEvText
    };
    const updated = {
      ...resident,
      evolucoes: [...(resident.evolucoes || []), newEv]
    };
    onUpdateResident(updated);
    setNewEvText('');
    setNewEvProf('');
  };

  // 7. DISCHARGE / TERMINATION EXECUTION
  const handleExecuteDischarge = (modalidade: Acolhido['psaDesligamentoModalidade']) => {
    if (!modalidade) return;
    const updated: Acolhido = {
      ...resident,
      status: 'Inativo',
      progressoPorcentagem: modalidade === 'Desligamento planejado' ? 100 : resident.progressoPorcentagem,
      psaDesligamentoModalidade: modalidade,
      psaDesligamentoCondicoes: resident.psaDesligamentoCondicoes || 'Acolhimento encerrado nesta data.',
      psaDesligamentoParecerFinal: resident.psaDesligamentoParecerFinal || 'Caso concluído e arquivado.'
    };
    onUpdateResident(updated);
  };

  // Helpers to fetch current month frequency
  const currentMonthFreq = resident.frequencias?.find(f => f.periodoReferencia === '07/2026')?.registro || {};

  return (
    <div className="space-y-6" id="resident-profile-detail">
      
      {/* Print Overlay Modal */}
      {showPrintModal && (
        <PrintView 
          resident={resident} 
          anexoType={printAnexoType} 
          onClose={() => setShowPrintModal(false)} 
        />
      )}

      {/* Top action header bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          id="btn-back-to-list"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Lista</span>
        </button>
        
        {/* Printable dropdown/actions */}
        <div className="flex items-center gap-2">
          <select
            value={printAnexoType}
            onChange={(e) => setPrintAnexoType(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-white/5 rounded-lg text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">Ficha Cadastral Completa</option>
            <option value="I">Anexo I: Solicitação de Vaga</option>
            <option value="II">Anexo II: Atestado de Saúde</option>
            <option value="III">Anexo III: Prontuário</option>
            <option value="IV">Anexo IV: Registro Frequência</option>
            <option value="V">Anexo V: Plano Singular (PSA)</option>
          </select>

          <button 
            onClick={() => setShowPrintModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            id="btn-trigger-print"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir / Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Profile summary card */}
      <div className="bg-[#15181E] rounded-2xl border border-white/5 p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Avatar/photo display and upload */}
        <div className="md:col-span-3 flex flex-col items-center space-y-3 border-r border-white/5 md:pr-6">
          <div className="relative h-28 w-28 rounded-full bg-slate-800 overflow-hidden border-2 border-indigo-500/30 flex items-center justify-center group shadow-inner">
            {resident.fotoUrl ? (
              <img src={resident.fotoUrl} alt={resident.usuarioNome} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="h-12 w-12 text-slate-500" />
            )}
            
            {/* Hover overlay upload */}
            <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
              <Upload className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase mt-1">Carregar Foto</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </label>
          </div>
          <div className="text-center">
            <h2 className="text-base font-bold text-white tracking-tight leading-tight">{resident.usuarioNome}</h2>
            {resident.usuarioNomeSocial && (
              <span className="text-xs text-slate-500 block font-medium mt-0.5">"{resident.usuarioNomeSocial}"</span>
            )}
            <div className="mt-2.5">
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                resident.status === 'Ativo' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : resident.status === 'Inativo'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {resident.status === 'Ativo' ? 'Acolhido Ativo' : resident.status === 'Inativo' ? 'Inativo / Histórico' : 'Aguardando Regulação'}
              </span>
            </div>
          </div>
        </div>

        {/* Essential parameters cards */}
        <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs text-slate-300">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CPF do Acolhido</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">{resident.usuarioCPF}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">RG e Naturalidade</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">{resident.usuarioRG || 'S/RG'} • {resident.usuarioNaturalidade || 'Não informada'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Data Nascimento / Idade</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              {resident.usuarioDataNascimento ? new Date(resident.usuarioDataNascimento).toLocaleDateString('pt-BR') : 'Não cadastrado'} 
              {resident.usuarioDataNascimento && ` (${new Date().getFullYear() - new Date(resident.usuarioDataNascimento).getFullYear()} anos)`}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Origem do Encaminhamento</span>
            <span className="font-semibold text-slate-200 mt-0.5 block truncate" title={resident.solicitanteEquipamento}>{resident.solicitanteEquipamento || 'Demanda Espontânea'} ({resident.solicitanteMunicipio})</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Atestado Médico / CID</span>
            <span className="font-semibold text-slate-200 mt-0.5 block truncate" title={resident.saudeCID}>{resident.saudeMedicoNome ? `Dr(a). ${resident.saudeMedicoNome.split(' ').slice(-1)[0]}` : 'Sem atestado'} • {resident.saudeCID ? resident.saudeCID.split(' ')[0] : 'S/CID'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Data de Ingresso</span>
            <span className="font-semibold text-indigo-400 font-mono mt-0.5 block">{resident.prontuarioDataIngresso ? new Date(resident.prontuarioDataIngresso).toLocaleDateString('pt-BR') : 'Não informada'}</span>
          </div>

          {/* Progress bar */}
          {resident.status === 'Ativo' && (
            <div className="col-span-2 sm:col-span-3 border-t border-white/5 pt-3">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mb-1">
                <span>ESTÁGIO PROGRESSIVO DO PLANO SINGULAR (PSA)</span>
                <span className="font-bold text-slate-200 font-mono">{resident.progressoPorcentagem}% Concluído</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      resident.progressoPorcentagem <= 30 ? 'bg-rose-500' :
                      resident.progressoPorcentagem <= 70 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${resident.progressoPorcentagem}%` }}
                  ></div>
                </div>
                {/* Simulated progress editor slider */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={resident.progressoPorcentagem} 
                  onChange={(e) => onUpdateResident({ ...resident, progressoPorcentagem: parseInt(e.target.value) })}
                  className="w-20 accent-indigo-500 h-1 cursor-pointer"
                  title="Ajustar progresso de forma manual"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Internal record sub-navigation tabs */}
      <div className="border-b border-white/5 flex overflow-x-auto scrollbar-none gap-6">
        {[
          { id: 'prontuario', title: 'Prontuário & Atividades (Anexo III)', icon: FileText },
          { id: 'psa', title: 'Plano Singular - PSA (Anexo V)', icon: HeartHandshake },
          { id: 'frequencia', title: 'Frequência do Mês (Anexo IV)', icon: Calendar },
          { id: 'medicacao', title: 'Medicações Prescritas', icon: Pill },
          { id: 'desligamento', title: 'Conclusão / Desligamento', icon: XCircle }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isSelected 
                  ? 'border-indigo-400 text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: PRONTUARIO & ACTIVITIES (ANEXO III) */}
      {activeSubTab === 'prontuario' && (
        <div className="space-y-6 animate-fadeIn" id="profile-chart-tab">
          
          {/* Main Info Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Details */}
            <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 space-y-3.5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-1.5">Cadastro de Admissão (Anexo I)</h3>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                <div>
                  <span className="font-bold text-slate-500 text-[10px] block">NOME SOCIAL</span>
                  <span>{resident.usuarioNomeSocial || 'Nenhum'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[10px] block">ESTADO CIVIL</span>
                  <span>{resident.usuarioEstadoCivil}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[10px] block">SEXO BIOLÓGICO</span>
                  <span>{resident.usuarioSexoBiologico}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[10px] block">IDENTIDADE GÊNERO</span>
                  <span>{resident.usuarioIdentidadeGenero}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[10px] block">TELEFONE</span>
                  <span>{resident.usuarioTelefone || 'Não possui'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[10px] block">CADÚNICO?</span>
                  <span>{resident.usuarioPossuiCadastroUnico}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-500 text-[10px] block">ENDEREÇO</span>
                  <span>{resident.usuarioEndereco} {resident.usuarioNumero && `, ${resident.usuarioNumero}`} - {resident.usuarioBairro}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-500 text-[10px] block">REDE DE APOIO</span>
                  <div className="space-y-1 mt-1">
                    {resident.redeApoio?.length === 0 ? (
                      <span className="text-slate-500 italic">Nenhuma informada</span>
                    ) : (
                      resident.redeApoio?.map((r, idx) => (
                        <div key={idx} className="bg-slate-900/50 px-2 py-1 rounded-sm border border-white/5 flex justify-between">
                          <span>{r.nome} <strong className="text-slate-400">({r.parentesco})</strong></span>
                          <span className="font-mono text-slate-400">{r.telefone}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Health Evaluation & Case Summary */}
            <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-1.5">Laudo de Aptidão Médica (Anexo II)</h3>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 mt-2.5">
                  <div>
                    <span className="font-bold text-slate-500 text-[10px] block">MÉDICO RESPONSÁVEL</span>
                    <span>{resident.saudeMedicoNome || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 text-[10px] block">CRM DO MÉDICO</span>
                    <span>{resident.saudeMedicoCRM || 'Não informado'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold text-slate-500 text-[10px] block">DIAGNÓSTICO COMPATÍVEL (CID-10)</span>
                    <span className="font-semibold text-indigo-400">{resident.saudeCID || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-1.5">Relato do Caso de Admissão</h3>
                <p className="text-xs text-slate-400 leading-relaxed text-justify mt-2 font-serif italic">
                  "{resident.relatoCaso || 'Nenhum relato inicial cadastrado.'}"
                </p>
              </div>
            </div>

          </div>

          {/* Activities logging table */}
          <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2">Registro Diário de Atividades (Anexo III - Itens 2.1 a 2.4)</h3>
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Eixo Temático</label>
                <select
                  value={newActivityType}
                  onChange={(e) => setNewActivityType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                >
                  <option value="recreativa">2.1 Atividades Recreativas (Esporte, Lazer)</option>
                  <option value="desenvolvimento_interior">2.2 Desenvolvimento Interior (Rodas, Espiritualidade)</option>
                  <option value="autocuidado">2.3 Autocuidado e Sociabilidade (Higiene, Convivência)</option>
                  <option value="capacitacao">2.4 Aprendizagem / Capacitação (Oficinas, Cursos)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Nome da Atividade</label>
                <input
                  type="text"
                  placeholder="Ex: Oficina de Panificação"
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Profissional Responsável</label>
                <input
                  type="text"
                  placeholder="Ex: Claudio (Psicólogo)"
                  value={newActivityResp}
                  onChange={(e) => setNewActivityResp(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Observações complementares..."
                  value={newActivityObs}
                  onChange={(e) => setNewActivityObs(e.target.value)}
                  className="flex-1 mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
                <button
                  onClick={handleAddActivity}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {/* Activities display list */}
            {resident.atividades?.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">Nenhuma atividade registrada para este acolhido no prontuário.</div>
            ) : (
              <div className="border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
                {resident.atividades?.map(act => (
                  <div key={act.id} className="p-3 bg-[#0A0B0E] flex items-start justify-between gap-4 text-xs text-slate-300 hover:bg-white/5 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                          act.tipo === 'recreativa' ? 'bg-amber-500/10 text-amber-400' :
                          act.tipo === 'desenvolvimento_interior' ? 'bg-purple-500/10 text-purple-400' :
                          act.tipo === 'autocuidado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          {act.tipo === 'recreativa' ? 'Recreativa' :
                           act.tipo === 'desenvolvimento_interior' ? 'Dev. Interior' :
                           act.tipo === 'autocuidado' ? 'Autocuidado' : 'Capacitação'}
                        </span>
                        <span className="font-semibold text-slate-200">{act.atividade}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(act.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="text-slate-400 mt-1">Responsável: <strong className="text-slate-300">{act.responsavel}</strong></div>
                      {act.observacoes && <p className="text-slate-500 italic mt-0.5">Obs: "{act.observacoes}"</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="text-rose-400 hover:text-rose-350 hover:bg-white/5 p-1.5 rounded-sm cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Intercorrências & Saídas row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Intercorrências (Incidents) */}
            <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">3. Intercorrências & Conflitos (Anexo III)</h3>
              </div>
              
              <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Adicionar Ocorrência</span>
                <input
                  type="text"
                  placeholder="Situação ocorrida (Ex: Crise de fissura intensa)"
                  value={newIncSituation}
                  onChange={(e) => setNewIncSituation(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 placeholder:text-slate-550 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="Estratégias adotadas pela equipe de monitoramento"
                  value={newIncStrategy}
                  onChange={(e) => setNewIncStrategy(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 placeholder:text-slate-550 focus:outline-hidden"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Encaminhamentos efetuados"
                    value={newIncForward}
                    onChange={(e) => setNewIncForward(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 placeholder:text-slate-550 focus:outline-hidden"
                  />
                  <button
                    onClick={handleAddIncident}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3 rounded-md cursor-pointer"
                  >
                    Gravar
                  </button>
                </div>
              </div>

              {resident.intercorrencias?.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">Nenhuma intercorrência clínica registrada.</div>
              ) : (
                <div className="space-y-3.5">
                  {resident.intercorrencias?.map(inc => (
                    <div key={inc.id} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg text-xs space-y-1.5 text-slate-300">
                      <div className="flex justify-between items-center text-slate-500">
                        <span className="font-bold text-rose-400 font-mono">OCORRÊNCIA EM {new Date(inc.data).toLocaleDateString('pt-BR')}</span>
                        <button onClick={() => handleDeleteIncident(inc.id)} className="text-rose-400 hover:text-rose-350 cursor-pointer">Excluir</button>
                      </div>
                      <p className="text-slate-200"><strong>Fato:</strong> {inc.situacaoOcorrida}</p>
                      <p className="text-slate-300"><strong>Conduta:</strong> {inc.estrategiasAdotadas}</p>
                      {inc.encaminhamentosRealizados && <p className="text-slate-400"><strong>Destino:</strong> {inc.encaminhamentosRealizados}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saídas Externas (Outings) */}
            <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">4. Registro de Saídas Externas (Anexo III)</h3>
              </div>
              
              <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Nova Autorização de Saída</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nome do Acompanhante"
                    value={newOutingCompanion}
                    onChange={(e) => setNewOutingCompanion(e.target.value)}
                    className="px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 placeholder:text-slate-550 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Horário (Ex: 14:00 às 18:00)"
                    value={newOutingTime}
                    onChange={(e) => setNewOutingTime(e.target.value)}
                    className="px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 placeholder:text-slate-550 focus:outline-hidden"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Observações complementares..."
                    value={newOutingObs}
                    onChange={(e) => setNewOutingObs(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 placeholder:text-slate-550 focus:outline-hidden"
                  />
                  <button
                    onClick={handleAddOuting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 rounded-md cursor-pointer"
                  >
                    Gravar
                  </button>
                </div>
              </div>

              {resident.saidasExternas?.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">Nenhuma saída externa autorizada.</div>
              ) : (
                <div className="space-y-3.5">
                  {resident.saidasExternas?.map(out => (
                    <div key={out.id} className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-xs space-y-1.5 text-slate-300">
                      <div className="flex justify-between items-center text-slate-500">
                        <span className="font-bold text-indigo-400 font-mono">SAÍDA EM {new Date(out.data).toLocaleDateString('pt-BR')}</span>
                        <button onClick={() => handleDeleteOuting(out.id)} className="text-rose-400 hover:text-rose-350 cursor-pointer">Excluir</button>
                      </div>
                      <p className="text-slate-200"><strong>Acompanhante:</strong> {out.acompanhante}</p>
                      <p className="text-slate-300"><strong>Período:</strong> {out.horarioSaidaRetorno}</p>
                      {out.observacoes && <p className="text-slate-400 italic">"Obs: {out.observacoes}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: PLANO SINGULAR PSA (ANEXO V) */}
      {activeSubTab === 'psa' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2">Plano Singular de Atendimento - Detalhamento de Substâncias (Anexo V)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5">
                <span className="font-bold text-slate-500 text-[10px] uppercase block">História do Problema Atual (Último uso)</span>
                <p className="text-slate-200 font-medium mt-1">{resident.psaHistoriaProblemaAtualUltimoUso || 'Não informado'}</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5">
                <span className="font-bold text-slate-500 text-[10px] uppercase block">Tentativas Anteriores de Abstinência</span>
                <p className="text-slate-200 font-medium mt-1">{resident.psaTentativasAnterioresAbstinencia || 'Não informado'}</p>
              </div>
            </div>

            {/* Selected Substance List table */}
            <div className="border border-white/5 bg-[#0A0B0E] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#15181E] border-b border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3">Substância Ativa</th>
                    <th className="p-3">Idade Início</th>
                    <th className="p-3">Padrão de Uso / Frequência</th>
                    <th className="p-3">Quantidade Média</th>
                    <th className="p-3">Via Administração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {resident.psaHistoricoSubstancias?.filter(s => s.selecionado).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500 text-xs">Nenhuma substância declarada no prontuário.</td>
                    </tr>
                  ) : (
                    resident.psaHistoricoSubstancias?.filter(s => s.selecionado).map(s => (
                      <tr key={s.substancia} className="hover:bg-white/5">
                        <td className="p-3 font-semibold text-slate-200">{s.substancia}</td>
                        <td className="p-3 font-mono">{s.idadeInicio || 'Não informada'} anos</td>
                        <td className="p-3">{s.frequencia || 'Não informada'} ({s.padraoUso || 'não definido'})</td>
                        <td className="p-3">{s.quantidadeMedia || 'Não informada'}</td>
                        <td className="p-3">{s.viaAdministracao || 'Não informada'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {resident.psaGastoMedioSubstancias && (
              <div className="text-xs text-slate-300 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                Gasto mensal médio estimado com substâncias: <strong className="text-amber-400">R$ {resident.psaGastoMedioSubstancias}</strong>.
              </div>
            )}
          </div>

          {/* Objectives, targets & clinical evolution feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Objectives & targets */}
            <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2">Objetivos do Acolhimento</h3>
                <p className="text-xs text-slate-300 mt-2 text-justify leading-relaxed">{resident.psaObjetivosGerais || 'Não cadastrados.'}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2">Metas Pactuadas (PSA Item 5.1)</h3>
                <div className="space-y-2 mt-2">
                  {resident.psaMetasIndividualizadas?.filter(Boolean).length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Nenhuma meta pactuada para este ciclo.</span>
                  ) : (
                    resident.psaMetasIndividualizadas?.filter(Boolean).map((m, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="h-5 w-5 bg-indigo-500/15 rounded-full flex items-center justify-center font-bold font-mono text-indigo-400 text-[10px] mt-0.5 flex-shrink-0">{idx + 1}</span>
                        <p className="mt-0.5">{m}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Evolução Diária/Semanal (Item 7.1) */}
            <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Evolução do Quadro & Atendimento (Item 7.1)</h3>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Escrever Evolução Multidisciplinar</span>
                <textarea
                  placeholder="Descrever o progresso clínico, humor, comportamento ou intercorrência terapêutica recente..."
                  value={newEvText}
                  onChange={(e) => setNewEvText(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden font-sans leading-relaxed"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Profissional e Registro (Ex: Claudio CRP-08)"
                    value={newEvProf}
                    onChange={(e) => setNewEvProf(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                  />
                  <button
                    onClick={handleAddEvolution}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 rounded-md cursor-pointer"
                  >
                    Evoluir
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {resident.evolucoes?.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-500">Nenhuma evolução registrada para este ciclo.</div>
                ) : (
                  resident.evolucoes?.map(ev => (
                    <div key={ev.id} className="p-3 bg-[#0A0B0E] border border-white/5 rounded-lg text-xs space-y-1.5 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-center text-slate-500 text-[10px]">
                        <span className="font-mono">{new Date(ev.data).toLocaleDateString('pt-BR')}</span>
                        <span className="font-semibold text-slate-300">{ev.profissional}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-serif italic">"{ev.registro}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: MONTHLY ATTENDANCE GRID (ANEXO IV) */}
      {activeSubTab === 'frequencia' && (
        <div className="space-y-6 animate-fadeIn" id="frequency-card-tab">
          <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-3 gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Anexo IV - Registro de Frequência Diária do Mês</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Clique nas células para alternar a frequência do acolhido no mês de referência atual (Julho/2026).</p>
              </div>
              <div className="flex gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 bg-emerald-500 rounded-xs"></span> Presente</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 bg-rose-500 rounded-xs"></span> Ausente</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 bg-amber-500 rounded-xs"></span> Justificado</span>
              </div>
            </div>

            {/* Calendar Grid Representation */}
            <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-8 gap-2">
              {Array.from({ length: 31 }, (_, i) => {
                const dayNum = i + 1;
                const recordValue = currentMonthFreq[dayNum] || '';
                
                return (
                  <div 
                    key={dayNum} 
                    className="border border-white/5 rounded-lg overflow-hidden flex flex-col items-stretch text-center bg-slate-900 shadow-2xs"
                  >
                    <div className="bg-[#15181E] text-[10px] font-bold text-slate-400 py-1 border-b border-white/5">DIA {dayNum}</div>
                    
                    <select
                      value={recordValue}
                      onChange={(e) => handleAttendanceChange(dayNum, e.target.value as any)}
                      className={`p-2 text-xs font-semibold focus:outline-hidden text-center cursor-pointer appearance-none ${
                        recordValue === 'Presente' ? 'bg-emerald-500/10 text-emerald-400' :
                        recordValue === 'Ausente' ? 'bg-rose-500/10 text-rose-400' :
                        recordValue === 'Falta Justificada' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-950 text-slate-500'
                      }`}
                    >
                      <option value="">Anotar</option>
                      <option value="Presente">Presente</option>
                      <option value="Ausente">Ausente</option>
                      <option value="Falta Justificada">Justificado</option>
                    </select>
                  </div>
                );
              })}
            </div>

            {/* Attendance statistics summary */}
            <div className="bg-[#0A0B0E] border border-white/5 rounded-lg p-4 flex flex-col sm:flex-row justify-around text-center text-xs gap-4 mt-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Dias Registrados</span>
                <span className="text-base font-bold text-slate-200 mt-1 block">
                  {Object.values(currentMonthFreq).filter(Boolean).length} / 31 dias
                </span>
              </div>
              <div className="border-r border-white/5 hidden sm:block h-10 self-center"></div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase text-emerald-400">Presenças</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">
                  {Object.values(currentMonthFreq).filter(v => v === 'Presente').length} dias
                </span>
              </div>
              <div className="border-r border-white/5 hidden sm:block h-10 self-center"></div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase text-rose-400">Ausências</span>
                <span className="text-base font-bold text-rose-400 mt-1 block">
                  {Object.values(currentMonthFreq).filter(v => v === 'Ausente').length} dias
                </span>
              </div>
              <div className="border-r border-white/5 hidden sm:block h-10 self-center"></div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase text-amber-400">Justificados</span>
                <span className="text-base font-bold text-amber-400 mt-1 block">
                  {Object.values(currentMonthFreq).filter(v => v === 'Falta Justificada').length} dias
                </span>
              </div>
            </div>

            {/* General Comments */}
            <div className="space-y-1 pt-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase">Observações Gerais de Frequência Diária</label>
              <textarea
                value={resident.prontuarioObservacoesGerais || ''}
                onChange={(e) => onUpdateResident({ ...resident, prontuarioObservacoesGerais: e.target.value })}
                placeholder="Insira detalhes sobre faltas justificadas, saídas médicas prolongadas ou de ressocialização no período do mês..."
                rows={2}
                className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 bg-slate-950 text-slate-200 placeholder:text-slate-650 rounded-lg focus:outline-hidden leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MEDICATION BOARD & DISPENSARY */}
      {activeSubTab === 'medicacao' && (
        <div className="space-y-6 animate-fadeIn" id="medications-card-tab">
          
          <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2">Prescrever Nova Medicação</h3>
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Nome do Medicamento</label>
                <input
                  type="text"
                  placeholder="Ex: Sertralina"
                  value={newMedNome}
                  onChange={(e) => setNewMedNome(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Dosagem</label>
                <input
                  type="text"
                  placeholder="Ex: 50mg ou 10 gotas"
                  value={newMedDose}
                  onChange={(e) => setNewMedDose(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Intervalo (Frequência)</label>
                <select
                  value={newMedFreq}
                  onChange={(e) => setNewMedFreq(parseInt(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                >
                  <option value={24}>Uma vez ao dia (24h/24h)</option>
                  <option value={12}>Duas vezes ao dia (12h/12h)</option>
                  <option value={8}>Três vezes ao dia (8h/8h)</option>
                  <option value={6}>Quatro vezes ao dia (6h/6h)</option>
                </select>
              </div>
              <div>
                <button
                  onClick={handlePrescribeMedication}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Prescrever Medicamento
                </button>
              </div>
            </div>

            {/* Custom Scheduled Hours based on frequency */}
            <div className="bg-[#0A0B0E] p-3 rounded-lg border border-white/5 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider block">Estipular Horários de Administração (Simulados para Alertas):</span>
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-[9px] text-slate-500 font-bold uppercase">Horário 1</label>
                  <input type="text" value={newMedTime1} onChange={(e) => setNewMedTime1(e.target.value)} className="w-16 px-1.5 py-0.5 mt-0.5 border border-white/5 text-center rounded bg-slate-950 text-slate-200 focus:outline-hidden" />
                </div>
                {newMedFreq <= 12 && (
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase">Horário 2</label>
                    <input type="text" value={newMedTime2} onChange={(e) => setNewMedTime2(e.target.value)} className="w-16 px-1.5 py-0.5 mt-0.5 border border-white/5 text-center rounded bg-slate-950 text-slate-200 focus:outline-hidden" />
                  </div>
                )}
                {newMedFreq <= 8 && (
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase">Horário 3</label>
                    <input type="text" value={newMedTime3} onChange={(e) => setNewMedTime3(e.target.value)} className="w-16 px-1.5 py-0.5 mt-0.5 border border-white/5 text-center rounded bg-slate-950 text-slate-200 focus:outline-hidden" />
                  </div>
                )}
                {newMedFreq <= 6 && (
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase">Horário 4</label>
                    <input type="text" value={newMedTime4} onChange={(e) => setNewMedTime4(e.target.value)} className="w-16 px-1.5 py-0.5 mt-0.5 border border-white/5 text-center rounded bg-slate-950 text-slate-200 focus:outline-hidden" />
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Observações de aplicação (Ex: Tomar após as refeições)"
                value={newMedObs}
                onChange={(e) => setNewMedObs(e.target.value)}
                className="w-full mt-2 px-3 py-1.5 border border-white/5 rounded bg-slate-950 text-slate-200 placeholder:text-slate-650 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Active Prescriptions list */}
          <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2">Medicamentos Ativos sob Administração da CT</h3>
            
            {resident.medicacoes?.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">Não há medicações prescritas para este acolhido no momento.</div>
            ) : (
              <div className="border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
                {resident.medicacoes?.map(med => (
                  <div key={med.id} className="p-4 bg-[#0A0B0E] flex items-center justify-between gap-4 text-xs text-slate-300 hover:bg-white/5 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${med.ativo ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                        <span className="font-semibold text-slate-200 text-sm">{med.nome} ({med.dosagem})</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-sm">De {med.frequenciaHoras}/{med.frequenciaHoras}h</span>
                      </div>
                      <div className="text-slate-400 mt-1">Horários agendados: <span className="font-mono font-semibold text-slate-300">{med.horarios.join(' • ')}</span></div>
                      {med.observacoes && <p className="text-slate-500 italic mt-0.5">Orientação: "{med.observacoes}"</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleMedicationStatus(med.id)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-md transition-colors cursor-pointer border ${
                          med.ativo 
                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20'
                        }`}
                      >
                        {med.ativo ? 'Suspender' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleDeleteMedication(med.id)}
                        className="text-rose-400 hover:text-rose-350 p-1.5 hover:bg-white/5 rounded-md cursor-pointer"
                        title="Remover Prescrição"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT: DISCHARGE / TERMINATION ACTION (ANEXO III & V SECTION 9) */}
      {activeSubTab === 'desligamento' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2">Informações sobre Desligamento ou Encerramento do Caso (Anexo V - Item 9)</h3>
            
            {resident.status === 'Inativo' ? (
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-emerald-450 font-bold text-sm">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-400">Acolhimento Concluído (Inativo)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Este registro já foi encerrado e desligado. Os dados históricos permanecem arquivados em conformidade com as diretrizes da SEDEF.
                </p>
                <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-emerald-500/15">
                  <div><strong>Modalidade de Encerramento:</strong> {resident.psaDesligamentoModalidade}</div>
                  <div><strong>Condições do Desligamento:</strong> {resident.psaDesligamentoCondicoes}</div>
                  <div><strong>Parecer Final da Equipe:</strong> {resident.psaDesligamentoParecerFinal}</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ao encerrar o período de acolhimento (término do cronograma de 6 meses) ou em caso de evasão/solicitação voluntária de saída, preencha as condições abaixo para arquivamento definitivo do prontuário:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase">Condições Gerais de Saída do Acolhido</label>
                    <input
                      type="text"
                      placeholder="Ex: Concluiu os 6 meses, lúcido e reabilitado"
                      value={resident.psaDesligamentoCondicoes || ''}
                      onChange={(e) => onUpdateResident({ ...resident, psaDesligamentoCondicoes: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase">Parecer Final Multidisciplinar da Equipe</label>
                    <textarea
                      placeholder="Descrever a síntese final do acompanhamento realizado, reintegração de vínculos e plano preventivo..."
                      value={resident.psaDesligamentoParecerFinal || ''}
                      onChange={(e) => onUpdateResident({ ...resident, psaDesligamentoParecerFinal: e.target.value })}
                      rows={3}
                      className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden leading-relaxed font-sans"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">Escolha a Modalidade para Efetuar o Desligamento:</span>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => handleExecuteDischarge('Desligamento planejado')}
                      className="bg-emerald-650 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Dar Alta Terapêutica Programada
                    </button>
                    <button
                      onClick={() => handleExecuteDischarge('Solicitação do acolhido')}
                      className="bg-amber-650 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Efetuar Desligamento a Pedido
                    </button>
                    <button
                      onClick={() => handleExecuteDischarge('Evasão')}
                      className="bg-rose-650 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Registrar Evasão / Fuga consumada
                    </button>
                    <button
                      onClick={() => handleExecuteDischarge('Descumprimento das normas')}
                      className="bg-purple-650 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Desligar por Descumprimento de Normas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
