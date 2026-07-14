import prisma from "../config/prisma.js";

class UserRepository {

  async findByIdentifier(identifier) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async create(data) {
    return prisma.user.create({
      data
    });
  }

  async updatePassword(id, passwordHash) {
    return prisma.user.update({
      where: { id },
      data: {
        passwordHash
      }
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async findByResetToken(token) {
    return prisma.user.findFirst({
      where: { resetToken: token }
    });
  }

  async setResetToken(email, token) {
    return prisma.user.update({
      where: { email },
      data: { resetToken: token }
    });
  }

  async clearResetToken(id) {
    return prisma.user.update({
      where: { id },
      data: { resetToken: null }
    });
  }

}

export default new UserRepository();