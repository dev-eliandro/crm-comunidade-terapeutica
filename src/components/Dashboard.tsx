/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Acolhido, MedicationLog, Medication } from '../types';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Pill, 
  Activity, 
  Calendar,
  PhoneCall,
  CheckCircle,
  FileText
} from 'lucide-react';

interface DashboardProps {
  acolhidos: Acolhido[];
  onSelectAcolhido: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
  medicationLogs: MedicationLog[];
  onAdministerMedication: (logId: string) => void;
  onAddFamilyCommunication: (residentId: string, comm: Omit<import('../types').FamilyCommunication, 'id'>) => void;
}

export default function Dashboard({ 
  acolhidos, 
  onSelectAcolhido, 
  onNavigateToTab,
  medicationLogs,
  onAdministerMedication 
  , onAddFamilyCommunication
}: DashboardProps) {

  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const active = acolhidos.filter(a => a.status === 'Ativo');
    const inactive = acolhidos.filter(a => a.status === 'Inativo');
    const pending = acolhidos.filter(a => a.status === 'Aguardando Vaga');
    
    // Graduated vs other inactive reasons
    const graduated = inactive.filter(a => a.psaDesligamentoModalidade === 'Desligamento planejado').length;
    const evasions = inactive.filter(a => a.psaDesligamentoModalidade === 'Evasão').length;
    const others = inactive.length - graduated - evasions;

    // Bed capacity (set to 50 vagas)
    const capacity = 50;
    const occupancyRate = active.length > 0 ? Math.round((active.length / capacity) * 100) : 0;

    // Average progress of active residents
    const avgProgress = active.length > 0 
      ? Math.round(active.reduce((acc, a) => acc + a.progressoPorcentagem, 0) / active.length) 
      : 0;

    return {
      activeCount: active.length,
      inactiveCount: inactive.length,
      pendingCount: pending.length,
      graduated,
      evasions,
      others,
      occupancyRate,
      avgProgress,
      capacity
    };
  }, [acolhidos]);

  // Substance prevalence
  const substanceStats = useMemo(() => {
    const active = acolhidos.filter(a => a.status === 'Ativo');
    const counts: { [key: string]: number } = {};
    
    active.forEach(a => {
      a.psaHistoricoSubstancias?.forEach(s => {
        if (s.selecionado) {
          counts[s.substancia] = (counts[s.substancia] || 0) + 1;
        }
      });
    });

    const sorted = Object.entries(counts)
      .map(([substancia, count]) => ({
        substancia,
        count,
        percentage: active.length > 0 ? Math.round((count / active.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    return sorted;
  }, [acolhidos]);

  // Stage distribution
  const stages = useMemo(() => {
    const active = acolhidos.filter(a => a.status === 'Ativo');
    let early = 0; // 0-30%
    let mid = 0;   // 31-70%
    let late = 0;  // 71-100%

    active.forEach(a => {
      if (a.progressoPorcentagem <= 30) early++;
      else if (a.progressoPorcentagem <= 70) mid++;
      else late++;
    });

    return [
      { name: 'Adaptação / Desintoxicação (0-30%)', count: early, color: 'bg-rose-500' },
      { name: 'Desenvolvimento Interior (31-70%)', count: mid, color: 'bg-amber-500' },
      { name: 'Ressocialização / Conclusão (71-100%)', count: late, color: 'bg-emerald-500' }
    ];
  }, [acolhidos]);

  // Medication Alerts (use real system time)
  const medAlerts = useMemo(() => {
    // Overdue or pending medications for active residents right now
    const nowDate = now;
    
    // Filter logs for active residents
    const activeIds = new Set(acolhidos.filter(a => a.status === 'Ativo').map(a => a.id));
    
    const relevantLogs = medicationLogs.filter(log => {
      const parts = log.medicationId.split('-');
      const residentId = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : parts[0];
      const isForActive = activeIds.has(residentId);
      return isForActive;
    });

    const overdue = relevantLogs.filter(log => {
      if (log.status === 'Administrado') return false;
      const prevTime = new Date(log.horarioPrevisto);
      // If simulated time is after scheduled time and not administered
      return now.getTime() > prevTime.getTime();
    });

    const pendingSoon = relevantLogs.filter(log => {
      if (log.status === 'Administrado') return false;
      const prevTime = new Date(log.horarioPrevisto);
      const diffMs = prevTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      // Due in the next 3 hours
      return diffMs >= 0 && diffHours <= 3;
    });

    return {
      overdue,
      pendingSoon
    };
  }, [medicationLogs, acolhidos, now]);

  // Recent incidents (Anexo III intercorrencias) across all active residents
  const recentIncidents = useMemo(() => {
    const list: { residentName: string; residentId: string; data: string; situacao: string }[] = [];
    acolhidos.filter(a => a.status === 'Ativo').forEach(a => {
      a.intercorrencias?.forEach(i => {
        list.push({
          residentName: a.usuarioNome,
          residentId: a.id,
          data: i.data,
          situacao: i.situacaoOcorrida
        });
      });
    });
    return list.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 4);
  }, [acolhidos]);

  // Recent family communications
  const recentCommunications = useMemo(() => {
    const list: { residentName: string; residentId: string; data: string; nomeContactado: string; assunto: string }[] = [];
    acolhidos.filter(a => a.status === 'Ativo').forEach(a => {
      a.comunicacoesFamilia?.forEach(c => {
        list.push({
          residentName: a.usuarioNome,
          residentId: a.id,
          data: c.data,
          nomeContactado: c.nomeContactado,
          assunto: c.assunto
        });
      });
    });
    return list.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 4);
  }, [acolhidos]);

  // Local state for adding family contact
  const [showAddContact, setShowAddContact] = React.useState(false);
  const [formResidentId, setFormResidentId] = React.useState<string>(acolhidos.find(a => a.status === 'Ativo')?.id || '');
  const [formNome, setFormNome] = React.useState('');
  const [formData, setFormData] = React.useState(() => new Date().toISOString().slice(0,10));
  const [formAssunto, setFormAssunto] = React.useState('');
  const [formProfissional, setFormProfissional] = React.useState('');

  const submitContact = () => {
    if (!formResidentId || !formNome) return;
    onAddFamilyCommunication(formResidentId, { id: '', data: formData, nomeContactado: formNome, assunto: formAssunto, profissional: formProfissional });
    setFormNome(''); setFormAssunto(''); setFormProfissional(''); setShowAddContact(false);
  };

  const totalDosesToday = medicationLogs.length;
  const administeredDoses = medicationLogs.filter(l => l.status === 'Administrado').length;
  const adherenceRate = totalDosesToday > 0 ? Math.round((administeredDoses / totalDosesToday) * 100) : 100;

  return (
    <div className="space-y-6 text-slate-200" id="dashboard-tab">
      
      {/* Top Banner with Simulated Time */}
      <div className="bg-gradient-to-r from-indigo-950/60 to-[#0F1116] border border-white/5 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight font-sans text-white">Painel de Monitoramento Clínico</h1>
          <p className="text-indigo-200 text-sm mt-1">CRM unificado de regulação e acompanhamento terapêutico de acolhidos.</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <Clock className="h-5 w-5 text-indigo-400" />
          <div>
            <div className="text-xs text-indigo-300 font-mono">HORA DO SISTEMA</div>
            <div className="text-base font-semibold font-mono tracking-wider text-indigo-200">
              {now.toLocaleDateString('pt-BR')} {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Residents Card */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 flex items-center gap-4 hover:border-white/10 transition-all" id="stat-active-residents">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Acolhidos Ativos</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-200">{stats.activeCount}</span>
              <span className="text-xs text-slate-400">/ {stats.capacity} leitos</span>
            </div>
            <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">{stats.occupancyRate}% de ocupação</span>
          </div>
        </div>

        {/* Inactive / Graduated */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 flex items-center gap-4 hover:border-white/10 transition-all">
          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
            <UserMinus className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Histórico (Inativos)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-200">{stats.inactiveCount}</span>
              <span className="text-xs text-emerald-400 font-semibold">{stats.graduated} Altas PSA</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>{stats.evasions} Evasões • {stats.others} Outros</span>
            </div>
          </div>
        </div>

        {/* Awaiting bed / Pending Reg */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 flex items-center gap-4 hover:border-white/10 transition-all">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Fila de Espera</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-200">{stats.pendingCount}</span>
              <span className="text-xs text-amber-400 font-medium">Aguardando Regulação</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>Encaminhamentos SEDEF</span>
            </div>
          </div>
        </div>

        {/* Avg Progress & adherence */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 flex items-center gap-4 hover:border-white/10 transition-all">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Aproveitamento Geral</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-200">{stats.avgProgress}%</span>
              <span className="text-xs text-slate-400">Progresso Médio</span>
            </div>
            <span className="text-[10px] text-purple-400 mt-1 block font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full w-max">Aderência Meds: {adherenceRate}%</span>
          </div>
        </div>

      </div>

      {/* Medication Alerts Section (Realtime Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Medication Dispatch Desk */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-rose-400" />
              <h2 className="font-semibold text-slate-200 text-sm">Dispensário & Alertas de Medicação</h2>
            </div>
            <button 
              onClick={() => onNavigateToTab('medicamentos')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Ver Cronograma Integral →
            </button>
          </div>

          {/* Critical Alerts (Overdue Doses) */}
          {medAlerts.overdue.length > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                <AlertTriangle className="h-4 w-4 animate-bounce text-rose-400" />
                <span>ALERTA CRÍTICO: DOSES EM ATRASO ({medAlerts.overdue.length})</span>
              </div>
              <div className="divide-y divide-rose-500/10">
                {medAlerts.overdue.map(log => {
                  const parts = log.medicationId.split('-');
                  const residentId = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : parts[0];
                  const acolhido = acolhidos.find(a => a.id === residentId);
                              const minutesLate = Math.round((new Date().getTime() - new Date(log.horarioPrevisto).getTime()) / (1000 * 60));
                  return (
                    <div key={log.id} className="py-2.5 flex items-center justify-between text-xs text-rose-300 first:pt-0 last:pb-0">
                      <div>
                        <span className="font-semibold text-rose-200">{acolhido?.usuarioNome}</span>
                        <div className="text-rose-400 mt-0.5">
                          {log.medicationNome} ({log.dosagem}) • Previsto para: <span className="font-semibold font-mono">{new Date(log.horarioPrevisto).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-sm">Atrasado há {minutesLate} min</span>
                        <button
                          onClick={() => onAdministerMedication(log.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold px-3 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer"
                        >
                          Aplicar Dose
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending Doses (Next 3 Hours) */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Próximas medicações para as próximas 3 horas ({medAlerts.pendingSoon.length})</h3>
            
            {medAlerts.pendingSoon.length === 0 ? (
              <div className="bg-slate-900/50 text-slate-400 rounded-lg p-8 text-center text-xs flex flex-col items-center justify-center gap-2 border border-dashed border-white/5">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <span>Nenhuma medicação agendada para as próximas 3 horas.</span>
              </div>
            ) : (
              <div className="border border-white/5 rounded-lg divide-y divide-white/5 overflow-hidden max-h-60 overflow-y-auto">
                {medAlerts.pendingSoon.map(log => {
                  const parts = log.medicationId.split('-');
                  const residentId = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : parts[0];
                  const acolhido = acolhidos.find(a => a.id === residentId);
                  const minutesLeft = Math.round((new Date(log.horarioPrevisto).getTime() - new Date().getTime()) / (1000 * 60));
                  
                  return (
                    <div key={log.id} className="p-3 bg-[#0A0B0E] flex items-center justify-between text-xs text-slate-300 hover:bg-white/5 transition-colors">
                      <div>
                        <div className="font-semibold text-slate-200">{acolhido?.usuarioNome}</div>
                        <div className="text-slate-400 mt-0.5">
                          {log.medicationNome} ({log.dosagem}) • Agendado para: <span className="font-mono font-semibold">{new Date(log.horarioPrevisto).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded-sm">Faltam {minutesLeft} min</span>
                        <button
                          onClick={() => onAdministerMedication(log.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer"
                        >
                          Administrar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recovery Phase Progress Tracking Card */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Activity className="h-5 w-5 text-indigo-400" />
              <h2 className="font-semibold text-slate-200 text-sm">Estágio de Tratamento</h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Classificação de acolhidos ativos de acordo com o Plano Singular de Atendimento (PSA).</p>
            
            <div className="mt-4 space-y-4">
              {stages.map((stage, i) => {
                const totalActive = stats.activeCount;
                const percent = totalActive > 0 ? Math.round((stage.count / totalActive) * 100) : 0;
                return (
                  <div key={i} className="space-y-1">
                     <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-medium flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`}></span>
                        {stage.name}
                      </span>
                      <span className="font-semibold">{stage.count} <span className="text-slate-500 text-[10px]">({percent}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${stage.color} h-full rounded-full`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5 text-xs text-slate-400 text-center">
            Capacidade da CT estipulada em convênio pela SEDEF: <span className="font-semibold text-slate-300">{stats.capacity} vagas reguladas</span>.
          </div>
        </div>

      </div>

      {/* Graphs Row (Substance Prevalence & Clinical Flow) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Substance Prevalence Chart */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="font-semibold text-slate-200 text-sm">Epidemiologia: Substâncias Prevalentes</h2>
            </div>
            <span className="text-[10px] text-slate-300 bg-white/5 px-2.5 py-1 rounded-full font-mono">BASE: {stats.activeCount} ATIVOS</span>
          </div>
          
          <p className="text-[11px] text-slate-400">Prevalência de uso prejudicial declarado por substância ativa no prontuário de admissão (Anexo V).</p>

          <div className="space-y-3.5 mt-2">
            {substanceStats.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-8">Nenhum acolhido ativo cadastrado no sistema.</div>
            ) : (
              substanceStats.map((item, index) => (
                <div key={item.substancia} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-slate-300 font-medium truncate">{item.substancia}</div>
                  <div className="flex-1 bg-slate-800 h-5 rounded-md overflow-hidden relative flex items-center">
                    <div 
                      className={`h-full rounded-r-sm transition-all duration-500 ${
                        index === 0 ? 'bg-indigo-600' :
                        index === 1 ? 'bg-indigo-500' :
                        index === 2 ? 'bg-indigo-400' :
                        index === 3 ? 'bg-purple-600' : 'bg-slate-500'
                      }`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                    <span className="absolute left-2 text-[10px] font-bold text-white font-mono drop-shadow-xs">
                      {item.count} {item.count === 1 ? 'acolhido' : 'acolhidos'} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Regulatory Queue & Bed Status */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <h2 className="font-semibold text-slate-200 text-sm">Fila SEDEF & Regulação</h2>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Pessoas aguardando liberação formal do município e da SEDEF para acolhimento (Anexo I).</p>

            <div className="mt-4 space-y-3">
              {acolhidos.filter(a => a.status === 'Aguardando Vaga').length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-white/5 rounded-lg">
                  Nenhum solicitante em fila de espera.
                </div>
              ) : (
                acolhidos.filter(a => a.status === 'Aguardando Vaga').map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => onSelectAcolhido(a.id)}
                    className="p-3 bg-amber-500/5 hover:bg-amber-500/10 rounded-lg border border-amber-500/10 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-200">{a.usuarioNome}</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-sm">AGUARDANDO</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex flex-col gap-0.5">
                      <span>Origem: {a.solicitanteMunicipio} • CID: <span className="font-mono">{a.saudeCID.split(' ')[0]}</span></span>
                      <span>Solicitado em: {new Date(a.solicitanteData).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-white/5 pt-3">
            <button
              onClick={() => onNavigateToTab('acolhidos')}
              className="w-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold py-2 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              Ver Lista Geral de Acolhidos
            </button>
          </div>
        </div>

      </div>

      {/* Clinical Incident Feed & Family Log (Two columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incident Monitoring (Anexo III) */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h2 className="font-semibold text-slate-200 text-sm">Registro Recente de Intercorrências (Anexo III)</h2>
          </div>
          
          <div className="space-y-3">
            {recentIncidents.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">Nenhuma intercorrência comportamental registrada.</div>
            ) : (
              recentIncidents.map((inc, i) => (
                <div key={i} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span 
                      onClick={() => onSelectAcolhido(inc.residentId)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                    >
                      {inc.residentName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(inc.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">{inc.situacao}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Family Communication (Anexo V) */}
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <PhoneCall className="h-5 w-5 text-indigo-400" />
            <h2 className="font-semibold text-slate-200 text-sm">Contatos com Familiares & Assistência Social (Anexo V)</h2>
            <button onClick={() => setShowAddContact(s => !s)} className="ml-auto text-xs text-indigo-300 hover:text-indigo-200">{showAddContact ? 'Cancelar' : 'Adicionar contato'}</button>
          </div>
          {showAddContact && (
            <div className="bg-slate-900/40 p-3 rounded-md border border-white/5 space-y-2">
              <div className="flex gap-2">
                <select value={formResidentId} onChange={(e) => setFormResidentId(e.target.value)} className="flex-1 px-2 py-1 bg-slate-800 border border-white/5 rounded">
                  {acolhidos.filter(a => a.status === 'Ativo').map(a => (
                    <option key={a.id} value={a.id}>{a.usuarioNome}</option>
                  ))}
                </select>
                <input value={formData} onChange={(e) => setFormData(e.target.value)} type="date" className="px-2 py-1 bg-slate-800 border border-white/5 rounded" />
              </div>
              <input placeholder="Nome contactado" value={formNome} onChange={(e) => setFormNome(e.target.value)} className="w-full px-2 py-1 bg-slate-800 border border-white/5 rounded" />
              <input placeholder="Assunto" value={formAssunto} onChange={(e) => setFormAssunto(e.target.value)} className="w-full px-2 py-1 bg-slate-800 border border-white/5 rounded" />
              <input placeholder="Profissional responsável" value={formProfissional} onChange={(e) => setFormProfissional(e.target.value)} className="w-full px-2 py-1 bg-slate-800 border border-white/5 rounded" />
              <div className="flex justify-end">
                <button onClick={submitContact} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">Salvar</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {recentCommunications.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">Nenhum registro de contato familiar recente.</div>
            ) : (
              recentCommunications.map((com, i) => (
                <div key={i} className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span 
                      onClick={() => onSelectAcolhido(com.residentId)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                    >
                      {com.residentName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(com.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium">Contatado: {com.nomeContactado}</div>
                  <p className="text-[10px] text-slate-400">{com.assunto}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
