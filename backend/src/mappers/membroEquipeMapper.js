import { MembroEquipeResponseDTO } from "../dtos/membroEquipeDTO.js";

class MembroEquipeMapper {
    paraResponseDTO(membro) {
        return new MembroEquipeResponseDTO(membro);
    }

    paraListaResponseDTO(membros) {
        return membros.map((membro) =>
            this.paraResponseDTO(membro)
        );
    }
}

export default new MembroEquipeMapper();