import prisma from "../config/prisma.js";

class MedicationLogRepository {

  async findAll() {
    return prisma.medicationLog.findMany({
      orderBy: { horarioPrevisto: "asc" }
    });
  }

  async create(data) {
    return prisma.medicationLog.create({ data });
  }

  async update(id, data) {
    return prisma.medicationLog.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.medicationLog.delete({ where: { id } });
  }
}

export default new MedicationLogRepository();
