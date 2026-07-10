/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BiologicalSex = 'Masculino' | 'Feminino' | 'Intersexual';
export type GenderIdentity = 'Cisgênero' | 'Transgênero' | 'Agênero' | 'Não Binário' | 'Outro';
export type HousingSituation = 'Unidade de Acolhimento' | 'Em situação de rua' | 'Reside sozinho' | 'Reside com familiares' | 'Outro';
export type ResidenceType = 'Própria' | 'Alugada' | 'Ocupada' | 'Cedida' | 'Sem residência';
export type ResidentStatus = 'Ativo' | 'Inativo' | 'Aguardando Vaga';

export interface SupportNetworkMember {
  nome: string;
  parentesco: string;
  telefone: string;
}

export interface FamilyContact {
  nome: string;
  parentesco: string;
  telefone: string;
  municipio: string;
}

export interface ActivityRecord {
  id: string;
  tipo: 'recreativa' | 'desenvolvimento_interior' | 'autocuidado' | 'capacitacao';
  atividade: string;
  data: string;
  responsavel: string;
  observacoes: string;
}

export interface IncidentRecord {
  id: string;
  data: string;
  situacaoOcorrida: string;
  estrategiasAdotadas: string;
  encaminhamentosRealizados: string;
}

export interface OutingRecord {
  id: string;
  data: string;
  acompanhante: string;
  horarioSaidaRetorno: string;
  observacoes: string;
}

export interface SubstanceHistory {
  substancia: string;
  selecionado: boolean;
  idadeInicio: string;
  padraoUso: string;
  frequencia: string;
  quantidadeMedia: string;
  viaAdministracao: string;
  compulsao: string;
  efeitosAdversos: string;
  periodosAbstinencia: string;
}

export interface EvolutionRecord {
  id: string;
  data: string;
  profissional: string;
  registro: string;
}

export interface FamilyCommunication {
  id: string;
  data: string;
  nomeContactado: string;
  assunto: string;
  profissional: string;
}

export interface Medication {
  id: string;
  nome: string;
  dosagem: string;
  frequenciaHoras: number; // e.g. 8 for 8/8h, 12 for 12/12h, 24 for daily
  horarios: string[]; // e.g. ["08:00", "16:00", "00:00"]
  dataInicio: string;
  dataFim?: string;
  ativo: boolean;
  observacoes?: string;
  alertasAtivos: boolean;
}

export interface MedicationLog {
  id: string;
  residentId: string;
  medicationId: string;
  medicationNome: string;
  dosagem: string;
  horarioPrevisto: string; // "YYYY-MM-DD HH:mm"
  horarioRealizado?: string;
  status: 'Pendente' | 'Administrado' | 'Atrasado' | 'Não Tomado';
  administradoPor?: string;
  alertasAtivos?: boolean;
}

export interface AttendanceRecord {
  periodoReferencia: string; // "MM/YYYY"
  registro: { [dia: number]: 'Presente' | 'Ausente' | 'Falta Justificada' | '' };
}

export interface Acolhido {
  id: string;
  status: ResidentStatus;
  fotoUrl?: string;
  progressoPorcentagem: number; // 0 to 100 calculated/simulated
  usuarioMunicipio?: string;

  // ANEXO I - Formulário de Solicitação de Vaga
  solicitanteEquipamento: string;
  solicitanteMunicipio: string;
  solicitanteResponsavel: string;
  solicitanteData: string;

  usuarioNome: string;
  usuarioNomeSocial: string;
  usuarioDataNascimento: string;
  usuarioNaturalidade: string;
  usuarioFiliacao: string;
  usuarioEstadoCivil: string;
  usuarioCPF: string;
  usuarioRG: string;
  usuarioRNE?: string;
  usuarioSexoBiologico: BiologicalSex;
  usuarioIdentidadeGenero: GenderIdentity;
  usuarioPossuiCadastroUnico: 'Sim' | 'Não';
  usuarioEndereco: string;
  usuarioNumero: string;
  usuarioBairro: string;
  usuarioTelefone: string;
  usuarioSituacaoMoradia: HousingSituation;
  usuarioSituacaoMoradiaQual?: string;
  usuarioTipoResidencia: ResidenceType;
  usuarioTipoResidenciaQual?: string;
  usuarioPerfilDeficiencia: 'Pessoa sem deficiência' | 'Pessoa com deficiência';
  usuarioPerfilDeficienciaQual?: string;
  
