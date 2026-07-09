import prisma from "../config/prisma.js";

class ResidentRepository {

  async findAll() {
    return prisma.resident.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findById(id) {
    return prisma.resident.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return prisma.resident.create({
      data
    });
  }

  async update(id, data) {
    return prisma.resident.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.resident.delete({
      where: { id }
    });
  }
}

export default new ResidentRepository();