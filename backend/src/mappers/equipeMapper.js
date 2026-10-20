import { EquipeResponseDTO } from "../dtos/equipeDTO.js";

class EquipeMapper {
    paraResponseDTO(equipe) {
        return new EquipeResponseDTO(equipe);
    }

    paraListaResponseDTO(equipes) {
        return equipes.map((equipe) => this.paraResponseDTO(equipe));
    }
}

export default new EquipeMapper();