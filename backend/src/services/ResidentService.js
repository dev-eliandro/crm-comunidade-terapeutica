import ResidentRepository from "../repositories/ResidentRepository.js";

class ResidentService {

    async list() {
        return ResidentRepository.findAll();
    }

    async get(id) {
        return ResidentRepository.findById(id);
    }

    async create(data) {
        return ResidentRepository.create(data);
    }

    async update(id, data) {
        return ResidentRepository.update(id, data);
    }

    async delete(id) {
        return ResidentRepository.delete(id);
    }

}

export default new ResidentService();