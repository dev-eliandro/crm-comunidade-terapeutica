-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."residents" (
    "id" TEXT NOT NULL,
    "status" TEXT,
    "progressoPorcentagem" INTEGER,
    "solicitanteEquipamento" TEXT,
    "solicitanteMunicipio" TEXT,
    "solicitanteResponsavel" TEXT,
    "solicitanteData" TIMESTAMP(3),
    "usuarioNome" TEXT NOT NULL,
    "usuarioNomeSocial" TEXT,
    "usuarioDataNascimento" TIMESTAMP(3),
    "usuarioNaturalidade" TEXT,
    "usuarioFiliacao" TEXT,
    "usuarioEstadoCivil" TEXT,
    "usuarioCPF" TEXT NOT NULL,
    "usuarioRG" TEXT,
    "usuarioSexoBiologico" TEXT,
    "usuarioIdentidadeGenero" TEXT,
    "usuarioPossuiCadastroUnico" TEXT,
    "usuarioEndereco" TEXT,
    "usuarioNumero" TEXT,
    "usuarioBairro" TEXT,
    "usuarioTelefone" TEXT,
    "usuarioSituacaoMoradia" TEXT,
    "usuarioTipoResidencia" TEXT,
    "usuarioPerfilDeficiencia" TEXT,
    "rendaPossui" TEXT,
    "rendaValor" TEXT,
    "rendaProfissao" TEXT,
    "rendaRecebeBeneficio" TEXT,
    "rendaRecebeBeneficioQual" TEXT,
    "termoAdesaoNome" TEXT,
    "termoAdesaoData" TIMESTAMP(3),
    "relatoCaso" TEXT,
    "saudeMedicoNome" TEXT,
    "saudeMedicoCRM" TEXT,
    "saudeCID" TEXT,
    "saudeDataAvaliacao" TIMESTAMP(3),
    "saudeApto" TEXT,
    "prontuarioRG" TEXT,
    "prontuarioRendaMensal" TEXT,
    "prontuarioDataIngresso" TIMESTAMP(3),
    "prontuarioDataPrevistaTermino" TIMESTAMP(3),
    "prontuarioResponsavelTecnicoNome" TEXT,
    "prontuarioResponsavelTecnicoRegistro" TEXT,
    "prontuarioResponsavelTecnicoData" TIMESTAMP(3),
    "psaMotivoBusca" TEXT,
    "psaHistoriaProblemaAtualUltimoUso" TEXT,
    "psaTentativasAnterioresAbstinencia" TEXT,
    "psaGastoMedioSubstancias" TEXT,
    "psaObjetivosGerais" TEXT,
    "psaIntervencoesAtendimentosTerapeuticos" TEXT,
    "psaIntervencoesAtividadesEducativas" TEXT,
    "psaIntervencoesAcompanhamentoPsicologico" TEXT,
    "psaIntervencoesOutras" TEXT,
    "psaCriteriosAcompanhamento" TEXT,
    "psaExamesAnexados" TEXT,
    "psaLaudosAnexados" TEXT,
    "ocorrenciasEvasao" TEXT,
    "ocorrenciasAcidentes" TEXT,
    "ocorrenciasGerais" TEXT,
    "responsavelPsicologoNome" TEXT,
    "responsavelPsicologoCRP" TEXT,
    "responsavelPsicologoData" TIMESTAMP(3),
    "responsavelAssistenteSocialNome" TEXT,
    "responsavelAssistenteSocialCRESS" TEXT,
    "responsavelAssistenteSocialData" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "reset_token" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "residents_usuarioCPF_key" ON "public"."residents"("usuarioCPF" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username" ASC);

