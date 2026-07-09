/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Acolhido, ResidentStatus } from '../types';
import { 
  FileSpreadsheet, 
  Printer, 
  Search, 
  Filter, 
  MapPin, 
  Activity, 
  Users, 
  UserCheck, 
  UserX, 
  UserMinus,
  AlertCircle,
  FileText
} from 'lucide-react';
import { INITIAL_SUBSTANCES } from '../mockData';

interface GeneralReportProps {
  acolhidos: Acolhido[];
  onSelectAcolhido: (id: string) => void;
}

export default function GeneralReport({ acolhidos, onSelectAcolhido }: GeneralReportProps) {
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Ativo' | 'Inativo' | 'Aguardando Vaga'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // 1. STATS CALCULATIONS
  const stats = useMemo(() => {
    const total = acolhidos.length;
    const ativos = acolhidos.filter(a => a.status === 'Ativo').length;
    const inativos = acolhidos.filter(a => a.status === 'Inativo').length;
    const fila = acolhidos.filter(a => a.status === 'Aguardando Vaga').length;
    
    // Most common substances
    const substanceCounts: { [key: string]: number } = {};
    acolhidos.forEach(a => {
      a.psaHistoricoSubstancias?.forEach(s => {
        if (s.selecionado) {
          substanceCounts[s.substancia] = (substanceCounts[s.substancia] || 0) + 1;
        }
      });
    });
    
    const topSubstances = Object.entries(substanceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => `${name} (${count})`);

    return {
      total,
      ativos,
      inativos,
      fila,
      topSubstances: topSubstances.length > 0 ? topSubstances.join(', ') : 'Nenhuma registrada'
    };
  }, [acolhidos]);

  // Unique cities of origin
  const cities = useMemo(() => {
    const list = acolhidos.map(a => a.usuarioMunicipio || a.solicitanteMunicipio).filter(Boolean);
    return Array.from(new Set(list));
  }, [acolhidos]);

  // 2. FILTERED LIST
  const filteredAcolhidos = useMemo(() => {
    return acolhidos.filter(a => {
      // Status Filter
      if (statusFilter !== 'todos' && a.status !== statusFilter) return false;

      // Text Search (Name, CPF, RG, City)
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const nameMatch = a.usuarioNome?.toLowerCase().includes(query);
        const socialMatch = a.usuarioNomeSocial?.toLowerCase().includes(query);
        const cpfMatch = a.usuarioCPF?.includes(query);
        const rgMatch = a.usuarioRG?.includes(query);
        const cityMatch = (a.usuarioMunicipio || a.solicitanteMunicipio)?.toLowerCase().includes(query);
        if (!nameMatch && !socialMatch && !cpfMatch && !rgMatch && !cityMatch) return false;
      }

      // Substance filter
      if (selectedSubstance) {
        const hasSubstance = a.psaHistoricoSubstancias?.some(
          s => s.substancia === selectedSubstance && s.selecionado
        );
        if (!hasSubstance) return false;
      }

      // City filter
      if (selectedCity) {
        const matchesCity = (a.usuarioMunicipio || a.solicitanteMunicipio) === selectedCity;
        if (!matchesCity) return false;
      }

      return true;
    });
  }, [acolhidos, statusFilter, searchQuery, selectedSubstance, selectedCity]);

  // 3. EXPORT TO CSV FUNCTION
  const exportToCSV = () => {
    // Generate headers
    const headers = [
      'Nome do Acolhido',
      'Nome Social',
      'Status',
      'CPF',
      'RG',
      'Data Nascimento',
      'Sexo Biológico',
      'Cidade de Origem',
      'Equipamento Solicitante',
      'Data de Ingresso',
      'Previsão de Término',
      'Progresso PSA (%)',
      'Contato de Emergência',
      'Telefone Emergência',
      'Modalidade de Saída (Inativos)',
      'Apto Acolhimento (Médico)',
      'Substâncias Consumidas'
    ];

    // Map rows
    const rows = filteredAcolhidos.map(a => {
      const emergencyContact = a.prontuarioFamiliares?.[0];
      const substances = a.psaHistoricoSubstancias
        ?.filter(s => s.selecionado)
        .map(s => s.substancia)
        .join(' | ') || '';

      return [
        a.usuarioNome || '',
        a.usuarioNomeSocial || '',
        a.status || '',
        a.usuarioCPF || '',
        a.usuarioRG || '',
        a.usuarioDataNascimento || '',
        a.usuarioSexoBiologico || '',
        a.usuarioMunicipio || a.solicitanteMunicipio || '',
        a.solicitanteEquipamento || '',
        a.prontuarioDataIngresso || '',
        a.prontuarioDataPrevistaTermino || '',
        `${a.progressoPorcentagem || 0}%`,
        emergencyContact?.nome || '',
        emergencyContact?.telefone || '',
        a.psaDesligamentoModalidade || '',
        a.saudeApto || '',
        substances
      ];
    });

    // Construct CSV text with semicolon delimiter (standard for European/Latin Excel)
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    // Add UTF-8 BOM to prevent spreadsheet software from messing up accents
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_geral_acolhidos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. PRINT REPORT FUNCTION
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-slate-200" id="relatorio-geral-view">
      
      {/* Header with quick export and print actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
            <span>Relatório Geral Consolidador</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Visualização tabular completa de acolhidos ativos, inativos e fila de espera para regulação estadual.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={triggerPrint}
            className="px-3.5 py-2 text-xs bg-slate-900 border border-white/5 hover:bg-white/5 font-semibold rounded-lg flex items-center gap-1.5 transition-all text-slate-300 cursor-pointer"
            title="Imprimir relatório"
          >
            <Printer className="h-4 w-4 text-indigo-400" />
            <span>Imprimir</span>
          </button>
          
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-all text-white cursor-pointer"
            title="Exportar dados para Excel (.CSV)"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Exportar Planilha (Excel)</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3" id="stats-dashboard-widgets">
        
        <div className="bg-[#15181E] rounded-xl border border-white/5 p-3.5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Cadastros</span>
            <span className="text-lg font-bold text-slate-100 font-mono leading-none mt-0.5">{stats.total}</span>
          </div>
        </div>

        <div className="bg-[#15181E] rounded-xl border border-white/5 p-3.5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Acolhidos Ativos</span>
            <span className="text-lg font-bold text-slate-100 font-mono leading-none mt-0.5">{stats.ativos}</span>
          </div>
        </div>

        <div className="bg-[#15181E] rounded-xl border border-white/5 p-3.5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
            <UserX className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Não Ativos / Histórico</span>
            <span className="text-lg font-bold text-slate-100 font-mono leading-none mt-0.5">{stats.inativos}</span>
          </div>
        </div>

        <div className="bg-[#15181E] rounded-xl border border-white/5 p-3.5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <UserMinus className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fila de Regulação</span>
            <span className="text-lg font-bold text-slate-100 font-mono leading-none mt-0.5">{stats.fila}</span>
          </div>
        </div>

        <div className="bg-[#15181E] rounded-xl border border-white/5 p-3.5 col-span-2 lg:col-span-1 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Activity className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Drogas Prevalentes</span>
            <span className="text-xs font-bold text-slate-200 block truncate mt-0.5" title={stats.topSubstances}>
              {stats.topSubstances}
            </span>
          </div>
        </div>

      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-[#15181E] rounded-xl border border-white/5 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        
        {/* Status Tab filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtro por Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full py-2 px-3 text-xs bg-slate-900 border border-white/5 rounded-lg text-slate-200 focus:outline-hidden focus:border-indigo-500 transition-all font-semibold"
          >
            <option value="todos">Todos os Registros</option>
            <option value="Ativo">Somente Acolhidos Ativos</option>
            <option value="Inativo">Somente Inativos / Histórico</option>
            <option value="Aguardando Vaga">Somente Fila de Espera</option>
          </select>
        </div>

        {/* Text Search */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pesquisa Geral</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Nome, CPF ou RG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-white/5 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Substance filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Histórico de Substâncias</label>
          <div className="relative">
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
            <Filter className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* City Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cidade de Origem</label>
          <div className="relative">
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
            <MapPin className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Active filters summary */}
      {(searchQuery || selectedSubstance || selectedCity || statusFilter !== 'todos') && (
        <div className="flex items-center justify-between bg-indigo-500/5 border border-indigo-500/10 px-4 py-2.5 rounded-lg text-xs text-indigo-300">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-indigo-400" />
            <span>
              Filtros Ativos: 
              {statusFilter !== 'todos' && ` [Status: ${statusFilter}]`}
              {searchQuery && ` [Termo: "${searchQuery}"]`}
              {selectedSubstance && ` [Drogas: ${selectedSubstance}]`}
              {selectedCity && ` [Cidade: ${selectedCity}]`}
            </span>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubstance('');
              setSelectedCity('');
              setStatusFilter('todos');
            }}
            className="text-xs font-bold underline hover:text-indigo-200 cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Main Table Report Card */}
      <div className="bg-[#15181E] rounded-xl border border-white/5 overflow-hidden shadow-md print:bg-white print:text-black print:border-none print:shadow-none" id="printable-report-area">
        
        {/* Only visible when printing */}
        <div className="hidden print:block p-6 border-b border-slate-300 mb-6 text-black">
          <h2 className="text-xl font-bold uppercase text-slate-900">REDUZIR • PR - GESTÃO E REGULAÇÃO DE COMUNIDADE TERAPÊUTICA</h2>
          <p className="text-sm text-slate-600 mt-1">Relatório Geral Consolidado dos Acolhidos</p>
          <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-slate-700 bg-slate-100 p-4 rounded-lg">
            <div><strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
            <div><strong>Total Registros:</strong> {filteredAcolhidos.length}</div>
            <div><strong>Filtro Status:</strong> {statusFilter === 'todos' ? 'Todos' : statusFilter}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-wider print:bg-slate-100 print:text-slate-800 print:border-slate-300">
                <th className="py-3 px-4">Acolhido (Nome / CPF)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Data Ingresso</th>
                <th className="py-3 px-4">Cidade de Origem</th>
                <th className="py-3 px-4">Equipamento Solicitante</th>
                <th className="py-3 px-4">Contato Emergência</th>
                <th className="py-3 px-4">Progresso / Situação</th>
                <th className="py-3 px-4">Prevenção Clín. (Apto)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-slate-200">
              {filteredAcolhidos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-semibold text-xs bg-slate-950/20">
                    Nenhum registro corresponde aos filtros definidos.
                  </td>
                </tr>
              ) : (
                filteredAcolhidos.map(a => {
                  const emergencyContact = a.prontuarioFamiliares?.[0];
                  
                  return (
                    <tr 
                      key={a.id} 
                      className="hover:bg-white/5 transition-colors text-xs text-slate-300 print:text-black print:hover:bg-transparent"
                    >
                      
                      {/* Name / CPF */}
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-200 print:text-slate-900">
                        <div>
                          <span 
                            onClick={() => onSelectAcolhido(a.id)}
                            className="font-bold hover:text-indigo-400 hover:underline cursor-pointer print:hover:no-underline"
                          >
                            {a.usuarioNome}
                          </span>
                          {a.usuarioNomeSocial && (
                            <span className="text-[10px] text-indigo-400 italic font-medium ml-2 block sm:inline">({a.usuarioNomeSocial})</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">CPF: {a.usuarioCPF || 'Não informado'}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          a.status === 'Ativo' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:bg-emerald-100 print:text-emerald-800'
                            : a.status === 'Inativo'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 print:bg-rose-100 print:text-rose-800'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 print:bg-amber-100 print:text-amber-800'
                        }`}>
                          {a.status === 'Ativo' ? 'Ativo' : a.status === 'Inativo' ? 'Não Ativo / Histórico' : 'Fila Espera'}
                        </span>
                      </td>

                      {/* Admission Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 print:text-slate-700">
                        {a.prontuarioDataIngresso ? new Date(a.prontuarioDataIngresso).toLocaleDateString('pt-BR') : '-'}
                      </td>

                      {/* City of Origin */}
                      <td className="py-3.5 px-4 text-slate-300 print:text-slate-700">
                        {a.usuarioMunicipio || a.solicitanteMunicipio || 'Não informado'}
                      </td>

                      {/* Equipment */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] print:text-slate-600">
                        {a.solicitanteEquipamento || '-'}
                      </td>

                      {/* Emergency Contact */}
                      <td className="py-3.5 px-4">
                        {emergencyContact ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-300 print:text-slate-800">{emergencyContact.nome}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">({emergencyContact.parentesco}) - {emergencyContact.telefone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>

                      {/* Progress / Motive */}
                      <td className="py-3.5 px-4">
                        {a.status === 'Ativo' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden flex-shrink-0 print:border print:border-slate-300">
                              <div className="bg-indigo-500 h-full" style={{ width: `${a.progressoPorcentagem || 10}%` }}></div>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-indigo-400">{a.progressoPorcentagem || 10}%</span>
                          </div>
                        ) : a.status === 'Inativo' ? (
                          <span className="text-[10px] font-medium text-slate-400 print:text-slate-600">
                            {a.psaDesligamentoModalidade || 'Desligado'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-400 italic">Aguardando Regulação</span>
                        )}
                      </td>

                      {/* Medical approval */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                          a.saudeApto === 'Sim'
                            ? 'bg-emerald-500/10 text-emerald-400 print:text-emerald-800'
                            : 'bg-rose-500/10 text-rose-400 print:text-rose-800'
                        }`}>
                          {a.saudeApto === 'Sim' ? 'Apto' : 'Inapto'}
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="bg-slate-900/60 px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 print:bg-white print:text-slate-700 print:border-slate-300">
          <span>Relatório contendo <strong>{filteredAcolhidos.length}</strong> acolhidos listados.</span>
          <span className="text-[10px] font-mono">SEDEF / SESA - Sistema de regulação unificado CT</span>
        </div>

      </div>

    </div>
  );
}
