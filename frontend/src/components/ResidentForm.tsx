/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Acolhido, SupportNetworkMember, FamilyContact, SubstanceHistory, ResidentStatus, BiologicalSex, GenderIdentity, HousingSituation, ResidenceType } from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  ClipboardList, 
  Stethoscope, 
  Users, 
  HeartHandshake, 
  AlertCircle,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { INITIAL_SUBSTANCES } from '../mockData';

interface ResidentFormProps {
  onSave: (resident: Partial<Acolhido>) => void;
  onCancel: () => void;
  residentToEdit?: Acolhido;
}

export default function ResidentForm({ onSave, onCancel, residentToEdit }: ResidentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Initialize form state
  const [formData, setFormData] = useState<Partial<Acolhido>>(() => {
    if (residentToEdit) return { ...residentToEdit };
    
    // Default initial empty form matching types
    return {
      status: 'Ativo',
      progressoPorcentagem: 10,
      
      // ANEXO I
      solicitanteEquipamento: '',
      solicitanteMunicipio: '',
      solicitanteResponsavel: '',
      solicitanteData: new Date().toISOString().split('T')[0],
      
      usuarioNome: '',
      usuarioNomeSocial: '',
      usuarioDataNascimento: '',
      usuarioNaturalidade: '',
      usuarioFiliacao: '',
      usuarioEstadoCivil: 'Solteiro',
      usuarioCPF: '',
      usuarioRG: '',
      usuarioSexoBiologico: 'Masculino',
      usuarioIdentidadeGenero: 'Cisgênero',
      usuarioPossuiCadastroUnico: 'Não',
      usuarioEndereco: '',
      usuarioNumero: '',
      usuarioBairro: '',
      usuarioTelefone: '',
      usuarioSituacaoMoradia: 'Reside com familiares',
      usuarioTipoResidencia: 'Própria',
      usuarioPerfilDeficiencia: 'Pessoa sem deficiência',
      
      redeApoio: [],
      rendaPossui: 'Não',
      rendaQual: [],
      rendaValor: '0,00',
      rendaProfissao: '',
      rendaRecebeBeneficio: 'Não',
      
      termoAdesaoNome: '',
      termoAdesaoData: new Date().toISOString().split('T')[0],
      relatoCaso: '',
      responsavelPreenchimentoNome: '',
      responsavelPreenchimentoRegistro: '',
 
      // ANEXO II
      saudeMedicoNome: '',
      saudeMedicoCRM: '',
      saudeCID: '',
      saudeDataAvaliacao: new Date().toISOString().split('T')[0],
      saudeApto: 'Sim',

      // ANEXO III
      prontuarioRG: '',
      prontuarioRendaMensal: '0,00',
      prontuarioDataIngresso: new Date().toISOString().split('T')[0],
      prontuarioDataPrevistaTermino: '',
      prontuarioResponsavelTecnicoNome: '',
      prontuarioResponsavelTecnicoRegistro: '',
      prontuarioResponsavelTecnicoData: new Date().toISOString().split('T')[0],
      prontuarioFamiliares: [],
      atividades: [],
      intercorrencias: [],
      saidasExternas: [],
      prontuarioObservacoesGerais: '',

      // ANEXO V (PSA)
      psaMotivoBusca: '',
      psaHistoriaProblemaAtualUltimoUso: '',
      psaTentativasAnterioresAbstinencia: '',
      psaSintomasAssociados: [],
      psaHistoricoSubstancias: INITIAL_SUBSTANCES.map(sub => ({
        substancia: sub,
        selecionado: false,
        idadeInicio: '',
        padraoUso: '',
        frequencia: '',
        quantidadeMedia: '',
        viaAdministracao: '',
        compulsao: 'Média',
        efeitosAdversos: '',
        periodosAbstinencia: ''
      })),
      psaGastoMedioSubstancias: '',
      psaObjetivosGerais: '',
      psaMetasIndividualizadas: ['', '', ''],
      psaIntervencoesAtendimentosTerapeuticos: '',
      psaIntervencoesAtividadesEducativas: '',
      psaIntervencoesAcompanhamentoPsicologico: '',
      psaIntervencoesOutras: '',
      psaCriteriosAcompanhamento: '',
      psaExamesAnexados: 'Não',
      psaLaudosAnexados: 'Não',
      
      ocorrenciasEvasao: '',
      ocorrenciasAcidentes: '',
      ocorrenciasGerais: '',
      comunicacoesFamilia: [],
      evolucoes: [],

      responsavelPsicologoNome: '',
      responsavelPsicologoCRP: '',
      responsavelPsicologoData: new Date().toISOString().split('T')[0],
      responsavelAssistenteSocialNome: '',
      responsavelAssistenteSocialCRESS: '',
      responsavelAssistenteSocialData: new Date().toISOString().split('T')[0],
      
      medicacoes: [],
      frequencias: []
    };
  });

  const [supportName, setSupportName] = useState('');
  const [supportRel, setSupportRel] = useState('');
  const [supportTel, setSupportTel] = useState('');

  const [famName, setFamName] = useState('');
  const [famRel, setFamRel] = useState('');
  const [famTel, setFamTel] = useState('');
  const [famCity, setFamCity] = useState('');

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (group: 'rendaQual' | 'psaSintomasAssociados', val: string, checked: boolean) => {
    setFormData(prev => {
      const list = (prev[group] as string[]) || [];
      const updated = checked ? [...list, val] : list.filter(item => item !== val);
      return { ...prev, [group]: updated };
    });
  };

  const handleSubstanceHistoryChange = (index: number, field: keyof SubstanceHistory, val: any) => {
    setFormData(prev => {
      const history = [...(prev.psaHistoricoSubstancias || [])];
      history[index] = { ...history[index], [field]: val };
      return { ...prev, psaHistoricoSubstancias: history };
    });
  };

  const addSupportMember = () => {
    if (!supportName || !supportRel) return;
    const newMember: SupportNetworkMember = {
      nome: supportName,
      parentesco: supportRel,
      telefone: supportTel
    };
    setFormData(prev => ({
      ...prev,
      redeApoio: [...(prev.redeApoio || []), newMember].slice(0, 5) // maximum 5
    }));
    setSupportName('');
    setSupportRel('');
    setSupportTel('');
  };

  const removeSupportMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      redeApoio: (prev.redeApoio || []).filter((_, i) => i !== index)
    }));
  };

  const addFamilyContact = () => {
    if (!famName || !famRel) return;
    const newContact: FamilyContact = {
      nome: famName,
      parentesco: famRel,
      telefone: famTel,
      municipio: famCity
    };
    setFormData(prev => ({
      ...prev,
      prontuarioFamiliares: [...(prev.prontuarioFamiliares || []), newContact].slice(0, 2) // maximum 2
    }));
    setFamName('');
    setFamRel('');
    setFamTel('');
    setFamCity('');
  };

  const removeFamilyContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prontuarioFamiliares: (prev.prontuarioFamiliares || []).filter((_, i) => i !== index)
    }));
  };

  const handleMetaChange = (index: number, val: string) => {
    setFormData(prev => {
      const metas = [...(prev.psaMetasIndividualizadas || [])];
      metas[index] = val;
      return { ...prev, psaMetasIndividualizadas: metas };
    });
  };

  const nextStep = () => {
    // Basic validation for Step 1
    if (currentStep === 1) {
      if (!formData.usuarioNome) {
        alert('O Nome Completo do acolhido é obrigatório.');
        return;
      }
      if (!formData.usuarioCPF) {
        alert('O CPF do acolhido é obrigatório para regulação estadual.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/residents", formData);
  };

  return (
    <div className="bg-[#0F1116] rounded-2xl border border-white/5 shadow-2xl p-6 max-w-4xl mx-auto space-y-6 text-slate-200 animate-fadeIn" id="resident-admission-form">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-200 font-sans">
            {residentToEdit ? `Editar Cadastro de: ${residentToEdit.usuarioNome}` : 'Nova Admissão / Prontuário Clínico'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Preenchimento unificado dos Anexos Oficiais de Comunidade Terapêutica do Paraná.</p>
        </div>
        <button 
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      {/* Steps Visual Indicator */}
      <div className="grid grid-cols-5 gap-2 text-center pb-2">
        {[
          { id: 1, title: 'Identificação', icon: ClipboardList },
          { id: 2, title: 'Rede & Renda', icon: Users },
          { id: 3, title: 'Avaliação Médica', icon: Stethoscope },
          { id: 4, title: 'Prontuário', icon: FileText },
          { id: 5, title: 'Plano PSA', icon: HeartHandshake }
        ].map(step => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="space-y-2">
              <div className="flex items-center justify-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all ${
                  isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' :
                  isCompleted ? 'bg-indigo-500/15 text-indigo-450 border-indigo-500/20' :
                  'bg-slate-900 text-slate-500 border-white/5'
                }`}>
                  <StepIcon className="h-4 w-4" />
                </div>
              </div>
              <span className={`text-[10px] hidden md:block font-medium ${isActive ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
        <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleFormSubmit} className="space-y-6 pt-2">
        
        {/* STEP 1: IDENTIFICATION (ANEXO I) */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn" id="step-1-fields">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1">1. Dados do Solicitante e Regulador (Anexo I)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Equipamento Solicitante</label>
                <input
                  type="text"
                  name="solicitanteEquipamento"
                  placeholder="Ex: CAPS AD III Centro"
                  value={formData.solicitanteEquipamento || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Município Solicitante</label>
                <input
                  type="text"
                  name="solicitanteMunicipio"
                  placeholder="Ex: Curitiba"
                  value={formData.solicitanteMunicipio || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Profissional Responsável</label>
                <input
                  type="text"
                  name="solicitanteResponsavel"
                  placeholder="Nome do assistente social/médico"
                  value={formData.solicitanteResponsavel || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1 mt-6">2. Identificação Civil do Acolhido (Anexo I)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Nome Completo <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="usuarioNome"
                  required
                  placeholder="Nome civil do acolhido"
                  value={formData.usuarioNome || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Nome Social (se houver)</label>
                <input
                  type="text"
                  name="usuarioNomeSocial"
                  placeholder="Apelido ou nome social"
                  value={formData.usuarioNomeSocial || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Data de Nascimento</label>
                <input
                  type="date"
                  name="usuarioDataNascimento"
                  value={formData.usuarioDataNascimento || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Naturalidade (Cidade/UF)</label>
                <input
                  type="text"
                  name="usuarioNaturalidade"
                  placeholder="Ex: Curitiba - PR"
                  value={formData.usuarioNaturalidade || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Estado Civil</label>
                <select
                  name="usuarioEstadoCivil"
                  value={formData.usuarioEstadoCivil || 'Solteiro'}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                >
                  <option value="Solteiro">Solteiro(a)</option>
                  <option value="Casado">Casado(a)</option>
                  <option value="Divorciado">Divorciado(a)</option>
                  <option value="Viúvo">Viúvo(a)</option>
                  <option value="União Estável">União Estável</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">CPF <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="usuarioCPF"
                  required
                  placeholder="000.000.000-00"
                  value={formData.usuarioCPF || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">RG nº</label>
                <input
                  type="text"
                  name="usuarioRG"
                  placeholder="Nº Registro Geral"
                  value={formData.usuarioRG || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Status no Sistema</label>
                <select
                  name="status"
                  value={formData.status || 'Ativo'}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 font-semibold text-indigo-400 focus:outline-hidden"
                >
                  <option value="Ativo">Acolhido Ativo</option>
                  <option value="Aguardando Vaga">Fila de Espera</option>
                  <option value="Inativo">Inativo / Histórico</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Sexo Biológico</label>
                <div className="flex gap-4 mt-2">
                  {(['Masculino', 'Feminino', 'Intersexual'] as BiologicalSex[]).map(s => (
                    <label key={s} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="usuarioSexoBiologico"
                        value={s}
                        checked={formData.usuarioSexoBiologico === s}
                        onChange={handleChange}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Identidade de Gênero</label>
                <select
                  name="usuarioIdentidadeGenero"
                  value={formData.usuarioIdentidadeGenero || 'Cisgênero'}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                >
                  <option value="Cisgênero">Cisgênero</option>
                  <option value="Transgênero">Transgênero</option>
                  <option value="Agênero">Agênero</option>
                  <option value="Não Binário">Não Binário</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Possui Cadastro Único (CadÚnico)</label>
                <div className="flex gap-4 mt-2">
                  {['Não', 'Sim'].map(s => (
                    <label key={s} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="usuarioPossuiCadastroUnico"
                        value={s}
                        checked={formData.usuarioPossuiCadastroUnico === s}
                        onChange={handleChange}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Filiação (Mãe e Pai)</label>
                <input
                  type="text"
                  name="usuarioFiliacao"
                  placeholder="Nome completo dos pais"
                  value={formData.usuarioFiliacao || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Endereço Residencial</label>
                <input
                  type="text"
                  name="usuarioEndereco"
                  placeholder="Rua, Avenida, Travessa..."
                  value={formData.usuarioEndereco || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Nº / Apto / Bairro</label>
                <input
                  type="text"
                  name="usuarioBairro"
                  placeholder="Nº 12 - Centro"
                  value={formData.usuarioBairro || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Telefone de Contato</label>
                <input
                  type="text"
                  name="usuarioTelefone"
                  placeholder="(00) 00000-0000"
                  value={formData.usuarioTelefone || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Situação de Moradia</label>
                <select
                  name="usuarioSituacaoMoradia"
                  value={formData.usuarioSituacaoMoradia || 'Reside com familiares'}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                >
                  <option value="Reside com familiares">Reside com familiares</option>
                  <option value="Em situação de rua">Em situação de rua</option>
                  <option value="Reside sozinho">Reside sozinho</option>
                  <option value="Unidade de Acolhimento">Unidade de Acolhimento Institucional</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Tipo de Residência</label>
                <select
                  name="usuarioTipoResidencia"
                  value={formData.usuarioTipoResidencia || 'Própria'}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                >
                  <option value="Própria">Própria</option>
                  <option value="Alugada">Alugada</option>
                  <option value="Ocupada">Ocupada</option>
                  <option value="Cedida">Cedida</option>
                  <option value="Sem residência">Sem residência / De rua</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FAMILY NETWORK & INCOME */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1">3. Rede Familiar e Rede de Apoio (Anexo I - Máximo 5)</h3>
            
            {/* Array Members Add */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Nome do Membro</label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={supportName}
                    onChange={(e) => setSupportName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Grau de Parentesco</label>
                  <input
                    type="text"
                    placeholder="Ex: Mãe, Irmão, Amigo"
                    value={supportRel}
                    onChange={(e) => setSupportRel(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase">Telefone</label>
                    <input
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={supportTel}
                      onChange={(e) => setSupportTel(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSupportMember}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                    title="Adicionar à lista"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Members Display */}
              {formData.redeApoio && formData.redeApoio.length > 0 && (
                <div className="border-t border-white/5 pt-3 mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Membros da rede de apoio cadastrados:</span>
                  <div className="divide-y divide-white/5 bg-slate-950 rounded-lg border border-white/5 overflow-hidden">
                    {formData.redeApoio.map((member, i) => (
                      <div key={i} className="px-3 py-2 flex items-center justify-between text-xs text-slate-300">
                        <div>
                          <span className="font-semibold">{member.nome}</span> 
                          <span className="text-slate-500"> ({member.parentesco})</span>
                          {member.telefone && <span className="text-slate-400 font-mono ml-2"> - Tel: {member.telefone}</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSupportMember(i)}
                          className="text-rose-400 hover:text-rose-350 p-1 hover:bg-white/5 rounded-sm cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1 mt-6">4. Perfil de Renda e Trabalho (Anexo I)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase font-sans">Possui Alguma Renda?</label>
                <div className="flex gap-4 mt-2">
                  {['Não', 'Sim'].map(s => (
                    <label key={s} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="rendaPossui"
                        value={s}
                        checked={formData.rendaPossui === s}
                        onChange={handleChange}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Profissão ou Ocupação</label>
                <input
                  type="text"
                  name="rendaProfissao"
                  placeholder="Ex: Pintor, Carpinteiro"
                  value={formData.rendaProfissao || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Valor Mensal Estimado (R$)</label>
                <input
                  type="text"
                  name="rendaValor"
                  placeholder="Ex: 1.412,00"
                  value={formData.rendaValor || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Qual a origem da renda?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Aposentadoria', 'Pensão', 'Auxílio-doença', 'Trabalho formal', 'Trabalho informal', 'Bicos'].map(r => (
                    <label key={r} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.rendaQual || []).includes(r)}
                        onChange={(e) => handleCheckboxChange('rendaQual', r, e.target.checked)}
                        className="rounded-sm text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Recebe Benefício Socioassistencial?</label>
                <div className="flex gap-4 mt-2">
                  {['Não', 'Sim'].map(s => (
                    <label key={s} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="rendaRecebeBeneficio"
                        value={s}
                        checked={formData.rendaRecebeBeneficio === s}
                        onChange={handleChange}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Qual Benefício (Bolsa Família, BPC, etc)?</label>
                <input
                  type="text"
                  name="rendaRecebeBeneficioQual"
                  placeholder="Ex: Bolsa Família de R$ 600"
                  value={formData.rendaRecebeBeneficioQual || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden disabled:opacity-50"
                  disabled={formData.rendaRecebeBeneficio === 'Não'}
                />
              </div>
            </div>

            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1 mt-6">5. Termo de Adesão e Ciência Voluntária</h3>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 text-[11px] text-slate-300 space-y-3">
              <p className="leading-relaxed font-serif italic text-justify">
                "Eu, <strong className="font-sans text-indigo-400">{formData.usuarioNome || '[Nome do Acolhido]'}</strong>, declaro que tenho plea ciência de que minha adesão e permanência na Comunidade Terapêutica Acolhedora ocorrem de forma voluntária, por minha livre e espontânea vontade, sem qualquer tipo de coação. Declaro, ainda, que estou ciente de que o acolhimento possui caráter transitório, constituindo-se em etapa destinada ao meu processo de cuidado, recuperação e reinserção social e econômica."
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Nome para Assinatura do Termo</label>
                  <input
                    type="text"
                    name="termoAdesaoNome"
                    placeholder="Assinatura digitada"
                    value={formData.termoAdesaoNome || ''}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-1 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Data da Ciência</label>
                  <input
                    type="date"
                    name="termoAdesaoData"
                    value={formData.termoAdesaoData || ''}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-1 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MEDICAL MEDICAL CLEARANCE (ANEXO II) */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1">6. Avaliação de Saúde Favorável para Acolhimento (Anexo II)</h3>
            <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
              <p className="text-[11px] text-slate-300 leading-relaxed">
                A <strong>Avaliação de Saúde constitui etapa obrigatória e prévia ao encaminhamento</strong> do acolhido. O médico atesta a inexistência de impedimentos clínicos graves, formalizando a aptidão para acolhimento voluntário não emergencial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Médico Emitente (Atestante)</label>
                <input
                  type="text"
                  name="saudeMedicoNome"
                  placeholder="Nome do médico responsável"
                  value={formData.saudeMedicoNome || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">CRM do Médico (nº/UF)</label>
                <input
                  type="text"
                  name="saudeMedicoCRM"
                  placeholder="Ex: CRM-PR 12345"
                  value={formData.saudeMedicoCRM || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Quadro Compatível com CID-10</label>
                <input
                  type="text"
                  name="saudeCID"
                  placeholder="Ex: F10.2 - Síndrome de Dependência Alcoólica"
                  value={formData.saudeCID || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Data da Avaliação Médica</label>
                <input
                  type="date"
                  name="saudeDataAvaliacao"
                  value={formData.saudeDataAvaliacao || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Apto para Acolhimento em CT?</label>
                <select
                  name="saudeApto"
                  value={formData.saudeApto || 'Sim'}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                >
                  <option value="Sim">Sim, clinicamente apto (Voluntário, sem emergência)</option>
                  <option value="Não">Não, necessita de cuidados hospitalares/contínuos</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: RESIDENT CHART (ANEXO III) */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1">7. Informações de Prontuário de Ingresso (Anexo III)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Prontuário RG / ID Interno</label>
                <input
                  type="text"
                  name="prontuarioRG"
                  placeholder="Repetir RG ou Código Interno"
                  value={formData.prontuarioRG || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Renda Declarada para Faturamento</label>
                <input
                  type="text"
                  name="prontuarioRendaMensal"
                  placeholder="R$ 1.500,00"
                  value={formData.prontuarioRendaMensal || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Data de Ingresso na Instituição</label>
                <input
                  type="date"
                  name="prontuarioDataIngresso"
                  value={formData.prontuarioDataIngresso || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-indigo-400 font-semibold focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Data Prevista de Término (Máx 6 meses)</label>
                <input
                  type="date"
                  name="prontuarioDataPrevistaTermino"
                  value={formData.prontuarioDataPrevistaTermino || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Responsável Técnico pelo Ingresso (Psicólogo / Assistente Social)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                  <input
                    type="text"
                    name="prontuarioResponsavelTecnicoNome"
                    placeholder="Nome do técnico"
                    value={formData.prontuarioResponsavelTecnicoNome || ''}
                    onChange={handleChange}
                    className="px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden sm:col-span-2"
                  />
                  <input
                    type="text"
                    name="prontuarioResponsavelTecnicoRegistro"
                    placeholder="Registro (CRP/CRESS)"
                    value={formData.prontuarioResponsavelTecnicoRegistro || ''}
                    onChange={handleChange}
                    className="px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1 mt-6">8. Contato Urgente de Familiares (Anexo III - Limite 2)</h3>
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Nome do parente"
                    value={famName}
                    onChange={(e) => setFamName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Parentesco</label>
                  <input
                    type="text"
                    placeholder="Ex: Esposa, Tio"
                    value={famRel}
                    onChange={(e) => setFamRel(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Telefone</label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={famTel}
                    onChange={(e) => setFamTel(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase">Município</label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={famCity}
                      onChange={(e) => setFamCity(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addFamilyContact}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {formData.prontuarioFamiliares && formData.prontuarioFamiliares.length > 0 && (
                <div className="border-t border-white/5 pt-3 mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Contatos de urgência cadastrados (Anexo III):</span>
                  <div className="divide-y divide-white/5 bg-slate-950 rounded-lg border border-white/5 overflow-hidden">
                    {formData.prontuarioFamiliares.map((fam, i) => (
                      <div key={i} className="px-3 py-2 flex items-center justify-between text-xs text-slate-300">
                        <div>
                          <span className="font-semibold">{fam.nome}</span> 
                          <span className="text-slate-500"> ({fam.parentesco})</span>
                          <span className="text-slate-400 ml-2"> - Tel: {fam.telefone} ({fam.municipio})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFamilyContact(i)}
                          className="text-rose-400 hover:text-rose-350 p-1 cursor-pointer hover:bg-white/5 rounded-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase">Relato Detalhado do Caso / Parecer Inicial de Admissão</label>
              <textarea
                name="relatoCaso"
                rows={4}
                placeholder="Descrever a demanda relatada pelo acolhido, seu estado físico, emocional, histórico recente de problemas sociais e encaminhamentos."
                value={formData.relatoCaso || ''}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden leading-relaxed font-sans"
              />
            </div>
          </div>
        )}

        {/* STEP 5: INDIVIDUAL THERAPEUTIC PLAN - PSA (ANEXO V) */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fadeIn max-h-160 overflow-y-auto pr-2" id="step-5-fields">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-1">9. Plano Singular de Atendimento - PSA (Anexo V)</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Motivo da Busca pelo Atendimento (Relato do Usuário)</label>
                <textarea
                  name="psaMotivoBusca"
                  rows={2}
                  placeholder="Como o acolhido descreve a necessidade de tratamento..."
                  value={formData.psaMotivoBusca || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase font-sans">Histórico: Último Uso de Substâncias (O que/Quando)</label>
                  <input
                    type="text"
                    name="psaHistoriaProblemaAtualUltimoUso"
                    placeholder="Ex: Crack e Cerveja há 3 dias"
                    value={formData.psaHistoriaProblemaAtualUltimoUso || ''}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase">Tentativas Anteriores de Redução / Abstinência</label>
                  <input
                    type="text"
                    name="psaTentativasAnterioresAbstinencia"
                    placeholder="Nº de internações ou tratamentos anteriores"
                    value={formData.psaTentativasAnterioresAbstinencia || ''}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Sintomas Associados Apresentados</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['fissura', 'abstinência', 'alterações de humor', 'agressividade', 'isolamento'].map(s => (
                    <label key={s} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.psaSintomasAssociados || []).includes(s)}
                        onChange={(e) => handleCheckboxChange('psaSintomasAssociados', s, e.target.checked)}
                        className="rounded-sm text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="capitalize">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Substance Checklist with detailed row entry */}
              <div>
                <label className="block text-[11px] font-semibold text-indigo-400 uppercase mb-1.5">Histórico Físico de Uso por Substância</label>
                <p className="text-[10px] text-slate-500 mb-2">Marque as substâncias consumidas e preencha as estimativas para o PSA:</p>
                
                <div className="border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
                  {formData.psaHistoricoSubstancias?.map((item, index) => (
                    <div key={item.substancia} className="p-3 bg-[#0A0B0E] hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.selecionado}
                          onChange={(e) => handleSubstanceHistoryChange(index, 'selecionado', e.target.checked)}
                          className="rounded-sm text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-200 w-32">{item.substancia}</span>
                        
                        {item.selecionado && (
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1 mt-2 sm:mt-0 animate-fadeIn">
                            <input
                              type="text"
                              placeholder="Idade início"
                              value={item.idadeInicio}
                              onChange={(e) => handleSubstanceHistoryChange(index, 'idadeInicio', e.target.value)}
                              className="px-2 py-1 text-[11px] border border-white/5 rounded-sm bg-slate-950 text-slate-200 focus:outline-hidden"
                            />
                            <input
                              type="text"
                              placeholder="Frequência"
                              value={item.frequencia}
                              onChange={(e) => handleSubstanceHistoryChange(index, 'frequencia', e.target.value)}
                              className="px-2 py-1 text-[11px] border border-white/5 rounded-sm bg-slate-950 text-slate-200 focus:outline-hidden"
                            />
                            <input
                              type="text"
                              placeholder="Qtd Média"
                              value={item.quantidadeMedia}
                              onChange={(e) => handleSubstanceHistoryChange(index, 'quantidadeMedia', e.target.value)}
                              className="px-2 py-1 text-[11px] border border-white/5 rounded-sm bg-slate-950 text-slate-200 focus:outline-hidden"
                            />
                            <input
                              type="text"
                              placeholder="Via Adm."
                              value={item.viaAdministracao}
                              onChange={(e) => handleSubstanceHistoryChange(index, 'viaAdministracao', e.target.value)}
                              className="px-2 py-1 text-[11px] border border-white/5 rounded-sm bg-slate-950 text-slate-200 focus:outline-hidden"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">Gasto Médio Mensal com o Uso (R$)</label>
                <input
                  type="text"
                  name="psaGastoMedioSubstancias"
                  placeholder="Ex: R$ 1.500,00"
                  value={formData.psaGastoMedioSubstancias || ''}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div className="border-t border-white/5 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase">Objetivos e Metas Terapêuticas (PSA)</h4>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase">Objetivos Gerais do Acolhimento</label>
                  <textarea
                    name="psaObjetivosGerais"
                    rows={2}
                    placeholder="Ex: Manutenção da abstinência estável, melhora do quadro físico, reatar vínculos com filhos..."
                    value={formData.psaObjetivosGerais || ''}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-1.5 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase">Metas Individuais Pactuadas (Até 4 metas específicas)</label>
                  {[0, 1, 2, 3].map(idx => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400">{idx + 1}.</span>
                      <input
                        type="text"
                        placeholder={`Descrever meta específica de reabilitação nº ${idx + 1}`}
                        value={formData.psaMetasIndividualizadas?.[idx] || ''}
                        onChange={(e) => handleMetaChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1 text-xs border border-white/5 rounded-lg bg-slate-950 text-slate-200 placeholder:text-slate-650 focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase">10. Responsáveis Técnicos Multidiscplinares (Assinatura do PSA)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Psicologo */}
                  <div className="bg-[#0A0B0E] p-3 rounded-lg space-y-2 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Responsabilidade da Psicologia</span>
                    <input
                      type="text"
                      name="responsavelPsicologoNome"
                      placeholder="Nome do Psicólogo(a)"
                      value={formData.responsavelPsicologoNome || ''}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      name="responsavelPsicologoCRP"
                      placeholder="Nº Registro CRP"
                      value={formData.responsavelPsicologoCRP || ''}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 focus:outline-hidden"
                    />
                  </div>

                  {/* Assistente Social */}
                  <div className="bg-[#0A0B0E] p-3 rounded-lg space-y-2 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Responsabilidade do Serviço Social</span>
                    <input
                      type="text"
                      name="responsavelAssistenteSocialNome"
                      placeholder="Nome do Assistente Social"
                      value={formData.responsavelAssistenteSocialNome || ''}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      name="responsavelAssistenteSocialCRESS"
                      placeholder="Nº Registro CRESS"
                      value={formData.responsavelAssistenteSocialCRESS || ''}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1 text-xs border border-white/5 rounded-md bg-slate-950 text-slate-200 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
          <button
            type="button"
            onClick={prevStep}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border ${
              currentStep === 1 
                ? 'text-slate-600 border-white/5 pointer-events-none opacity-40' 
                : 'text-slate-300 hover:bg-white/5 border border-white/5'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Avançar</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              id="btn-save-resident"
            >
              <Save className="h-4 w-4" />
              <span>Salvar Prontuário Clínico</span>
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