  redeApoio: SupportNetworkMember[]; // Maximum 5
  
  rendaPossui: 'Sim' | 'Não';
  rendaQual: string[]; // ['Trabalho formal', 'Trabalho informal', etc]
  rendaQualOutro?: string;
  rendaValor: string;
  rendaProfissao: string;
  rendaRecebeBeneficio: 'Sim' | 'Não';
  rendaRecebeBeneficioQual?: string; // Bolsa Família, BPC, Outro

  termoAdesaoNome: string;
  termoAdesaoData: string;
  
  relatoCaso: string;
  responsavelPreenchimentoNome: string;
  responsavelPreenchimentoRegistro: string;

  // ANEXO II - Avaliação de Saúde Favorável
  saudeMedicoNome: string;
  saudeMedicoCRM: string;
  saudeCID: string;
  saudeDataAvaliacao: string;
  saudeApto: 'Sim' | 'Não';

  // ANEXO III - Prontuário do Acolhido
  prontuarioRG: string;
  prontuarioRendaMensal: string;
  prontuarioDataIngresso: string;
  prontuarioDataPrevistaTermino: string;
  prontuarioResponsavelTecnicoNome: string;
  prontuarioResponsavelTecnicoRegistro: string;
  prontuarioResponsavelTecnicoData: string;
  prontuarioFamiliares: FamilyContact[]; // Max 2
  
  atividades: ActivityRecord[];
  intercorrencias: IncidentRecord[];
  saidasExternas: OutingRecord[];
  prontuarioObservacoesGerais: string;

  // ANEXO IV - Registro de Frequência
  frequencias: AttendanceRecord[];

  // ANEXO V - Plano Singular de Atendimento (PSA)
  psaMotivoBusca: string;
  psaHistoriaProblemaAtualUltimoUso: string;
  psaTentativasAnterioresAbstinencia: string;
  psaSintomasAssociados: string[]; // fissura, abstinência, alterações de humor, agressividade, isolamento, outros
  psaHistoricoSubstancias: SubstanceHistory[];
  psaGastoMedioSubstancias: string;
  psaObjetivosGerais: string;
  psaMetasIndividualizadas: string[]; // Up to 4 metas
  psaIntervencoesAtendimentosTerapeuticos: string;
  psaIntervencoesAtividadesEducativas: string;
  psaIntervencoesAcompanhamentoPsicologico: string;
  psaIntervencoesOutras: string;
  psaCriteriosAcompanhamento: string;
  
  evolucoes: EvolutionRecord[];
  psaExamesAnexados: 'Sim' | 'Não';
  psaLaudosAnexados: 'Sim' | 'Não';
  
  ocorrenciasEvasao: string;
  ocorrenciasAcidentes: string;
  ocorrenciasGerais: string;
  comunicacoesFamilia: FamilyCommunication[];

  psaDesligamentoModalidade?: 'Desligamento planejado' | 'Solicitação do acolhido' | 'Evasão' | 'Descumprimento das normas' | 'Transferência' | 'Outros';
  psaDesligamentoModalidadeOutro?: string;
  psaDesligamentoCondicoes?: string;
  psaDesligamentoEncaminhamentos?: string[]; // 'Restabelecimento de vínculos', etc
  psaDesligamentoEncaminhamentosOutros?: string;
  psaDesligamentoParecerFinal?: string;

  // Equipe Multidisciplinar
  responsavelPsicologoNome: string;
  responsavelPsicologoCRP: string;
  responsavelPsicologoData: string;
  responsavelAssistenteSocialNome: string;
  responsavelAssistenteSocialCRESS: string;
  responsavelAssistenteSocialData: string;

  // Medicações prescritas
  medicacoes: Medication[];
}
