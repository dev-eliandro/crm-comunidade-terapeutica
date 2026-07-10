-- AlterTable
-- A tabela "residents" já existe no banco (criada pela migration anterior),
-- mas sem a coluna dados_completos que foi adicionada depois ao schema.prisma.
ALTER TABLE "residents" ADD COLUMN "dados_completos" JSONB;

-- CreateTable
CREATE TABLE "medication_logs" (
    "id" TEXT NOT NULL,
    "resident_id" TEXT NOT NULL,
    "medication_id" TEXT NOT NULL,
    "medication_nome" TEXT NOT NULL,
    "dosagem" TEXT,
    "horario_previsto" TEXT NOT NULL,
    "horario_realizado" TEXT,
    "status" TEXT NOT NULL,
    "administrado_por" TEXT,
    "alertas_ativos" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medication_logs" ADD CONSTRAINT "medication_logs_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;