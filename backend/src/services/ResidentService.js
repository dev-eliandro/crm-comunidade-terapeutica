import ResidentRepository from "../repositories/ResidentRepository.js";

// Campos escalares que existem como colunas reais na tabela `residents`.
const SCALAR_FIELDS = [
  "status", "progressoPorcentagem",
  "solicitanteEquipamento", "solicitanteMunicipio", "solicitanteResponsavel", "solicitanteData",
  "usuarioNome", "usuarioNomeSocial", "usuarioDataNascimento", "usuarioNaturalidade",
  "usuarioFiliacao", "usuarioEstadoCivil", "usuarioCPF", "usuarioRG",
  "usuarioSexoBiologico", "usuarioIdentidadeGenero", "usuarioPossuiCadastroUnico",
  "usuarioEndereco", "usuarioNumero", "usuarioBairro", "usuarioTelefone",
  "usuarioSituacaoMoradia", "usuarioTipoResidencia", "usuarioPerfilDeficiencia",
  "rendaPossui", "rendaValor", "rendaProfissao", "rendaRecebeBeneficio", "rendaRecebeBeneficioQual",
  "termoAdesaoNome", "termoAdesaoData", "relatoCaso",
  "saudeMedicoNome", "saudeMedicoCRM", "saudeCID", "saudeDataAvaliacao", "saudeApto",
  "prontuarioRG", "prontuarioRendaMensal", "prontuarioDataIngresso", "prontuarioDataPrevistaTermino",
  "prontuarioResponsavelTecnicoNome", "prontuarioResponsavelTecnicoRegistro", "prontuarioResponsavelTecnicoData",
  "psaMotivoBusca", "psaHistoriaProblemaAtualUltimoUso", "psaTentativasAnterioresAbstinencia",
  "psaGastoMedioSubstancias", "psaObjetivosGerais",
  "psaIntervencoesAtendimentosTerapeuticos", "psaIntervencoesAtividadesEducativas",
  "psaIntervencoesAcompanhamentoPsicologico", "psaIntervencoesOutras", "psaCriteriosAcompanhamento",
  "psaExamesAnexados", "psaLaudosAnexados",
  "ocorrenciasEvasao", "ocorrenciasAcidentes", "ocorrenciasGerais",
  "responsavelPsicologoNome", "responsavelPsicologoCRP", "responsavelPsicologoData",
  "responsavelAssistenteSocialNome", "responsavelAssistenteSocialCRESS", "responsavelAssistenteSocialData"
];

const DATE_FIELDS = [
  "solicitanteData", "usuarioDataNascimento", "termoAdesaoData", "saudeDataAvaliacao",
  "prontuarioDataIngresso", "prontuarioDataPrevistaTermino", "prontuarioResponsavelTecnicoData",
  "responsavelPsicologoData", "responsavelAssistenteSocialData"
];

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

// Recebe o objeto completo enviado pelo frontend (formato Acolhido) e separa
// entre colunas escalares reais e o restante (arrays/objetos aninhados), que
// vai para o campo JSON `dadosCompletos`.
function splitPayload(payload) {
  const scalarData = {};
  const rest = { ...payload };

  for (const field of SCALAR_FIELDS) {
    if (payload[field] !== undefined) {
      scalarData[field] = DATE_FIELDS.includes(field) ? toDate(payload[field]) : payload[field];
    }
    delete rest[field];
  }
  delete rest.id;

  return { scalarData, dadosCompletos: rest };
}

// Reconstrói o objeto no formato Acolhido esperado pelo frontend, priorizando
// os valores guardados em `dadosCompletos` (fonte mais completa) e completando
// com as colunas escalares quando faltar algo.
function toAcolhido(resident) {
  if (!resident) return null;
  const { dadosCompletos, ...scalarFields } = resident;
  return {
    ...scalarFields,
    ...(dadosCompletos || {}),
    id: resident.id
  };
}

class ResidentService {

    async list() {
        const residents = await ResidentRepository.findAll();
        return residents.map(toAcolhido);
    }

    async get(id) {
        const resident = await ResidentRepository.findById(id);
        return toAcolhido(resident);
    }

    async create(payload) {
        const { scalarData, dadosCompletos } = splitPayload(payload);
        const resident = await ResidentRepository.create({ ...scalarData, dadosCompletos });
        return toAcolhido(resident);
    }

    async update(id, payload) {
        const { scalarData, dadosCompletos } = splitPayload(payload);
        const resident = await ResidentRepository.update(id, { ...scalarData, dadosCompletos });
        return toAcolhido(resident);
    }

    async delete(id) {
        return ResidentRepository.delete(id);
    }

}

export default new ResidentService();
