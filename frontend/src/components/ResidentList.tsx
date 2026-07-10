/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Acolhido, ResidentStatus } from '../types';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  MapPin, 
  FileCheck, 
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { INITIAL_SUBSTANCES } from '../mockData';

interface ResidentListProps {
  acolhidos: Acolhido[];
  onSelectAcolhido: (id: string) => void;
  onOpenNewResidentForm: () => void;
  onDeleteAcolhido?: (id: string) => void;
}

export default function ResidentList({ 
  acolhidos, 
  onSelectAcolhido, 
  onOpenNewResidentForm,
  onDeleteAcolhido
}: ResidentListProps) {
  
  const [activeTab, setActiveTab] = useState<ResidentStatus>('Ativo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Get list of unique cities for filtering
  const cities = useMemo(() => {
    const list = acolhidos.map(a => a.usuarioMunicipio || a.solicitanteMunicipio).filter(Boolean);
    return Array.from(new Set(list));
  }, [acolhidos]);

  // Filter and search logic
  const filteredAcolhidos = useMemo(() => {
    return acolhidos.filter(a => {
      // 1. Filter by Status Tab
      if (a.status !== activeTab) return false;

      // 2. Filter by Search Query (Name, CPF, RG, or Social Name)
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const nameMatch = a.usuarioNome?.toLowerCase().includes(query);
        const socialMatch = a.usuarioNomeSocial?.toLowerCase().includes(query);
        const cpfMatch = a.usuarioCPF?.includes(query);
        const rgMatch = a.usuarioRG?.includes(query);
        const cityMatch = (a.usuarioMunicipio || a.solicitanteMunicipio)?.toLowerCase().includes(query);
        if (!nameMatch && !socialMatch && !cpfMatch && !rgMatch && !cityMatch) {
          return false;
        }
      }

      // 3. Filter by Selected Substance (Anexo V)
      if (selectedSubstance) {
        const hasSubstance = a.psaHistoricoSubstancias?.some(
          s => s.substancia === selectedSubstance && s.selecionado
        );
        if (!hasSubstance) return false;
      }

      // 4. Filter by Selected City
      if (selectedCity) {
        const matchesCity = (a.usuarioMunicipio || a.solicitanteMunicipio) === selectedCity;
        if (!matchesCity) return false;
      }

      return true;
    });
  }, [acolhidos, activeTab, searchQuery, selectedSubstance, selectedCity]);

  return (
    <div className="space-y-6 text-slate-200" id="acolhidos-list">
      
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-sans">Gestão de Acolhidos</h1>
          <p className="text-slate-400 text-xs mt-1">
            Controle e regulação de Prontuários, Planos Singulares (PSA) e Frequências da Comunidade.
          </p>
        </div>
        <button
          onClick={onOpenNewResidentForm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          id="btn-new-resident"
        >
          <UserPlus className="h-4 w-4" />
          <span>Registrar Admissão (Anexos I a V)</span>
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-white/5 flex overflow-x-auto scrollbar-none gap-8">
        {(['Ativo', 'Inativo', 'Aguardando Vaga'] as ResidentStatus[]).map(tab => {
          const count = acolhidos.filter(a => a.status === tab).length;
          const isSelected = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedSubstance('');
                setSelectedCity('');
              }}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isSelected 
                  ? 'border-indigo-500 text-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>
                {tab === 'Ativo' ? 'Acolhidos Ativos' : 
                 tab === 'Inativo' ? 'Inativos / Histórico' : 'Fila / Aguardando Vaga'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isSelected ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#15181E] rounded-xl border border-white/5 p-4 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Search */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por Nome, CPF, RG ou Município..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-white/5 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Substance filter */}
        <div className="relative md:col-span-3">
          <select
            value={selectedSubstance}
            onChange={(e) => setSelectedSubstance(e.target.value)}
            className="w-full py-2 pl-3 pr-8 text-xs bg-slate-900 border border-white/5 rounded-lg text-slate-300 focus:outline-hidden focus:border-indigo-500 transition-all appearance-none"
          >
            <option value="">Filtrar por Substância...</option>
            {INITIAL_SUBSTANCES.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
        </div>

        {/* City Filter */}
        <div className="relative md:col-span-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full py-2 pl-3 pr-8 text-xs bg-slate-900 border border-white/5 rounded-lg text-slate-300 focus:outline-hidden focus:border-indigo-500 transition-all appearance-none"
          >
            <option value="">Filtrar por Município...</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
        </div>

        {/* Clear filters */}
        {(searchQuery || selectedSubstance || selectedCity) && (
          <div className="md:col-span-1 text-center md:text-right">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubstance('');
                setSelectedCity('');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
            >
              Limpar
            </button>
          </div>
        )}
      </div>

      {/* Residents Grid / Table */}
      {filteredAcolhidos.length === 0 ? (
        <div className="bg-[#15181E] rounded-xl border border-dashed border-white/5 p-12 text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle className="h-8 w-8 text-slate-500" />
          <h3 className="font-semibold text-slate-200 text-sm">Nenhum registro encontrado</h3>
          <p className="text-slate-400 text-xs max-w-sm">
            Não encontramos nenhum acolhido correspondente com o status <strong>{activeTab === 'Ativo' ? 'Ativo' : activeTab === 'Inativo' ? 'Inativo' : 'Aguardando Vaga'}</strong> e filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="bg-[#15181E] rounded-xl border border-white/5 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-white/5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Identificação</th>
                  <th className="py-3 px-4">Origem / Regulação</th>
                  <th className="py-3 px-4">Periodo de Acolhimento</th>
                  <th className="py-3 px-4">Substâncias Declaradas</th>
                  {activeTab === 'Ativo' && <th className="py-3 px-4">Fase / Progresso</th>}
                  {activeTab === 'Inativo' && <th className="py-3 px-4">Motivo Saída</th>}
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAcolhidos.map(a => {
                  const activeSubstances = a.psaHistoricoSubstancias
                    ?.filter(s => s.selecionado)
                    .map(s => s.substancia)
                    .slice(0, 3) || [];
                  
                  return (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors text-xs text-slate-300">
                      
                      {/* Name / photo */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 border border-white/5 flex items-center justify-center">
                            {a.fotoUrl ? (
                              <img src={a.fotoUrl} alt={a.usuarioNome} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="font-bold text-slate-500 text-xs">
                                {a.usuarioNome?.split(' ').map(n => n[0]).slice(0, 2).join('')}
                              </span>
                            )}
                          </div>
                          <div>
                            <span 
                              onClick={() => onSelectAcolhido(a.id)}
                              className="font-semibold text-slate-200 hover:text-indigo-400 hover:underline cursor-pointer block"
                            >
                              {a.usuarioNome}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">CPF: {a.usuarioCPF || 'Não informado'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Origin */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-200 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-500" />
                            <span>{a.usuarioMunicipio || a.solicitanteMunicipio}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">Solicitante: {a.solicitanteEquipamento}</span>
                        </div>
                      </td>

                      {/* Timestamps */}
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                        {a.status === 'Aguardando Vaga' ? (
                          <div className="space-y-0.5">
                            <span className="text-amber-400 font-semibold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-sm block w-max">REQUISITADO EM</span>
                            <span>{a.solicitanteData ? new Date(a.solicitanteData).toLocaleDateString('pt-BR') : 'Não cadastrado'}</span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div>Ingresso: <span className="font-semibold text-slate-200">{a.prontuarioDataIngresso ? new Date(a.prontuarioDataIngresso).toLocaleDateString('pt-BR') : 'Não informado'}</span></div>
                            {a.prontuarioDataPrevistaTermino && (
                              <div className="text-[10px] text-slate-400">
                                Previsão: {new Date(a.prontuarioDataPrevistaTermino).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Substance List */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {activeSubstances.length === 0 ? (
                            <span className="text-slate-500 text-[10px]">Nenhuma cadastrada</span>
                          ) : (
                            activeSubstances.map(s => (
                              <span key={s} className="text-[9px] bg-white/5 text-slate-300 font-medium px-1.5 py-0.5 rounded-sm">
                                {s}
                              </span>
                            ))
                          )}
                          {a.psaHistoricoSubstancias && a.psaHistoricoSubstancias.filter(s => s.selecionado).length > 3 && (
                            <span className="text-[9px] text-slate-500 font-bold px-1 py-0.5">
                              +{a.psaHistoricoSubstancias.filter(s => s.selecionado).length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Progressive Stage / Inactive reason */}
                      {activeTab === 'Ativo' && (
                        <td className="py-4 px-4">
                          <div className="space-y-1.5 w-28">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                              <span>Progresso PSA</span>
                              <span className="font-bold font-mono text-slate-300">{a.progressoPorcentagem}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  a.progressoPorcentagem <= 30 ? 'bg-rose-500' :
                                  a.progressoPorcentagem <= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`} 
                                style={{ width: `${a.progressoPorcentagem}%` }}
                              ></div>
                            </div>
                            <span className="text-[9px] font-semibold text-slate-500 block uppercase">
                              {a.progressoPorcentagem <= 30 ? 'Desintoxicação' :
                               a.progressoPorcentagem <= 70 ? 'Desenvolvimento' : 'Ressocialização'}
                            </span>
                          </div>
                        </td>
                      )}

                      {activeTab === 'Inativo' && (
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                              a.psaDesligamentoModalidade === 'Desligamento planejado' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : a.psaDesligamentoModalidade === 'Evasão'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-white/5 text-slate-300'
                            }`}>
                              {a.psaDesligamentoModalidade || 'Desligado'}
                            </span>
                            {a.psaDesligamentoCondicoes && (
                              <p className="text-[10px] text-slate-500 line-clamp-1 max-w-xs">{a.psaDesligamentoCondicoes}</p>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onSelectAcolhido(a.id)}
                            className="p-1.5 text-indigo-400 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                            title="Visualizar Ficha Cadastral Completa"
                            id={`view-profile-${a.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {onDeleteAcolhido && (
                            <button
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja remover o cadastro de ${a.usuarioNome}? Esta ação é irreversível.`)) {
                                  onDeleteAcolhido(a.id);
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                              title="Excluir Acolhido"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-900/60 px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Exibindo <strong>{filteredAcolhidos.length}</strong> de <strong>{acolhidos.filter(a => a.status === activeTab).length}</strong> acolhidos {activeTab === 'Ativo' ? 'ativos' : activeTab === 'Inativo' ? 'inativos' : 'em regulação'}.</span>
          </div>
        </div>
      )}

    </div>
  );
}
