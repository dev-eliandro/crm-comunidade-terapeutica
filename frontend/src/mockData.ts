/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Acolhido } from './types';

export const INITIAL_SUBSTANCES = [
  'Álcool', 'Tabaco', 'Maconha', 'Cocaína', 'Crack', 'LSD', 'Ecstasy', 'Ketamina', 'Benzodiazepínicos', 'Opiáceos', 'Inalantes'
];

export const MOCK_ACOLHIDOS: Acolhido[] = [
  {
    id: 'rec-1',
    status: 'Ativo',
    progressoPorcentagem: 75,
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    
    // ANEXO I
    solicitanteEquipamento: 'CAPS AD III - Curitiba',
    solicitanteMunicipio: 'Curitiba',
    solicitanteResponsavel: 'Dra. Maria Helena Souza (Psiquiatra)',
    solicitanteData: '2026-04-10',
    
    usuarioNome: 'Roberto de Almeida Santos',
    usuarioNomeSocial: 'Roberto Almeida',
    usuarioDataNascimento: '1991-08-15',
    usuarioNaturalidade: 'Pontal do Paraná - PR',
    usuarioFiliacao: 'Juliana de Almeida Santos e Carlos Alberto Santos',
    usuarioEstadoCivil: 'Solteiro',
    usuarioCPF: '123.456.789-00',
    usuarioRG: '9.876.543-2 PR',
    usuarioRNE: '',
    usuarioSexoBiologico: 'Masculino',
    usuarioIdentidadeGenero: 'Cisgênero',
    usuarioPossuiCadastroUnico: 'Sim',
    usuarioEndereco: 'Rua das Flores, 1024',
    usuarioNumero: '1024',
    usuarioBairro: 'Centro',
    usuarioTelefone: '(41) 98888-1111',
    usuarioSituacaoMoradia: 'Reside com familiares',
    usuarioTipoResidencia: 'Própria',
    usuarioPerfilDeficiencia: 'Pessoa sem deficiência',
    
    redeApoio: [
      { nome: 'Juliana de Almeida Santos', parentesco: 'Mãe', telefone: '(41) 98888-2222' },
      { nome: 'Carlos Alberto Santos', parentesco: 'Pai', telefone: '(41) 98888-3333' }
    ],
    
    rendaPossui: 'Sim',
    rendaQual: ['Trabalho informal'],
    rendaValor: '1500,00',
    rendaProfissao: 'Auxiliar de Cozinha',
    rendaRecebeBeneficio: 'Não',
    
    termoAdesaoNome: 'Roberto de Almeida Santos',
    termoAdesaoData: '2026-04-12',
    
    relatoCaso: 'Usuário encaminhado pelo CAPS AD apresentando padrão de uso abusivo de Crack e Álcool há mais de 5 anos. Relata perda de vínculos empregatícios e desgaste acentuado nas relações familiares. Manifesta desejo voluntário de ingressar na comunidade terapêutica buscando reabilitação e reinserção social.',
    responsavelPreenchimentoNome: 'Paula Roberta Lima',
    responsavelPreenchimentoRegistro: 'AS 4512-PR',

    // ANEXO II
    saudeMedicoNome: 'Dr. Fernando Henrique Rocha',
    saudeMedicoCRM: 'CRM-PR 24512',
    saudeCID: 'F19.2 - Transtornos mentais decorrentes do uso de múltiplas drogas',
    saudeDataAvaliacao: '2026-04-11',
    saudeApto: 'Sim',

    // ANEXO III
    prontuarioRG: '9.876.543-2 PR',
    prontuarioRendaMensal: '1.500,00',
    prontuarioDataIngresso: '2026-04-12',
    prontuarioDataPrevistaTermino: '2026-10-12',
    prontuarioResponsavelTecnicoNome: 'Claudio Antunes Moreira',
    prontuarioResponsavelTecnicoRegistro: 'CRP-08/45120',
    prontuarioResponsavelTecnicoData: '2026-04-12',
    
    prontuarioFamiliares: [
      { nome: 'Juliana de Almeida Santos', parentesco: 'Mãe', telefone: '(41) 98888-2222', municipio: 'Curitiba' }
    ],
    
    atividades: [
      { id: 'act-1', tipo: 'recreativa', atividade: 'Futebol e Atividade de Integração Física', data: '2026-06-20', responsavel: 'Eduardo Santos (Educador)', observacoes: 'Participou ativamente demonstrando boa integração com o grupo.' },
      { id: 'act-2', tipo: 'desenvolvimento_interior', atividade: 'Roda de Espiritualidade Ecumênica', data: '2026-06-21', responsavel: 'Claudio Antunes (Psicólogo)', observacoes: 'Compartilhou sentimentos de esperança e expressou gratidão.' },
      { id: 'act-3', tipo: 'autocuidado', atividade: 'Organização de Alojamento e Higiene Pessoal', data: '2026-06-22', responsavel: 'Paula Silva (Monitora)', observacoes: 'Mantém seu armário e cama impecavelmente limpos.' },
      { id: 'act-4', tipo: 'capacitacao', atividade: 'Oficina de Horta e Jardinagem', data: '2026-06-23', responsavel: 'Marcos Souza (Agrônomo)', observacoes: 'Demonstrou facilidade e interesse no plantio de hortaliças.' }
    ],
    
    intercorrencias: [
      { id: 'inc-1', data: '2026-04-20', situacaoOcorrida: 'Forte fissura e choro no período noturno', estrategiasAdotadas: 'Acolhimento pela monitoria de plantão, escuta ativa e chá calmante.', encaminhamentosRealizados: 'Encaminhado ao psicólogo na manhã seguinte.' }
    ],
    
    saidasExternas: [
      { id: 'out-1', data: '2026-06-15', acompanhante: 'Carlos Alberto Santos (Pai)', horarioSaidaRetorno: '14:00 às 18:00', observacoes: 'Saída autorizada para almoço de aniversário do pai. Retornou no horário pontual, lúcido e tranquilo.' }
    ],
    
    prontuarioObservacoesGerais: 'Acolhido tem se mostrado extremamente colaborativo com as normas internas, assumindo responsabilidades na horta com louvor.',

    // ANEXO IV (Frequência do mês corrente - Julho/2026)
    frequencias: [
      {
        periodoReferencia: '07/2026',
        registro: {
          1: 'Presente', 2: 'Presente', 3: 'Presente', 4: 'Presente', 5: 'Presente', 
          6: 'Presente', 7: 'Presente', 8: '', 9: '', 10: '', 11: '', 12: '', 13: '',
          14: '', 15: '', 16: '', 17: '', 18: '', 19: '', 20: '', 21: '', 22: '', 
          23: '', 24: '', 25: '', 26: '', 27: '', 28: '', 29: '', 30: '', 31: ''
        }
      }
    ],

    // ANEXO V - PSA
    psaMotivoBusca: 'Dependência química severa e ruptura familiar devido ao consumo de Crack.',
    psaHistoriaProblemaAtualUltimoUso: 'Último uso há 4 dias do ingresso (08/04/2026) - Crack e Cerveja. Relata 3 internações anteriores sem sucesso (recidivas em menos de 30 dias após alta).',
    psaTentativasAnterioresAbstinencia: 'Três internações em clínicas psiquiátricas fechadas.',
    psaSintomasAssociados: ['fissura', 'alterações de humor', 'isolamento'],
    psaHistoricoSubstancias: [
      { substancia: 'Álcool', selecionado: true, idadeInicio: '15', padraoUso: 'Abusivo nos finais de semana', frequencia: 'Diária ultimamente', quantidadeMedia: '12 latas/dia', viaAdministracao: 'Oral', compulsao: 'Média', efeitosAdversos: 'Problemas estomacais, tremores', periodosAbstinencia: '30 dias max' },
      { substancia: 'Maconha', selecionado: true, idadeInicio: '18', padraoUso: 'Esporádico', frequencia: 'Raro', quantidadeMedia: '1 cigarro', viaAdministracao: 'Inalada', compulsao: 'Baixa', efeitosAdversos: 'Letargia', periodosAbstinencia: 'Anos' },
      { substancia: 'Crack', selecionado: true, idadeInicio: '25', padraoUso: 'Compulsivo diário', frequencia: 'Várias vezes ao dia', quantidadeMedia: '10 pedras/dia', viaAdministracao: 'Inalada/Fumada', compulsao: 'Extrema', efeitosAdversos: 'Perda de peso acentuada, paranoia, insônia', periodosAbstinencia: '60 dias max' },
      { substancia: 'Tabaco', selecionado: true, idadeInicio: '16', padraoUso: 'Diário', frequencia: 'Constante', quantidadeMedia: '1 maço/dia', viaAdministracao: 'Fumada', compulsao: 'Alta', efeitosAdversos: 'Tosse crônica', periodosAbstinencia: 'Nenhum' }
    ],
    psaGastoMedioSubstancias: 'R$ 2.000,00 por mês (financiado por bicos e venda de pertences pessoais).',
    psaObjetivosGerais: 'Manutenção da sobriedade estável, reestruturação da saúde mental e física, reconstrução dos vínculos afetivos familiares e retorno ao mercado de trabalho formal.',
    psaMetasIndividualizadas: [
      'Aprender técnicas de manejo de fissura e gatilhos.',
      'Melhorar o condicionamento físico e restabelecer peso saudável (meta +8kg).',
      'Restabelecer comunicação semanal saudável com os pais.',
      'Concluir o curso de Horticultura Orgânica ministrado na CT.'
    ],
    psaIntervencoesAtendimentosTerapeuticos: 'Terapia Cognitivo-Comportamental em grupo focada em prevenção de recaída (TRE).',
    psaIntervencoesAtividadesEducativas: 'Participação nas oficinas de jardinagem e panificação.',
    psaIntervencoesAcompanhamentoPsicologico: 'Sessões individuais semanais para elaboração de traumas passados e regulação emocional.',
    psaIntervencoesOutras: 'Acompanhamento psiquiátrico mensal no CAPS de referência.',
    psaCriteriosAcompanhamento: 'Avaliações de evolução semanais, assiduidade nas atividades terapêuticas e de laborterapia, engajamento familiar.',
    
    evolucoes: [
      { id: 'ev-1', data: '2026-04-15', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Acolhido na primeira fase. Apresenta ansiedade e queixas de insônia leves. Foco na adaptação ambiental.' },
      { id: 'ev-2', data: '2026-05-15', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Evolução bastante favorável. Ganhou 4kg, dorme melhor e expressa com clareza seus gatilhos.' },
      { id: 'ev-3', data: '2026-06-15', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Apresenta excelente introspecção. Lida bem com frustrações cotidianas do alojamento.' }
    ],
    
    psaExamesAnexados: 'Sim',
    psaLaudosAnexados: 'Sim',
    ocorrenciasEvasao: 'Nenhuma registrada.',
    ocorrenciasAcidentes: 'Nenhum registrado.',
    ocorrenciasGerais: 'Acolhido de comportamento exemplar.',
    
    comunicacoesFamilia: [
      { id: 'com-1', data: '2026-05-02', nomeContactado: 'Juliana de Almeida Santos (Mãe)', assunto: 'Informar sobre o progresso e agendar primeira visita presencial.', profissional: 'Ana Paula (Assistente Social)' }
    ],

    responsavelPsicologoNome: 'Claudio Antunes Moreira',
    responsavelPsicologoCRP: 'CRP-08/45120',
    responsavelPsicologoData: '2026-04-12',
    responsavelAssistenteSocialNome: 'Ana Paula Rodrigues',
    responsavelAssistenteSocialCRESS: 'CRESS-PR 6720',
    responsavelAssistenteSocialData: '2026-04-12',

    // Medicações
    medicacoes: [
      {
        id: 'med-1',
        nome: 'Sertralina',
        dosagem: '50mg',
        frequenciaHoras: 24,
        horarios: ['08:00'],
        dataInicio: '2026-04-12',
        ativo: true,
        observacoes: 'Tomar pela manhã após café.',
        alertasAtivos: true
      },
      {
        id: 'med-2',
        nome: 'Quetiapina',
        dosagem: '25mg',
        frequenciaHoras: 24,
        horarios: ['22:00'],
        dataInicio: '2026-04-12',
        ativo: true,
        observacoes: 'Indutor de sono.',
        alertasAtivos: true
      }
    ]
  },
  {
    id: 'rec-2',
    status: 'Ativo',
    progressoPorcentagem: 40,
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    
    solicitanteEquipamento: 'Secretaria de Assistência Social - Colombo',
    solicitanteMunicipio: 'Colombo',
    solicitanteResponsavel: 'Marcos Vinícius Torres (Assistente Social)',
    solicitanteData: '2026-05-18',
    
    usuarioNome: 'Amanda Costa Oliveira',
    usuarioNomeSocial: 'Amanda Oliveira',
    usuarioDataNascimento: '1998-11-04',
    usuarioNaturalidade: 'Curitiba - PR',
    usuarioFiliacao: 'Sandra Costa Oliveira e Roberto Oliveira',
    usuarioEstadoCivil: 'Divorciada',
    usuarioCPF: '987.654.321-99',
    usuarioRG: '11.222.333-4 PR',
    usuarioSexoBiologico: 'Feminino',
    usuarioIdentidadeGenero: 'Cisgênero',
    usuarioPossuiCadastroUnico: 'Sim',
    usuarioEndereco: 'Avenida Principal, 400',
    usuarioNumero: '400',
    usuarioBairro: 'Guaraituba',
    usuarioTelefone: '(41) 97777-5555',
    usuarioSituacaoMoradia: 'Reside com familiares',
    usuarioTipoResidencia: 'Alugada',
    usuarioPerfilDeficiencia: 'Pessoa sem deficiência',
    
    redeApoio: [
      { nome: 'Sandra Costa Oliveira', parentesco: 'Mãe', telefone: '(41) 97777-6666' }
    ],
    
    rendaPossui: 'Sim',
    rendaQual: ['Trabalho informal'],
    rendaValor: '1200,00',
    rendaProfissao: 'Trabalhadora Autônoma (Estética)',
    rendaRecebeBeneficio: 'Não',
    
    termoAdesaoNome: 'Amanda Costa Oliveira',
    termoAdesaoData: '2026-05-20',
    
    relatoCaso: 'Usuária apresenta quadro grave de alcoolismo crônico associado ao uso abusivo de benzodiazepínicos sem prescrição médica. Apresenta fragilidade emocional severa e ideações depressivas após divórcio conturbado. Solicita acolhimento voluntário para interrupção do ciclo compulsivo.',
    responsavelPreenchimentoNome: 'Gisele Mara Ferreira',
    responsavelPreenchimentoRegistro: 'AS 9081-PR',

    saudeMedicoNome: 'Dra. Luiza Helena Brandão',
    saudeMedicoCRM: 'CRM-PR 18239',
    saudeCID: 'F10.2 - Síndrome de dependência de álcool',
    saudeDataAvaliacao: '2026-05-19',
    saudeApto: 'Sim',

    prontuarioRG: '11.222.333-4 PR',
    prontuarioRendaMensal: '1.200,00',
    prontuarioDataIngresso: '2026-05-20',
    prontuarioDataPrevistaTermino: '2026-11-20',
    prontuarioResponsavelTecnicoNome: 'Claudio Antunes Moreira',
    prontuarioResponsavelTecnicoRegistro: 'CRP-08/45120',
    prontuarioResponsavelTecnicoData: '2026-05-20',
    
    prontuarioFamiliares: [
      { nome: 'Sandra Costa Oliveira', parentesco: 'Mãe', telefone: '(41) 97777-6666', municipio: 'Colombo' }
    ],
    
    atividades: [
      { id: 'act-5', tipo: 'recreativa', atividade: 'Teatro e Expressão Corporal', data: '2026-06-25', responsavel: 'Eduardo Santos (Educador)', observacoes: 'Participou de forma tímida mas demonstrou criatividade.' },
      { id: 'act-6', tipo: 'desenvolvimento_interior', atividade: 'Grupo de Partilha Temática', data: '2026-06-26', responsavel: 'Claudio Antunes (Psicólogo)', observacoes: 'Expôs com emoção suas dores afetivas. Sendo acolhida pelo grupo.' }
    ],
    
    intercorrencias: [],
    saidasExternas: [],
    prontuarioObservacoesGerais: 'Acolhida se adaptando ao cronograma. Apresenta flutuações de humor frequentes.',

    frequencias: [
      {
        periodoReferencia: '07/2026',
        registro: {
          1: 'Presente', 2: 'Presente', 3: 'Presente', 4: 'Presente', 5: 'Presente',
          6: 'Presente', 7: 'Presente', 8: '', 9: '', 10: '', 11: '', 12: '', 13: '',
          14: '', 15: '', 16: '', 17: '', 18: '', 19: '', 20: '', 21: '', 22: '',
          23: '', 24: '', 25: '', 26: '', 27: '', 28: '', 29: '', 30: '', 31: ''
        }
      }
    ],

    psaMotivoBusca: 'Alcoolismo e automedicação com Diazepam decorrente de crise conjugal.',
    psaHistoriaProblemaAtualUltimoUso: 'Uso diário de cervejas e destilados até 2 dias antes do acolhimento. Diazepam sem receita para dormir.',
    psaTentativasAnterioresAbstinencia: 'Nenhuma de caráter formal ou institucional.',
    psaSintomasAssociados: ['fissura', 'alterações de humor', 'isolamento'],
    psaHistoricoSubstancias: [
      { substancia: 'Álcool', selecionado: true, idadeInicio: '19', padraoUso: 'Compulsivo diário', frequencia: 'Diária', quantidadeMedia: '1 garrafa destilados/dia', viaAdministracao: 'Oral', compulsao: 'Alta', efeitosAdversos: 'Ansiedade extrema, amnésia alcoólica', periodosAbstinencia: 'Poucos dias' },
      { substancia: 'Benzodiazepínicos', selecionado: true, idadeInicio: '24', padraoUso: 'Sem prescrição', frequencia: 'Diária à noite', quantidadeMedia: '20mg Diazepam', viaAdministracao: 'Oral', compulsao: 'Alta', efeitosAdversos: 'Dependência, sonolência diurna', periodosAbstinencia: 'Nenhum recente' }
    ],
    psaGastoMedioSubstancias: 'R$ 800,00 por mês.',
    psaObjetivosGerais: 'Desintoxicação emocional, tratamento de comorbidades depressivas, reestruturação da autoestima e reintegração familiar.',
    psaMetasIndividualizadas: [
      'Manter abstinência completa de álcool e ansiolíticos não prescritos.',
      'Identificar gatilhos emocionais da carência afetiva.',
      'Aprender rotinas de higiene do sono sem dependência medicamentosa.',
      'Envolver-se ativamente nas oficinas de artesanato.'
    ],
    psaIntervencoesAtendimentosTerapeuticos: 'Grupo de apoio para dependência cruzada e manejo emocional.',
    psaIntervencoesAtividadesEducativas: 'Oficina criativa de crochê e costura sustentável.',
    psaIntervencoesAcompanhamentoPsicologico: 'Terapia individual de suporte para reprocessamento do divórcio e luto familiar.',
    psaIntervencoesOutras: 'Acompanhamento psiquiátrico deColombo para desmame/ajuste seguro dos psicotrópicos.',
    psaCriteriosAcompanhamento: 'Participação nas atividades diárias, estabilização do humor e redução do comportamento de esquiva.',
    
    evolucoes: [
      { id: 'ev-4', data: '2026-05-25', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Acolhida muito fragilizada, crises de choro e labilidade de afeto frequentes. Necessita de escuta constante.' },
      { id: 'ev-5', data: '2026-06-25', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Iniciando fase de abertura. Demonstrou grande criatividade na oficina de crochê. Redução drástica das crises de ansiedade diurnas.' }
    ],
    
    psaExamesAnexados: 'Sim',
    psaLaudosAnexados: 'Não',
    ocorrenciasEvasao: 'Nenhuma registrada.',
    ocorrenciasAcidentes: 'Nenhum registrado.',
    ocorrenciasGerais: 'Comportamento dócil, mas necessita de atenção devido a propensão à autodepreciação.',
    
    comunicacoesFamilia: [
      { id: 'com-2', data: '2026-06-10', nomeContactado: 'Sandra Costa Oliveira (Mãe)', assunto: 'Conversa de apoio e alinhamento das expectativas do acolhimento.', profissional: 'Ana Paula (Assistente Social)' }
    ],

    responsavelPsicologoNome: 'Claudio Antunes Moreira',
    responsavelPsicologoCRP: 'CRP-08/45120',
    responsavelPsicologoData: '2026-05-20',
    responsavelAssistenteSocialNome: 'Ana Paula Rodrigues',
    responsavelAssistenteSocialCRESS: 'CRESS-PR 6720',
    responsavelAssistenteSocialData: '2026-05-20',

    medicacoes: [
      {
        id: 'med-3',
        nome: 'Fluoxetina',
        dosagem: '20mg',
        frequenciaHoras: 24,
        horarios: ['08:00'],
        dataInicio: '2026-05-20',
        ativo: true,
        observacoes: 'Antidepressivo prescrito pelo médico regulador.',
        alertasAtivos: true
      },
      {
        id: 'med-4',
        nome: 'Clonazepam (Gotas)',
        dosagem: '5 gotas',
        frequenciaHoras: 24,
        horarios: ['21:00'],
        dataInicio: '2026-05-20',
        ativo: true,
        observacoes: 'Dose controlada de transição. Administrar estritamente no horário.',
        alertasAtivos: true
      }
    ]
  },
  {
    id: 'rec-3',
    status: 'Ativo',
    progressoPorcentagem: 95,
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    
    solicitanteEquipamento: 'CAPS AD Cascavel',
    solicitanteMunicipio: 'Cascavel',
    solicitanteResponsavel: 'Dr. Arthur de Sousa',
    solicitanteData: '2026-01-10',
    
    usuarioNome: 'Carlos Eduardo da Silva',
    usuarioNomeSocial: 'Cadu da Silva',
    usuarioDataNascimento: '1984-05-20',
    usuarioNaturalidade: 'Cascavel - PR',
    usuarioFiliacao: 'Tereza da Silva',
    usuarioEstadoCivil: 'Casado',
    usuarioCPF: '456.789.012-34',
    usuarioRG: '5.432.109-8 PR',
    usuarioSexoBiologico: 'Masculino',
    usuarioIdentidadeGenero: 'Cisgênero',
    usuarioPossuiCadastroUnico: 'Sim',
    usuarioEndereco: 'Rua Paraná, 451',
    usuarioNumero: '451',
    usuarioBairro: 'Centro',
    usuarioTelefone: '(45) 99999-8888',
    usuarioSituacaoMoradia: 'Reside com familiares',
    usuarioTipoResidencia: 'Própria',
    usuarioPerfilDeficiencia: 'Pessoa sem deficiência',
    
    redeApoio: [
      { nome: 'Helena da Silva', parentesco: 'Esposa', telefone: '(45) 99999-7777' }
    ],
    
    rendaPossui: 'Sim',
    rendaQual: ['Trabalho formal'],
    rendaValor: '3200,00',
    rendaProfissao: 'Pedreiro',
    rendaRecebeBeneficio: 'Não',
    
    termoAdesaoNome: 'Carlos Eduardo da Silva',
    termoAdesaoData: '2026-01-15',
    
    relatoCaso: 'Caso grave de dependência severa de álcool combinada com cocaína, gerando episódios de violência doméstica verbal e risco de perda de emprego estável de pedreiro. Ingressou voluntariamente e com forte apoio da esposa.',
    responsavelPreenchimentoNome: 'Simone Mendes',
    responsavelPreenchimentoRegistro: 'AS 1234-PR',

    saudeMedicoNome: 'Dr. Ricardo Castro',
    saudeMedicoCRM: 'CRM-PR 11223',
    saudeCID: 'F10.2 - Síndrome de dependência de álcool',
    saudeDataAvaliacao: '2026-01-12',
    saudeApto: 'Sim',

    prontuarioRG: '5.432.109-8 PR',
    prontuarioRendaMensal: '3.200,00',
    prontuarioDataIngresso: '2026-01-15',
    prontuarioDataPrevistaTermino: '2026-07-15',
    prontuarioResponsavelTecnicoNome: 'Claudio Antunes Moreira',
    prontuarioResponsavelTecnicoRegistro: 'CRP-08/45120',
    prontuarioResponsavelTecnicoData: '2026-01-15',
    
    prontuarioFamiliares: [
      { nome: 'Helena da Silva', parentesco: 'Esposa', telefone: '(45) 99999-7777', municipio: 'Cascavel' }
    ],
    
    atividades: [
      { id: 'act-7', tipo: 'capacitacao', atividade: 'Manutenção de Instalações e Pintura', data: '2026-06-15', responsavel: 'Eduardo Santos (Educador)', observacoes: 'Liderou o grupo de manutenção de forma admirável. Muito técnico.' }
    ],
    
    intercorrencias: [],
    saidasExternas: [
      { id: 'out-2', data: '2026-06-01', acompanhante: 'Helena da Silva (Esposa)', horarioSaidaRetorno: 'Fim de semana completo', observacoes: 'Saída de ressocialização de final de semana na residência. Esposa reportou excelente conduta e ambiente harmonioso.' }
    ],
    
    prontuarioObservacoesGerais: 'Acolhido na reta final do tratamento. Preparando-se para o desligamento planejado dia 15/07/2026. Excelente aproveitamento.',

    frequencias: [
      {
        periodoReferencia: '07/2026',
        registro: {
          1: 'Presente', 2: 'Presente', 3: 'Presente', 4: 'Presente', 5: 'Presente',
          6: 'Presente', 7: 'Presente', 8: '', 9: '', 10: '', 11: '', 12: '', 13: '',
          14: '', 15: '', 16: '', 17: '', 18: '', 19: '', 20: '', 21: '', 22: '',
          23: '', 24: '', 25: '', 26: '', 27: '', 28: '', 29: '', 30: '', 31: ''
        }
      }
    ],

    psaMotivoBusca: 'Abuso nocivo de álcool e cocaína comprometendo casamento e trabalho.',
    psaHistoriaProblemaAtualUltimoUso: 'Uso de cocaína e álcool intensificados nos últimos 6 meses. Parou 2 dias antes de internar.',
    psaTentativasAnterioresAbstinencia: 'Nenhuma internação anterior.',
    psaSintomasAssociados: ['agressividade', 'alterações de humor'],
    psaHistoricoSubstancias: [
      { substancia: 'Álcool', selecionado: true, idadeInicio: '18', padraoUso: 'Diário e compulsivo', frequencia: 'Diária', quantidadeMedia: '1 litro destilados/dia', viaAdministracao: 'Oral', compulsao: 'Alta', efeitosAdversos: 'Violência verbal', periodosAbstinencia: 'Breves' },
      { substancia: 'Cocaína', selecionado: true, idadeInicio: '22', padraoUso: 'Finais de semana inicialmente', frequencia: '3 vezes por semana', quantidadeMedia: '3 gramas', viaAdministracao: 'Inalada', compulsao: 'Alta', efeitosAdversos: 'Paranoia, agressividade', periodosAbstinencia: 'Semanas' }
    ],
    psaGastoMedioSubstancias: 'R$ 1.500,00 por mês.',
    psaObjetivosGerais: 'Abstinência perene, reestruturação da saúde mental, remissão de sintomas agressivos e reinserção social.',
    psaMetasIndividualizadas: [
      'Identificar situações de alto risco.',
      'Controlar impulsividade em conflitos conjugais.',
      'Retomar o papel de provedor familiar com sobriedade.'
    ],
    psaIntervencoesAtendimentosTerapeuticos: 'Terapia de casal focada em co-dependência e suporte familiar pós-alta.',
    psaIntervencoesAtividadesEducativas: 'Organização da infraestrutura da Comunidade.',
    psaIntervencoesAcompanhamentoPsicologico: 'Prevenção de Recaída avançada (estratégias para o retorno ao ambiente comunitário).',
    psaIntervencoesOutras: 'Encontros de Alcoólicos Anônimos (AA) aos domingos.',
    psaCriteriosAcompanhamento: 'Excelente liderança de pares e maturidade comportamental comprovada.',
    
    evolucoes: [
      { id: 'ev-6', data: '2026-02-15', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Acolhido demonstrando forte motivação inicial. Integração rápida e colaborativa.' },
      { id: 'ev-7', data: '2026-04-15', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Lida perfeitamente com frustrações. Lidera atividades de laborterapia de construção civil.' },
      { id: 'ev-8', data: '2026-06-15', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Acolhido pronto para o desligamento. Plano de prevenção de recaída consolidado, rede de apoio estruturada.' }
    ],
    
    psaExamesAnexados: 'Sim',
    psaLaudosAnexados: 'Sim',
    ocorrenciasEvasao: 'Nenhuma registrada.',
    ocorrenciasAcidentes: 'Nenhum registrado.',
    ocorrenciasGerais: 'Indivíduo de altíssima colaboratividade.',
    
    comunicacoesFamilia: [
      { id: 'com-3', data: '2026-06-15', nomeContactado: 'Helena da Silva (Esposa)', assunto: 'Agendamento e alinhamento dos termos de alta terapêutica programada.', profissional: 'Ana Paula (Assistente Social)' }
    ],

    responsavelPsicologoNome: 'Claudio Antunes Moreira',
    responsavelPsicologoCRP: 'CRP-08/45120',
    responsavelPsicologoData: '2026-01-15',
    responsavelAssistenteSocialNome: 'Ana Paula Rodrigues',
    responsavelAssistenteSocialCRESS: 'CRESS-PR 6720',
    responsavelAssistenteSocialData: '2026-01-15',

    medicacoes: [] // Sem medicações ativas no momento (desmame completo concluído com sucesso)
  },
  {
    id: 'rec-4',
    status: 'Ativo',
    progressoPorcentagem: 15,
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    
    solicitanteEquipamento: 'CAPS AD III - Londrina',
    solicitanteMunicipio: 'Londrina',
    solicitanteResponsavel: 'Dr. Lucas Mendes (Psiquiatra)',
    solicitanteData: '2026-06-25',
    
    usuarioNome: 'Lucas Ferreira Lima',
    usuarioNomeSocial: 'Lucas Ferreira',
    usuarioDataNascimento: '2007-03-12', // 19 anos
    usuarioNaturalidade: 'Londrina - PR',
    usuarioFiliacao: 'Mariana Ferreira Lima',
    usuarioEstadoCivil: 'Solteiro',
    usuarioCPF: '345.678.901-23',
    usuarioRG: '12.456.789-0 PR',
    usuarioSexoBiologico: 'Masculino',
    usuarioIdentidadeGenero: 'Cisgênero',
    usuarioPossuiCadastroUnico: 'Sim',
    usuarioEndereco: 'Rua Principal, 222',
    usuarioNumero: '222',
    usuarioBairro: 'Cinco Conjuntos',
    usuarioTelefone: '(43) 98888-7777',
    usuarioSituacaoMoradia: 'Reside com familiares',
    usuarioTipoResidencia: 'Alugada',
    usuarioPerfilDeficiencia: 'Pessoa sem deficiência',
    
    redeApoio: [
      { nome: 'Mariana Ferreira Lima', parentesco: 'Mãe', telefone: '(43) 98888-6666' }
    ],
    
    rendaPossui: 'Não',
    rendaQual: [],
    rendaValor: '0,00',
    rendaProfissao: 'Estudante',
    rendaRecebeBeneficio: 'Não',
    
    termoAdesaoNome: 'Lucas Ferreira Lima',
    termoAdesaoData: '2026-06-29',
    
    relatoCaso: 'Jovem encaminhado com histórico de uso diário de Maconha e Cocaína. Apresenta ansiedade extrema de abstinência, insônia rebelde e desmotivação crônica. Ingressou há poucos dias, encontra-se em fase de desintoxicação física aguda.',
    responsavelPreenchimentoNome: 'Daniel Santos',
    responsavelPreenchimentoRegistro: 'AS 7711-PR',

    saudeMedicoNome: 'Dr. Roberto Arruda',
    saudeMedicoCRM: 'CRM-PR 19902',
    saudeCID: 'F12.2 - Dependência de Canabinoides e Cocaína',
    saudeDataAvaliacao: '2026-06-28',
    saudeApto: 'Sim',

    prontuarioRG: '12.456.789-0 PR',
    prontuarioRendaMensal: '0,00',
    prontuarioDataIngresso: '2026-06-29',
    prontuarioDataPrevistaTermino: '2026-12-29',
    prontuarioResponsavelTecnicoNome: 'Claudio Antunes Moreira',
    prontuarioResponsavelTecnicoRegistro: 'CRP-08/45120',
    prontuarioResponsavelTecnicoData: '2026-06-29',
    
    prontuarioFamiliares: [
      { nome: 'Mariana Ferreira Lima', parentesco: 'Mãe', telefone: '(43) 98888-6666', municipio: 'Londrina' }
    ],
    
    atividades: [],
    intercorrencias: [
      { id: 'inc-2', data: '2026-07-02', situacaoOcorrida: 'Insônia crônica, agitação motora e ansiedade exacerbada.', estrategiasAdotadas: 'Medicamento SOS conforme prescrição médica, monitoramento contínuo e diálogo pacificador.', encaminhamentosRealizados: 'Manter em observação de repouso no ambulatório.' }
    ],
    saidasExternas: [],
    prontuarioObservacoesGerais: 'Fase de desintoxicação inicial. Monitorar sinais vitais e comportamento de fuga.',

    frequencias: [
      {
        periodoReferencia: '07/2026',
        registro: {
          1: 'Presente', 2: 'Presente', 3: 'Presente', 4: 'Presente', 5: 'Presente',
          6: 'Presente', 7: 'Presente', 8: '', 9: '', 10: '', 11: '', 12: '', 13: '',
          14: '', 15: '', 16: '', 17: '', 18: '', 19: '', 20: '', 21: '', 22: '',
          23: '', 24: '', 25: '', 26: '', 27: '', 28: '', 29: '', 30: '', 31: ''
        }
      }
    ],

    psaMotivoBusca: 'Poliusuário de drogas em crise psicossocial grave e risco de criminalidade menor.',
    psaHistoriaProblemaAtualUltimoUso: 'Maconha e Cocaína de forma inalada até o dia de ingresso (29/06/2026). Histórico de evasão escolar.',
    psaTentativasAnterioresAbstinencia: 'Terapia ambulatorial sem aderência.',
    psaSintomasAssociados: ['fissura', 'alterações de humor', 'agressividade'],
    psaHistoricoSubstancias: [
      { substancia: 'Maconha', selecionado: true, idadeInicio: '13', padraoUso: 'Diário intenso', frequencia: 'Várias vezes ao dia', quantidadeMedia: '5 cigarros', viaAdministracao: 'Inalada', compulsao: 'Alta', efeitosAdversos: 'Prejuízo de memória, apatia', periodosAbstinencia: 'Nenhum' },
      { substancia: 'Cocaína', selecionado: true, idadeInicio: '16', padraoUso: 'Abusivo intermitente', frequencia: 'Finais de semana e noites', quantidadeMedia: '2g', viaAdministracao: 'Inalada', compulsao: 'Extrema', efeitosAdversos: 'Taquicardia, agressividade extrema, paranoia', periodosAbstinencia: 'Poucos dias' }
    ],
    psaGastoMedioSubstancias: 'R$ 1.200,00 por mês (custeado pela mãe e pequenas vendas de pertences).',
    psaObjetivosGerais: 'Estabilização de humor, cessação do uso de psicoativos, conclusão do ensino médio e desenvolvimento de maturidade emocional.',
    psaMetasIndividualizadas: [
      'Superar síndrome de abstinência física inicial de forma segura.',
      'Aderir ao cronograma de rotinas da comunidade terapêutica.',
      'Participar das reuniões diárias de partilha de sentimentos.'
    ],
    psaIntervencoesAtendimentosTerapeuticos: 'Treinamento de assertividade e controle de impulsos.',
    psaIntervencoesAtividadesEducativas: 'Reforço escolar ou cursos de formação rápida.',
    psaIntervencoesAcompanhamentoPsicologico: 'Sessões individuais focadas em comportamento impulsivo e modelagem social.',
    psaIntervencoesOutras: 'Laborterapia suave (cuidados de jardinagem leve e artes).',
    psaCriteriosAcompanhamento: 'Nível de colaboração física, aceitação das regras e remissão de crises de humor.',
    
    evolucoes: [
      { id: 'ev-9', data: '2026-06-30', profissional: 'Claudio Antunes (Psicólogo)', registro: 'Acolhido muito resistente às normas, demonstrando hostilidade defensiva. Relata forte fissura por maconha e cigarro.' }
    ],
    
    psaExamesAnexados: 'Não',
    psaLaudosAnexados: 'Não',
    ocorrenciasEvasao: 'Tentativa verbalizada no segundo dia de acolhimento.',
    ocorrenciasAcidentes: 'Nenhum registrado.',
    ocorrenciasGerais: 'Requer vigilância acentuada.',
    
    comunicacoesFamilia: [
      { id: 'com-4', data: '2026-06-30', nomeContactado: 'Mariana Ferreira (Mãe)', assunto: 'Orientar a mãe sobre as reações comuns da abstinência e pedir que não facilite a evasão.', profissional: 'Ana Paula (Assistente Social)' }
    ],

    responsavelPsicologoNome: 'Claudio Antunes Moreira',
    responsavelPsicologoCRP: 'CRP-08/45120',
    responsavelPsicologoData: '2026-06-29',
    responsavelAssistenteSocialNome: 'Ana Paula Rodrigues',
    responsavelAssistenteSocialCRESS: 'CRESS-PR 6720',
    responsavelAssistenteSocialData: '2026-06-29',

    medicacoes: [
      {
        id: 'med-5',
        nome: 'Diazepam',
        dosagem: '10mg',
        frequenciaHoras: 12,
        horarios: ['08:00', '20:00'],
        dataInicio: '2026-06-29',
        ativo: true,
        observacoes: 'Controle de ansiedade severa. Sob supervisão rígida.',
        alertasAtivos: true
      },
      {
        id: 'med-6',
        nome: 'Levomepromazina',
        dosagem: '25mg',
        frequenciaHoras: 24,
        horarios: ['22:00'],
        dataInicio: '2026-06-29',
        ativo: true,
        observacoes: 'Indutor de sono e estabilizador de agitação psicomotora.',
        alertasAtivos: true
      }
    ]
  },
  {
    id: 'rec-5',
    status: 'Inativo',
    progressoPorcentagem: 100,
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    
    solicitanteEquipamento: 'CAPS AD III - Ponta Grossa',
    solicitanteMunicipio: 'Ponta Grossa',
    solicitanteResponsavel: 'Dra. Elisa Toledo',
    solicitanteData: '2025-12-05',
    
    usuarioNome: 'Bruno Souza Rocha',
    usuarioNomeSocial: 'Bruno Rocha',
    usuarioDataNascimento: '1995-03-30',
    usuarioNaturalidade: 'Ponta Grossa - PR',
    usuarioFiliacao: 'Marta de Souza Rocha e Nelson Rocha',
    usuarioEstadoCivil: 'Solteiro',
    usuarioCPF: '234.567.890-12',
    usuarioRG: '10.555.444-3 PR',
    usuarioSexoBiologico: 'Masculino',
    usuarioIdentidadeGenero: 'Cisgênero',
    usuarioPossuiCadastroUnico: 'Sim',
    usuarioEndereco: 'Rua Castro Alves, 90',
    usuarioNumero: '90',
    usuarioBairro: 'Uvaranas',
    usuarioTelefone: '(42) 99888-4444',
    usuarioSituacaoMoradia: 'Reside sozinho',
    usuarioTipoResidencia: 'Alugada',
    usuarioPerfilDeficiencia: 'Pessoa sem deficiência',
    
    redeApoio: [
      { nome: 'Marta de Souza Rocha', parentesco: 'Mãe', telefone: '(42) 99888-5555' }
    ],
    
    rendaPossui: 'Sim',
    rendaQual: ['Trabalho formal'],
    rendaValor: '2100,00',
    rendaProfissao: 'Eletricista de Manutenção',
    rendaRecebeBeneficio: 'Não',
    
    termoAdesaoNome: 'Bruno Souza Rocha',
    termoAdesaoData: '2025-12-10',
    
    relatoCaso: 'Usuário buscou ajuda devido ao vício severo em Crack e Cocaína inalada, que o levou a perder o emprego anterior e morar de favor. Completou o ciclo de 6 meses de forma exitosa com alta terapêutica de equipe multidisciplinar no dia 10/06/2026.',
    responsavelPreenchimentoNome: 'Aline Barbosa',
    responsavelPreenchimentoRegistro: 'AS 3456-PR',

    saudeMedicoNome: 'Dr. Thiago Albuquerque',
    saudeMedicoCRM: 'CRM-PR 17290',
    saudeCID: 'F19.2 - Transtornos por múltiplas drogas',
    saudeDataAvaliacao: '2025-12-08',
    saudeApto: 'Sim',

    prontuarioRG: '10.555.444-3 PR',
    prontuarioRendaMensal: '2.100,00',
    prontuarioDataIngresso: '2025-12-10',
    prontuarioDataPrevistaTermino: '2026-06-10',
    prontuarioResponsavelTecnicoNome: 'Claudio Antunes Moreira',
    prontuarioResponsavelTecnicoRegistro: 'CRP-08/45120',
    prontuarioResponsavelTecnicoData: '2025-12-10',
    
    prontuarioFamiliares: [
      { nome: 'Marta de Souza Rocha', parentesco: 'Mãe', telefone: '(42) 99888-5555', municipio: 'Ponta Grossa' }
    ],
    
    atividades: [],
    intercorrencias: [],
    saidasExternas: [],
    prontuarioObservacoesGerais: 'Caso de sucesso completo. Reinserido socialmente em emprego de eletricista industrial.',

    frequencias: [],

    psaMotivoBusca: 'Dependência de Crack destruindo carreira profissional.',
    psaHistoriaProblemaAtualUltimoUso: 'Uso crônico há 3 anos. Parou no acolhimento.',
    psaTentativasAnterioresAbstinencia: 'Nenhuma internação formal.',
    psaSintomasAssociados: ['fissura', 'alterações de humor'],
    psaHistoricoSubstancias: [
      { substancia: 'Crack', selecionado: true, idadeInicio: '21', padraoUso: 'Diário', frequencia: 'Diária', quantidadeMedia: '8 pedras/dia', viaAdministracao: 'Inalada', compulsao: 'Alta', efeitosAdversos: 'Perda de 12kg, isolamento', periodosAbstinencia: 'Meses' },
      { substancia: 'Cocaína', selecionado: true, idadeInicio: '19', padraoUso: 'Eventual', frequencia: 'Eventual', quantidadeMedia: '1g', viaAdministracao: 'Inalada', compulsao: 'Média', efeitosAdversos: 'Inquietude', periodosAbstinencia: 'Meses' }
    ],
    psaGastoMedioSubstancias: 'R$ 1.800,00 por mês.',
    psaObjetivosGerais: 'Reabilitação total, readequação profissional e moradia autônoma saudável.',
    psaMetasIndividualizadas: [
      'Completar 180 dias livres de substâncias.',
      'Iniciar acompanhamento de AA na cidade natal após alta.',
      'Economizar reserva financeira mínima com o novo emprego.'
    ],
    psaIntervencoesAtendimentosTerapeuticos: 'Estudos de caso comportamentais individuais.',
    psaIntervencoesAtividadesEducativas: 'Horta e laborterapia administrativa computacional.',
    psaIntervencoesAcompanhamentoPsicologico: 'Sessões semanais com foco em autoconfiança e reintegração profissional.',
    psaIntervencoesOutras: 'Grupo de prevenção primária.',
    psaCriteriosAcompanhamento: 'Excelente progresso atestado.',
    
    evolucoes: [],
    psaExamesAnexados: 'Sim',
    psaLaudosAnexados: 'Sim',
    ocorrenciasEvasao: 'Nenhuma registrada.',
    ocorrenciasAcidentes: 'Nenhum registrado.',
    ocorrenciasGerais: 'Colaborador impecável.',
    comunicacoesFamilia: [],

    responsavelPsicologoNome: 'Claudio Antunes Moreira',
    responsavelPsicologoCRP: 'CRP-08/45120',
    responsavelPsicologoData: '2025-12-10',
    responsavelAssistenteSocialNome: 'Ana Paula Rodrigues',
    responsavelAssistenteSocialCRESS: 'CRESS-PR 6720',
    responsavelAssistenteSocialData: '2025-12-10',

    psaDesligamentoModalidade: 'Desligamento planejado',
    psaDesligamentoCondicoes: 'Acolhido cumpriu todo o cronograma terapêutico de 6 meses. Alta clínica e psicossocial concedida de forma unânime.',
    psaDesligamentoEncaminhamentos: ['Restabelecimento de vínculos familiares', 'Retorno ao mercado de trabalho', 'Encaminhamentos de cuidados com a saúde'],
    psaDesligamentoParecerFinal: 'Acolhido encontra-se desintoxicado, com excelente introspecção e reinserido no trabalho formal. Retornou à sua residência e frequentará o CAPS e o AA local como suporte complementar continuado.',

    medicacoes: []
  },
  {
    id: 'rec-6',
    status: 'Inativo',
    progressoPorcentagem: 30,
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    
    solicitanteEquipamento: 'CAPS AD Paranaguá',
    solicitanteMunicipio: 'Paranaguá',
    solicitanteResponsavel: 'Dr. Hamilton Costa',
    solicitanteData: '2026-02-10',
    
    usuarioNome: 'Felipe Mendes Neto',
    usuarioNomeSocial: 'Felipe Mendes',
    usuarioDataNascimento: '2002-07-15',
    usuarioNaturalidade: 'Paranaguá - PR',
    usuarioFiliacao: 'Clara Mendes de Oliveira',
    usuarioEstadoCivil: 'Solteiro',
    usuarioCPF: '567.890.123-45',
    usuarioRG: '13.111.222-3 PR',
    usuarioSexoBiologico: 'Masculino',
    usuarioIdentidadeGenero: 'Cisgênero',
    usuarioPossuiCadastroUnico: 'Não',
    usuarioEndereco: 'Rua do Porto, 12',
    usuarioNumero: '12',
    usuarioBairro: 'Costeira',
    usuarioTelefone: '(41) 96666-4444',
    usuarioSituacaoMoradia: 'Em situação de rua',
    usuarioTipoResidencia: 'Sem residência',
    usuarioPerfilDeficiencia: 'Pessoa sem deficiência',
    
    redeApoio: [],
    
    rendaPossui: 'Não',
    rendaQual: [],
    rendaValor: '0,00',
    rendaProfissao: 'Auxiliar de Carga (Porto)',
    rendaRecebeBeneficio: 'Não',
    
    termoAdesaoNome: 'Felipe Mendes Neto',
    termoAdesaoData: '2026-02-12',
    
    relatoCaso: 'Usuário de crack crônico e morador de rua há mais de 1 ano. Ingressou voluntariamente sob forte pressão jurídica/familiar, mas demonstrou severa instabilidade de humor e resistência às rotinas. Evadiu da CT pulando o muro lateral na data de 12/03/2026.',
    responsavelPreenchimentoNome: 'Aline Barbosa',
    responsavelPreenchimentoRegistro: 'AS 3456-PR',

    saudeMedicoNome: 'Dr. Hamilton Costa',
    saudeMedicoCRM: 'CRM-PR 15640',
    saudeCID: 'F19.2 - Dependência por múltiplas substâncias',
    saudeDataAvaliacao: '2026-02-11',
    saudeApto: 'Sim',

    prontuarioRG: '13.111.222-3 PR',
    prontuarioRendaMensal: '0,00',
    prontuarioDataIngresso: '2026-02-12',
    prontuarioDataPrevistaTermino: '2026-08-12',
    prontuarioResponsavelTecnicoNome: 'Claudio Antunes Moreira',
    prontuarioResponsavelTecnicoRegistro: 'CRP-08/45120',
    prontuarioResponsavelTecnicoData: '2026-02-12',
    
    prontuarioFamiliares: [],
    atividades: [],
    intercorrencias: [
      { id: 'inc-3', data: '2026-02-28', situacaoOcorrida: 'Agressividade verbal com colega de quarto e quebra de objeto pessoal.', estrategiasAdotadas: 'Punição verbal pedagógica, advertência por escrito e encaminhamento ao isolamento reflexivo assistido por monitor.', encaminhamentosRealizados: 'Terapia individual de emergência.' }
    ],
    saidasExternas: [],
    prontuarioObservacoesGerais: 'Caso de evasão precoce devido a baixo nível de motivação intrínseca.',

    frequencias: [],

    psaMotivoBusca: 'Morador de rua dependente de Crack buscando abrigo e reabilitação.',
    psaHistoriaProblemaAtualUltimoUso: 'Uso compulsivo diário. Parou com o ingresso.',
    psaTentativasAnterioresAbstinencia: 'Várias internações rápidas por demanda jurídica.',
    psaSintomasAssociados: ['agressividade', 'isolamento', 'alterações de humor'],
    psaHistoricoSubstancias: [
      { substancia: 'Crack', selecionado: true, idadeInicio: '15', padraoUso: 'Compulsivo diário', frequencia: 'Diária', quantidadeMedia: '15 pedras', viaAdministracao: 'Inalada', compulsao: 'Extrema', efeitosAdversos: 'Desnutrição grave, agressividade', periodosAbstinencia: 'Poucos dias' }
    ],
    psaGastoMedioSubstancias: 'R$ 3.000,00 por mês.',
    psaObjetivosGerais: 'Estabilização psíquica, abstinência estável e resgate de cidadania.',
    psaMetasIndividualizadas: ['Cumprir 30 dias de rotina limpa.', 'Retomar contato com a genitora.'],
    psaIntervencoesAtendimentosTerapeuticos: 'Controle de agressividade.',
    psaIntervencoesAtividadesEducativas: 'Organização do refeitório.',
    psaIntervencoesAcompanhamentoPsicologico: 'Sessões individuais focadas em autorregulação do afeto.',
    psaIntervencoesOutras: 'Laborterapia básica.',
    psaCriteriosAcompanhamento: 'Resistência extrema ao cronograma.',
    
    evolucoes: [],
    psaExamesAnexados: 'Não',
    psaLaudosAnexados: 'Não',
    ocorrenciasEvasao: 'Evadiu na data de 12/03/2026 pulando o muro lateral às 15:30. Município e família comunicados formalmente.',
    ocorrenciasAcidentes: 'Nenhum.',
    ocorrenciasGerais: 'Evasão consumada.',
    comunicacoesFamilia: [],

    responsavelPsicologoNome: 'Claudio Antunes Moreira',
    responsavelPsicologoCRP: 'CRP-08/45120',
    responsavelPsicologoData: '2026-02-12',
    responsavelAssistenteSocialNome: 'Ana Paula Rodrigues',
    responsavelAssistenteSocialCRESS: 'CRESS-PR 6720',
    responsavelAssistenteSocialData: '2026-02-12',

    psaDesligamentoModalidade: 'Evasão',
    psaDesligamentoCondicoes: 'Acolhido evadiu pulando o muro no período vespertino, sem dar explicações ou solicitar alta formal.',
    psaDesligamentoEncaminhamentos: ['Outros'],
    psaDesligamentoEncaminhamentosOutros: 'Notificação de evasão encaminhada ao CAPS de Paranaguá.',
    psaDesligamentoParecerFinal: 'Caso encerrado por evasão na data de 12/03/2026. Órgãos reguladores do Paraná notificados.',

    medicacoes: []
  },
  {
    id: 'rec-7',
    status: 'Aguardando Vaga',
    progressoPorcentagem: 0,
    fotoUrl: '',
    
    solicitanteEquipamento: 'Secretaria de Assistência Social - Araucária',
    solicitanteMunicipio: 'Araucária',
    solicitanteResponsavel: 'Gisele Mara Ferreira',
    solicitanteData: '2026-07-02',
    
    usuarioNome: 'Guilherme Santos Prado',
    usuarioNomeSocial: 'Guilherme Prado',
    usuarioDataNascimento: '1993-01-20',
    usuarioNaturalidade: 'Araucária - PR',
    usuarioFiliacao: 'Juliane Santos Prado',
    usuarioEstadoCivil: 'Solteiro',
    usuarioCPF: '678.901.234-56',
    usuarioRG: '14.222.333-4 PR',
    usuarioSexoBiologico: 'Masculino',
    usuarioIdentidadeGenero: 'Cisgênero',
    usuarioPossuiCadastroUnico: 'Sim',
    usuarioEndereco: 'Rua das Araucárias, 50',
    usuarioNumero: '50',
    usuarioBairro: 'Costeira',
    usuarioTelefone: '(41) 95555-4444',
    usuarioSituacaoMoradia: 'Reside com familiares',
    usuarioTipoResidencia: 'Própria',
    usuarioPerfilDeficiencia: 'Pessoa sem deficiência',
    
    redeApoio: [
      { nome: 'Juliane Santos Prado', parentesco: 'Mãe', telefone: '(41) 95555-5555' }
    ],
    
    rendaPossui: 'Não',
    rendaQual: [],
    rendaValor: '0,00',
    rendaProfissao: 'Pintor de Paredes',
    rendaRecebeBeneficio: 'Não',
    
    termoAdesaoNome: 'Guilherme Santos Prado',
    termoAdesaoData: '2026-07-02',
    
    relatoCaso: 'Usuário solicita vaga voluntariamente relatando incapacidade de interromper o consumo de cocaína e cachaça em ambiente doméstico. Sofrendo graves prejuízos de convívio social. Aguardando liberação de leito e conclusão da regulação da SEDEF.',
    responsavelPreenchimentoNome: 'Paula Roberta Lima',
    responsavelPreenchimentoRegistro: 'AS 4512-PR',

    saudeMedicoNome: 'Dr. Marcos Valério',
    saudeMedicoCRM: 'CRM-PR 14592',
    saudeCID: 'F10.2 - Síndrome de dependência de álcool',
    saudeDataAvaliacao: '2026-07-03',
    saudeApto: 'Sim',

    prontuarioRG: '14.222.333-4 PR',
    prontuarioRendaMensal: '0,00',
    prontuarioDataIngresso: '',
    prontuarioDataPrevistaTermino: '',
    prontuarioResponsavelTecnicoNome: 'Claudio Antunes Moreira',
    prontuarioResponsavelTecnicoRegistro: 'CRP-08/45120',
    prontuarioResponsavelTecnicoData: '2026-07-02',
    
    prontuarioFamiliares: [],
    atividades: [],
    intercorrencias: [],
    saidasExternas: [],
    prontuarioObservacoesGerais: 'Aguardando liberação de vaga oficial pela Central de Regulação de Leitos da SEDEF do Paraná.',

    frequencias: [],

    psaMotivoBusca: 'Alcoolismo e consumo crônico de Cocaína.',
    psaHistoriaProblemaAtualUltimoUso: 'Consumo persistente há 4 anos. Último consumo em 01/07/2026.',
    psaTentativasAnterioresAbstinencia: 'Nenhuma.',
    psaSintomasAssociados: ['fissura', 'isolamento'],
    psaHistoricoSubstancias: [
      { substancia: 'Álcool', selecionado: true, idadeInicio: '17', padraoUso: 'Abusivo diário', frequencia: 'Diária', quantidadeMedia: '1 litro destilado', viaAdministracao: 'Oral', compulsao: 'Alta', efeitosAdversos: 'Agitação', periodosAbstinencia: 'Nenhum' },
      { substancia: 'Cocaína', selecionado: true, idadeInicio: '21', padraoUso: 'Eventual', frequencia: 'Eventual', quantidadeMedia: '2g', viaAdministracao: 'Inalada', compulsao: 'Média', efeitosAdversos: 'Insônia', periodosAbstinencia: 'Semanas' }
    ],
    psaGastoMedioSubstancias: 'R$ 1.200,00 por mês.',
    psaObjetivosGerais: 'Restabelecimento físico e abstinência completa.',
    psaMetasIndividualizadas: ['Superar fase inicial sem fuga.', 'Retomar a prática de esportes.'],
    psaIntervencoesAtendimentosTerapeuticos: 'Prevenção de Recaída nível inicial.',
    psaIntervencoesAtividadesEducativas: 'Participação em laborterapia suave.',
    psaIntervencoesAcompanhamentoPsicologico: 'Sessões individuais semanais.',
    psaIntervencoesOutras: 'Palestras de prevenção de gatilhos.',
    psaCriteriosAcompanhamento: 'Avaliações comportamentais periódicas.',
    
    evolucoes: [],
    psaExamesAnexados: 'Sim',
    psaLaudosAnexados: 'Não',
    ocorrenciasEvasao: '',
    ocorrenciasAcidentes: '',
    ocorrenciasGerais: '',
    comunicacoesFamilia: [],

    responsavelPsicologoNome: 'Claudio Antunes Moreira',
    responsavelPsicologoCRP: 'CRP-08/45120',
    responsavelPsicologoData: '2026-07-02',
    responsavelAssistenteSocialNome: 'Ana Paula Rodrigues',
    responsavelAssistenteSocialCRESS: 'CRESS-PR 6720',
    responsavelAssistenteSocialData: '2026-07-02',

    medicacoes: []
  }
];
