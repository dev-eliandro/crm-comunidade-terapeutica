/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Acolhido, MedicationLog, Medication } from '../types';
import { 
  Pill, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  History, 
  HelpCircle,
  Play,
  RotateCcw,
  Plus
} from 'lucide-react';

interface MedicationControlProps {
  acolhidos: Acolhido[];
  medicationLogs: MedicationLog[];
  onAdministerMedication: (logId: string) => void;
  onToggleAlerts: (medId: string) => void;
}

export default function MedicationControl({
  acolhidos,
  medicationLogs,
  onAdministerMedication,
  onToggleAlerts
}: MedicationControlProps) {
  
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Pendente' | 'Administrado' | 'Atrasado'>('Todos');
  const [searchResident, setSearchResident] = useState('');

  // Get active residents list to cross reference names and avatars
  const activeResidentsMap = useMemo(() => {
    const map = new Map<string, Acolhido>();
    acolhidos.forEach(a => {
      map.set(a.id, a);
    });
    return map;
  }, [acolhidos]);

  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  // Compute live logs based on real system time
  const processedLogs = useMemo(() => {
    const nowDate = now;
    
    return medicationLogs.map(log => {
      // Determine if a pending dose is technically late
      let status = log.status;
      if (status === 'Pendente') {
        const scheduled = new Date(log.horarioPrevisto);
        if (now.getTime() > scheduled.getTime()) {
          status = 'Atrasado';
        }
      }
      return { ...log, status };
    })
    .filter(log => {
      // 1. Status Filter
      if (statusFilter !== 'Todos' && log.status !== statusFilter) return false;
      
      // 2. Search Resident Name Filter
      if (searchResident) {
                const parts = log.medicationId.split('-');
                const residentId = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : parts[0];
                const res = activeResidentsMap.get(residentId);
        if (!res?.usuarioNome.toLowerCase().includes(searchResident.toLowerCase())) {
          return false;
        }
      }
      return true;
    })
    // Sort by scheduled time, soonest or most overdue first
    .sort((a, b) => new Date(a.horarioPrevisto).getTime() - new Date(b.horarioPrevisto).getTime());

  }, [medicationLogs, statusFilter, searchResident, activeResidentsMap, now]);

  // Count alerts
  const stats = useMemo(() => {
    const nowDate = now;
    let total = 0;
    let given = 0;
    let overdue = 0;
    let pending = 0;

    medicationLogs.forEach(log => {
      if (log.status === 'Administrado') {
        given++;
      } else {
        const scheduled = new Date(log.horarioPrevisto);
        if (now.getTime() > scheduled.getTime()) {
          overdue++;
        } else {
          pending++;
        }
      }
      total++;
    });

    return { total, given, overdue, pending };
  }, [medicationLogs, now]);

  const sortedResidentsMeds = useMemo(() => {
    return acolhidos.filter(a => a.status === 'Ativo' && a.medicacoes?.length > 0);
  }, [acolhidos]);

  return (
    <div className="space-y-6 text-slate-200" id="medications-dispensary">
      
      {/* Top Controller Header */}
      <div className="bg-[#15181E] rounded-2xl border border-white/5 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-xl font-bold text-white font-sans">Administração de Medicamentos</h1>
          <p className="text-xs text-slate-400 mt-1">Dispensário digital, controle de alarmes e registro de dosagens aplicadas.</p>
        </div>

        {/* Time Simulator Panel */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 max-w-md w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" />
              <span>HORA DO SISTEMA</span>
            </span>
            <span className="text-xs font-semibold text-slate-300 font-mono">
              {now.toLocaleDateString('pt-BR')} {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Doses do Dia</span>
          <span className="text-xl font-bold text-slate-200 mt-1 block">{stats.total}</span>
        </div>
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Administradas</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{stats.given}</span>
        </div>
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Doses Atrasadas</span>
            <span className="text-xl font-bold text-rose-400 mt-1 block">{stats.overdue}</span>
          </div>
          {stats.overdue > 0 && (
            <div className="h-8 w-8 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 animate-pulse">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pendentes (Próximas)</span>
          <span className="text-xl font-bold text-slate-300 mt-1 block">{stats.pending}</span>
        </div>
      </div>

      {/* Main Working Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Day's Administration Desk */}
        <div className="bg-[#15181E] rounded-2xl border border-white/5 p-5 shadow-xs lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-3 gap-3">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-indigo-400" />
              <h2 className="font-semibold text-slate-200 text-sm">Prontuário de Aplicação Diária</h2>
            </div>
            
            {/* Quick Status Tabs Filters */}
            <div className="bg-slate-900 p-0.5 rounded-lg flex text-[10px] font-bold uppercase overflow-x-auto border border-white/5">
              {/* Actual Filters */}
              <button 
                onClick={() => setStatusFilter('Todos')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${statusFilter === 'Todos' ? 'bg-white/10 text-white shadow-2xs' : 'text-slate-400 hover:text-white'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setStatusFilter('Pendente')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${statusFilter === 'Pendente' ? 'bg-white/10 text-white shadow-2xs' : 'text-slate-400 hover:text-white'}`}
              >
                Pendentes
              </button>
              <button 
                onClick={() => setStatusFilter('Atrasado')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${statusFilter === 'Atrasado' ? 'bg-rose-500/20 text-rose-300 shadow-2xs' : 'text-slate-400 hover:text-white'}`}
              >
                Atrasados ({stats.overdue})
              </button>
              <button 
                onClick={() => setStatusFilter('Administrado')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${statusFilter === 'Administrado' ? 'bg-emerald-500/20 text-emerald-300 shadow-2xs' : 'text-slate-400 hover:text-white'}`}
              >
                Tomados
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar dose por nome do acolhido..."
              value={searchResident}
              onChange={(e) => setSearchResident(e.target.value)}
              className="w-full px-3.5 py-1.5 text-xs bg-slate-900 border border-white/5 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Doses List Table */}
          {processedLogs.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500 border border-dashed border-white/5 rounded-xl">
              Nenhuma dose programada correspondente aos filtros neste período.
            </div>
          ) : (
            <div className="border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
              {processedLogs.map(log => {
                  const parts = log.medicationId.split('-');
                  const residentId = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : parts[0];
                  const resident = activeResidentsMap.get(residentId);
                
                return (
                  <div key={log.id} className="p-4 bg-[#0A0B0E] flex items-center justify-between gap-4 text-xs text-slate-300 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {resident?.fotoUrl ? (
                          <img src={resident.fotoUrl} alt={resident.usuarioNome} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          resident?.usuarioNome?.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{resident?.usuarioNome || 'Desconhecido'}</div>
                        <div className="text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-indigo-300">{log.medicationNome} ({log.dosagem})</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/5 rounded px-1.5">
                            <Clock className="h-3 w-3 text-slate-500" />
                            {new Date(log.horarioPrevisto).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      
                      {/* Status indicator */}
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                        log.status === 'Administrado' ? 'bg-emerald-500/10 text-emerald-400' :
                        log.status === 'Atrasado' ? 'bg-rose-500/10 text-rose-400 animate-pulse' :
                        'bg-white/5 text-slate-400'
                      }`}>
                        {log.status === 'Administrado' ? 'Tomado' : log.status === 'Atrasado' ? 'Atrasado' : 'Pendente'}
                      </span>

                      {/* Action button */}
                      {log.status !== 'Administrado' ? (
                        <button
                          onClick={() => onAdministerMedication(log.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] px-3.5 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer"
                        >
                          Aplicar Dose
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px] flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Aplicado</span>
                        </span>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Prescriptions and alerts control index */}
        <div className="lg:col-span-4 bg-[#15181E] rounded-2xl border border-white/5 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <AlertCircle className="h-5 w-5 text-indigo-400" />
            <h2 className="font-semibold text-slate-200 text-sm">Resumo de Alertas Automáticos</h2>
          </div>
          
          <p className="text-[11px] text-slate-400">Relação de todas as prescrições médicas ativas dos acolhidos regulados e status de notificação de pílula.</p>

          <div className="space-y-3">
            {sortedResidentsMeds.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-white/5 rounded-lg">
                Nenhum acolhido com prescrições ativas.
              </div>
            ) : (
              sortedResidentsMeds.map(res => (
                <div key={res.id} className="p-3 bg-slate-900/40 rounded-lg space-y-2 border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="font-semibold text-xs text-slate-200">{res.usuarioNome}</div>
                  <div className="space-y-1.5">
                    {res.medicacoes?.map(med => (
                      <div key={med.id} className="flex items-center justify-between text-[11px] text-slate-300 bg-[#0A0B0E] border border-white/5 p-2 rounded-md">
                        <div>
                          <span className="font-medium text-slate-200">{med.nome}</span>
                          <span className="text-slate-500 block text-[9px] font-mono mt-0.5">A cada {med.frequenciaHoras} horas ({med.horarios.join(', ')})</span>
                        </div>
                        
                        {/* Alarm bell button toggle */}
                        <button
                          onClick={() => onToggleAlerts(med.id)}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border cursor-pointer transition-all ${
                            med.alertasAtivos 
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                              : 'bg-white/5 text-slate-500 border-white/5'
                          }`}
                        >
                          {med.alertasAtivos ? 'Alarme ON' : 'Silenciado'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
