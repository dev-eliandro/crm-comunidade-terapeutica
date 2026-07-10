import prisma from "../config/prisma.js";
import MedicationLogRepository from "../repositories/MedicationLogRepository.js";

class MedicationLogService {

  async list() {
    return MedicationLogRepository.findAll();
  }

  // Substitui todo o conjunto de logs pelo array enviado pelo frontend.
  // Mantém a mesma semântica de "um array grande em memória" que o app já usava
  // com localStorage, só que agora persistido no banco e compartilhado entre dispositivos.
  async replaceAll(logs) {
    const rows = (logs || [])
      .filter(log => log.residentId) // ignora logs sem vínculo de residente válido
      .map(log => ({
        id: log.id,
        residentId: log.residentId,
        medicationId: log.medicationId,
        medicationNome: log.medicationNome,
        dosagem: log.dosagem || null,
        horarioPrevisto: log.horarioPrevisto,
        horarioRealizado: log.horarioRealizado || null,
        status: log.status,
        administradoPor: log.administradoPor || null,
        alertasAtivos: log.alertasAtivos ?? null
      }));

    await prisma.$transaction([
      prisma.medicationLog.deleteMany({}),
      ...(rows.length
        ? [prisma.medicationLog.createMany({ data: rows, skipDuplicates: true })]
        : [])
    ]);

    return MedicationLogRepository.findAll();
  }
}

export default new MedicationLogService();
