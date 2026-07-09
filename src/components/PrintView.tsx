/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Acolhido } from '../types';
import { INITIAL_SUBSTANCES } from '../mockData';
import { X, Printer } from 'lucide-react';

interface PrintViewProps {
  resident: Acolhido;
  anexoType: 'ALL' | 'I' | 'II' | 'III' | 'IV' | 'V';
  onClose: () => void;
}

export default function PrintView({ resident, anexoType, onClose }: PrintViewProps) {
  
  const handleNativePrint = () => {
    window.print();
  };

  const currentMonthYear = '07/2026';
  const attendanceRegistry = resident.frequencias?.find(f => f.periodoReferencia === currentMonthYear)?.registro || {};

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      
      {/* Floating Action Header Bar (Hidden during actual print) */}
      <div className="w-full max-w-4xl bg-slate-800 text-white rounded-xl px-5 py-3 mb-6 flex items-center justify-between shadow-lg print:hidden">
        <div className="flex items-center gap-2">
          <Printer className="h-5 w-5 text-teal-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">Visualização de Impressão Oficial (Paraná)</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleNativePrint}
            className="bg-teal-500 hover:bg-teal-600 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>IMPRIMIR AGORA</span>
          </button>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-700/50"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Styled Print media sheet container */}
      <div className="w-full max-w-4xl bg-white text-slate-900 p-8 md:p-12 shadow-2xl rounded-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 space-y-12 font-sans">
        
        {/* INLINE CSS BLOCK FOR PAGE-BREAKS & PRINT RESCUE */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print-page-break {
              page-break-after: always;
              break-after: page;
            }
            .print-no-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            select {
              appearance: none !important;
              border: none !important;
              background: none !important;
              padding: 0 !important;
            }
          }
        `}} />

        {/* --- ANEXO I: SOLICITAÇÃO DE VAGA --- */}
        {(anexoType === 'ALL' || anexoType === 'I') && (
          <div className="print-page-break space-y-6">
            {/* Paraná State Header Mockup */}
            <div className="flex flex-col items-center text-center border-b-2 border-slate-800 pb-4">
              <div className="text-xs font-bold tracking-widest text-slate-500">PARANÁ</div>
              <div className="text-[10px] uppercase font-bold text-slate-600 mt-1">Governo do Estado • Secretaria do Desenvolvimento Social e Família</div>
              <h1 className="text-sm font-black uppercase mt-4 tracking-wider border-t border-slate-200 pt-2 w-full">ANEXO I – FORMULÁRIO DE SOLICITAÇÃO DE VAGA</h1>
            </div>

            {/* Section 1: Identificação Solicitante */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 border border-slate-300">1. Identificação do(a) Solicitante</h2>
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold w-1/3">Equipamento solicitante:</td>
                    <td className="border border-slate-300 p-2">{resident.solicitanteEquipamento || '__________________________________'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold">Município de Origem:</td>
                    <td className="border border-slate-300 p-2">{resident.solicitanteMunicipio || '__________________________________'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold">Profissional responsável pelo preenchimento:</td>
                    <td className="border border-slate-300 p-2">{resident.solicitanteResponsavel || '__________________________________'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold">Data da solicitação:</td>
                    <td className="border border-slate-300 p-2 font-mono">{resident.solicitanteData ? new Date(resident.solicitanteData).toLocaleDateString('pt-BR') : '____/____/______'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 2: Identificação Usuário */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 border border-slate-300">2. Identificação do(a) Usuário(a)</h2>
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <tbody>
                  <tr>
                    <td colSpan={2} className="border border-slate-300 p-2 font-bold">Nome completo: <span className="font-normal block mt-1 text-sm font-semibold">{resident.usuarioNome}</span></td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold w-1/2">Nome Social: <span className="font-normal block mt-1">{resident.usuarioNomeSocial || 'Não consta'}</span></td>
                    <td className="border border-slate-300 p-2 font-bold w-1/2">Naturalidade: <span className="font-normal block mt-1">{resident.usuarioNaturalidade || 'Não consta'}</span></td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold">Data de Nascimento: <span className="font-normal block mt-1 font-mono">{resident.usuarioDataNascimento ? new Date(resident.usuarioDataNascimento).toLocaleDateString('pt-BR') : '__/__/____'}</span></td>
                    <td className="border border-slate-300 p-2 font-bold">CPF nº: <span className="font-normal block mt-1 font-mono">{resident.usuarioCPF}</span></td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold">Identidade de Gênero: <span className="font-normal block mt-1">{resident.usuarioIdentidadeGenero}</span></td>
                    <td className="border border-slate-300 p-2 font-bold">Sexo Biológico: <span className="font-normal block mt-1">{resident.usuarioSexoBiologico}</span></td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="border border-slate-300 p-2 font-bold">Filiação: <span className="font-normal block mt-1">{resident.usuarioFiliacao || 'Não cadastrada'}</span></td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold">Endereço: <span className="font-normal block mt-1">{resident.usuarioEndereco || 'Sem residência fixa'}</span></td>
                    <td className="border border-slate-300 p-2 font-bold">Nº / Bairro: <span className="font-normal block mt-1">{resident.usuarioBairro || 'Sem residência fixa'}</span></td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold">Situação de Moradia: <span className="font-normal block mt-1">{resident.usuarioSituacaoMoradia}</span></td>
                    <td className="border border-slate-300 p-2 font-bold">Tipo de Residência: <span className="font-normal block mt-1">{resident.usuarioTipoResidencia}</span></td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="border border-slate-300 p-2 font-bold">Telefone: <span className="font-normal block mt-1 font-mono">{resident.usuarioTelefone || 'Não cadastrado'}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rede de Apoio */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 border border-slate-300">3. Identificação da Rede Familiar e Apoio</h2>
              <table className="w-full border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-300 p-1">Nº</th>
                    <th className="border border-slate-300 p-1 text-left">NOME</th>
                    <th className="border border-slate-300 p-1 text-left">GRAU DE PARENTESCO</th>
                    <th className="border border-slate-300 p-1 text-left">TELEFONE</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const member = resident.redeApoio?.[idx];
                    return (
                      <tr key={idx}>
                        <td className="border border-slate-300 p-1 text-center font-mono">{idx + 1}</td>
                        <td className="border border-slate-300 p-1">{member?.nome || '__________________________________________________'}</td>
                        <td className="border border-slate-300 p-1">{member?.parentesco || '__________________________'}</td>
                        <td className="border border-slate-300 p-1 font-mono">{member?.telefone || '__________________________'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Termo Assinatura */}
            <div className="border border-slate-300 p-4 rounded-sm text-[10px] space-y-4 print-no-break">
              <div className="font-bold uppercase text-slate-700">6. Termo de Ciência – Adesão e Permanência Voluntária</div>
              <p className="text-justify font-serif italic leading-relaxed">
                "Eu, {resident.usuarioNome || '__________________________________'}, declaro que tenho plena ciência de que minha adesão e permanência na Comunidade Terapêutica Acolhedora ocorrem de forma voluntária, por minha livre e espontânea vontade, sem qualquer tipo de coação. Declaro, ainda, que estou ciente de que o acolhimento possui caráter transitório, constituindo-se em etapa destinada ao meu processo de cuidado, recuperação e reinserção social e econômica."
              </p>
              <div className="flex justify-between items-end pt-4">
                <div className="w-1/2 border-t border-slate-800 text-center text-[10px] pt-1">
                  Assinatura do Acolhido: <span className="font-semibold block font-serif italic mt-0.5">{resident.termoAdesaoNome || '____________________________________'}</span>
                </div>
                <div className="w-1/3 border-t border-slate-800 text-center text-[10px] pt-1 font-mono">
                  Data: {resident.termoAdesaoData ? new Date(resident.termoAdesaoData).toLocaleDateString('pt-BR') : '____/____/______'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ANEXO II: AVALIAÇÃO DE SAÚDE --- */}
        {(anexoType === 'ALL' || anexoType === 'II') && (
          <div className="print-page-break space-y-8 flex flex-col justify-between py-12">
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center border-b-2 border-slate-800 pb-4">
                <div className="text-xs font-bold tracking-widest text-slate-500">PARANÁ</div>
                <div className="text-[10px] uppercase font-bold text-slate-600 mt-1">Secretaria do Desenvolvimento Social e Família</div>
                <h1 className="text-sm font-black uppercase mt-4 tracking-wider border-t border-slate-200 pt-2 w-full">ANEXO II – AVALIAÇÃO DE SAÚDE FAVORÁVEL PARA ACOLHIMENTO</h1>
              </div>

              <div className="py-8 space-y-6 text-sm leading-relaxed text-justify">
                <p>
                  Atesto para os devidos fins que o(a) Sr(a). <strong className="text-lg font-sans underline decoration-dotted">{resident.usuarioNome}</strong>,
                  quadro compatível com o <strong className="font-mono bg-slate-100 px-1 py-0.5 rounded-xs">CID-10 {resident.saudeCID || '__________'}</strong>, no momento se diz voluntário(a) para acolhimento institucional e não apresenta comprometimentos biológicos ou psíquicos de natureza grave que mereçam atenção médico-hospitalar contínua ou de urgência.
                </p>
                <p>
                  Sendo o que atesto para a regularidade e conformidade de leito social regulado sob as diretrizes do Estado do Paraná.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 pt-12 print-no-break">
              <span className="text-xs font-mono">Curitiba, {resident.saudeDataAvaliacao ? new Date(resident.saudeDataAvaliacao).toLocaleDateString('pt-BR') : '____ de ____________ de 2026'}.</span>
              <div className="w-80 border-t border-slate-800 text-center pt-2 mt-8">
                <span className="font-bold block text-xs">{resident.saudeMedicoNome || '___________________________________________'}</span>
                <span className="text-[10px] text-slate-500 font-mono">Médico(a) Emitente - {resident.saudeMedicoCRM || 'CRM: _________________'}</span>
              </div>
            </div>
          </div>
        )}

        {/* --- ANEXO III: PRONTUÁRIO --- */}
        {(anexoType === 'ALL' || anexoType === 'III') && (
          <div className="print-page-break space-y-6">
            <div className="flex flex-col items-center text-center border-b-2 border-slate-800 pb-4">
              <div className="text-xs font-bold tracking-widest text-slate-500">PARANÁ</div>
              <div className="text-[10px] uppercase font-bold text-slate-600 mt-1">Secretaria do Desenvolvimento Social e Família</div>
              <h1 className="text-sm font-black uppercase mt-4 tracking-wider border-t border-slate-200 pt-2 w-full">ANEXO III – PRONTUÁRIO DO ACOLHIDO</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 border border-slate-300 p-4 text-xs">
              <div><strong>NOME COMPLETO:</strong> {resident.usuarioNome}</div>
              <div><strong>Nº PRONTUÁRIO:</strong> {resident.prontuarioRG || 'Não cadastrado'}</div>
              <div><strong>DATA ADMISSÃO:</strong> {resident.prontuarioDataIngresso ? new Date(resident.prontuarioDataIngresso).toLocaleDateString('pt-BR') : '____/____/______'}</div>
              <div><strong>PREVISÃO TÉRMINO:</strong> {resident.prontuarioDataPrevistaTermino ? new Date(resident.prontuarioDataPrevistaTermino).toLocaleDateString('pt-BR') : '____/____/______'}</div>
            </div>

            {/* List of activities registered */}
            <div className="space-y-2 print-no-break">
              <h2 className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 border border-slate-300">2. Registro de Atividades Recorrentes do Prontuário</h2>
              <table className="w-full border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-300 p-1 text-left w-24">DATA</th>
                    <th className="border border-slate-300 p-1 text-left w-36">EIXO</th>
                    <th className="border border-slate-300 p-1 text-left">ATIVIDADE REALIZADA</th>
                    <th className="border border-slate-300 p-1 text-left w-32">RESPONSÁVEL</th>
                  </tr>
                </thead>
                <tbody>
                  {resident.atividades?.slice(0, 8).map(act => (
                    <tr key={act.id}>
                      <td className="border border-slate-300 p-1 font-mono">{new Date(act.data).toLocaleDateString('pt-BR')}</td>
                      <td className="border border-slate-300 p-1 capitalize">{act.tipo.replace('_', ' ')}</td>
                      <td className="border border-slate-300 p-1">{act.atividade}</td>
                      <td className="border border-slate-300 p-1">{act.responsavel}</td>
                    </tr>
                  ))}
                  {(!resident.atividades || resident.atividades.length === 0) && (
                    <tr>
                      <td colSpan={4} className="border border-slate-300 p-4 text-center text-slate-400 italic">Nenhuma atividade de laborterapia ou convívio registrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Intercorrências */}
            <div className="space-y-2 print-no-break">
              <h2 className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 border border-slate-300">3. Registro de Intercorrências / Conflitos Comportamentais</h2>
              <div className="border border-slate-300 divide-y divide-slate-200">
                {resident.intercorrencias?.slice(0, 3).map(inc => (
                  <div key={inc.id} className="p-2 text-[10px] space-y-1">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>DATA DA OCORRÊNCIA: {new Date(inc.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div><strong>Situação:</strong> {inc.situacaoOcorrida}</div>
                    <div><strong>Conduta Adotada:</strong> {inc.estrategiasAdotadas}</div>
                  </div>
                ))}
                {(!resident.intercorrencias || resident.intercorrencias.length === 0) && (
                  <div className="p-4 text-center text-slate-400 italic text-[10px]">Nenhum conflito ou intercorrência comportamental registrado no prontuário.</div>
                )}
              </div>
            </div>

            {/* Signatures RT */}
            <div className="flex justify-between items-end pt-8 print-no-break">
              <div className="w-80 border-t border-slate-800 text-center text-[10px] pt-1">
                Responsável Técnico: <span className="font-bold block">{resident.prontuarioResponsavelTecnicoNome || '__________________________________________'}</span>
                <span className="text-slate-500 font-mono block">Reg: {resident.prontuarioResponsavelTecnicoRegistro || 'CRP/CRESS _______________'}</span>
              </div>
              <div className="border-t border-slate-800 text-center text-[10px] pt-1 font-mono w-48">
                Assinatura & Carimbo do RT
              </div>
            </div>
          </div>
        )}

        {/* --- ANEXO IV: FREQUÊNCIA --- */}
        {(anexoType === 'ALL' || anexoType === 'IV') && (
          <div className="print-page-break space-y-6">
            <div className="flex flex-col items-center text-center border-b-2 border-slate-800 pb-4">
              <div className="text-xs font-bold tracking-widest text-slate-500">PARANÁ</div>
              <div className="text-[10px] uppercase font-bold text-slate-600 mt-1">Secretaria do Desenvolvimento Social e Família</div>
              <h1 className="text-sm font-black uppercase mt-4 tracking-wider border-t border-slate-200 pt-2 w-full">ANEXO IV – REGISTRO DE FREQUÊNCIA DIÁRIA DO MÊS</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 border border-slate-300 p-4 text-xs">
              <div><strong>Nome do Acolhido:</strong> {resident.usuarioNome}</div>
              <div><strong>Mês de Referência:</strong> {currentMonthYear}</div>
              <div><strong>Município Responsável:</strong> {resident.usuarioMunicipio || resident.solicitanteMunicipio}</div>
              <div><strong>Data de Ingresso:</strong> {resident.prontuarioDataIngresso ? new Date(resident.prontuarioDataIngresso).toLocaleDateString('pt-BR') : '____/____/______'}</div>
            </div>

            {/* Attendance Grid 15 cols x 2 rows or similar */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase block text-slate-700">Controle Diário de Frequência (Assinaturas Físicas / Conferência):</span>
              
              <table className="w-full border-collapse border border-slate-400 text-[10px] text-center">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-400 p-1 w-1/12">DATA</th>
                    <th className="border border-slate-400 p-1">ASSINATURA DO ACOLHIDO / STATUS</th>
                    <th className="border border-slate-400 p-1 w-1/12">DATA</th>
                    <th className="border border-slate-400 p-1">ASSINATURA DO ACOLHIDO / STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const col1Day = idx + 1;
                    const col2Day = idx + 17;
                    
                    const status1 = attendanceRegistry[col1Day] || '__________________________';
                    const status2 = col2Day <= 31 ? (attendanceRegistry[col2Day] || '__________________________') : 'S/D';

                    return (
                      <tr key={idx} className="h-7">
                        <td className="border border-slate-400 p-1 font-mono bg-slate-50 font-bold">{col1Day}/07</td>
                        <td className="border border-slate-400 p-1 text-left font-mono font-bold px-3 text-slate-700">{status1}</td>
                        <td className="border border-slate-400 p-1 font-mono bg-slate-50 font-bold">
                          {col2Day <= 31 ? `${col2Day}/07` : '-'}
                        </td>
                        <td className="border border-slate-400 p-1 text-left font-mono font-bold px-3 text-slate-700">
                          {col2Day <= 31 ? status2 : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border border-slate-300 p-3 rounded-sm text-xs text-slate-600 print-no-break">
              <strong>Observações Gerais de Frequência:</strong> {resident.prontuarioObservacoesGerais || 'Nenhuma ocorrência ou ausência justificada declarada para este período.'}
            </div>

            <div className="flex justify-between items-end pt-12 print-no-break">
              <div className="w-80 border-t border-slate-800 text-center text-[10px] pt-1">
                Profissional responsável pelos registros: <span className="font-bold block">{resident.prontuarioResponsavelTecnicoNome || '__________________________________________'}</span>
                <span className="text-slate-500 font-mono block">Reg: {resident.prontuarioResponsavelTecnicoRegistro || 'CRP/CRESS _______________'}</span>
              </div>
              <div className="w-64 border-t border-slate-800 text-center text-[10px] pt-1 font-mono">
                Assinatura do Acolhido
              </div>
            </div>
          </div>
        )}

        {/* --- ANEXO V: PLANO SINGULAR DE ATENDIMENTO (PSA) --- */}
        {(anexoType === 'ALL' || anexoType === 'V') && (
          <div className="print-page-break space-y-6">
            <div className="flex flex-col items-center text-center border-b-2 border-slate-800 pb-4">
              <div className="text-xs font-bold tracking-widest text-slate-500">PARANÁ</div>
              <div className="text-[10px] uppercase font-bold text-slate-600 mt-1">Secretaria do Desenvolvimento Social e Família</div>
              <h1 className="text-sm font-black uppercase mt-4 tracking-wider border-t border-slate-200 pt-2 w-full">ANEXO V – PLANO SINGULAR DE ATENDIMENTO (PSA)</h1>
            </div>

            <div className="space-y-4">
              <p className="text-justify text-[10px] text-slate-500 leading-relaxed font-serif italic">
                "O Plano Singular de Atendimento (PSA) é o instrumento que organiza, de forma individualizada, os objetivos e ações definidas com cada usuário acolhido, considerando suas necessidades, potencialidades e fatores de risco e proteção. Sua construção ocorre em diálogo com o usuário, a família e a rede intersetorial."
              </p>

              {/* Substâncias checkboxes print format */}
              <div className="space-y-2 print-no-break">
                <h3 className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 border border-slate-300">Histórico de Uso de Substâncias</h3>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[11px]">
                  {resident.psaHistoricoSubstancias?.map(sub => (
                    <div key={sub.substancia} className="flex items-center gap-2">
                      <span className="font-bold">{sub.selecionado ? '[ X ]' : '[   ]'}</span>
                      <span>{sub.substancia} {sub.selecionado && sub.idadeInicio && ` (Início: ${sub.idadeInicio} anos • Freq: ${sub.frequencia})`}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objetivos e metas */}
              <div className="space-y-2 print-no-break">
                <h3 className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 border border-slate-300">Objetivos e Metas do Acolhimento</h3>
                <div className="border border-slate-300 p-3 text-xs space-y-3">
                  <div>
                    <strong className="text-slate-500 text-[10px] block uppercase">Objetivos Gerais:</strong>
                    <p className="text-justify leading-relaxed mt-1">{resident.psaObjetivosGerais || '____________________________________________________'}</p>
                  </div>
                  <div>
                    <strong className="text-slate-500 text-[10px] block uppercase">Metas Pactuadas Específicas:</strong>
                    <ol className="list-decimal pl-5 mt-1 space-y-1">
                      {resident.psaMetasIndividualizadas?.filter(Boolean).map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                      {(!resident.psaMetasIndividualizadas || resident.psaMetasIndividualizadas.filter(Boolean).length === 0) && (
                        <>
                          <li>____________________________________________________</li>
                          <li>____________________________________________________</li>
                        </>
                      )}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Multidisciplinary Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-12 print-no-break">
                <div className="border-t border-slate-800 text-center text-[10px] pt-1">
                  Psicólogo(a) Clínico(a): <span className="font-bold block">{resident.responsavelPsicologoNome || '__________________________________________'}</span>
                  <span className="text-slate-500 font-mono block">Reg: {resident.responsavelPsicologoCRP || 'CRP _______________'}</span>
                </div>
                <div className="border-t border-slate-800 text-center text-[10px] pt-1">
                  Assistente Social Responsável: <span className="font-bold block">{resident.responsavelAssistenteSocialNome || '__________________________________________'}</span>
                  <span className="text-slate-500 font-mono block">Reg: {resident.responsavelAssistenteSocialCRESS || 'CRESS _______________'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
