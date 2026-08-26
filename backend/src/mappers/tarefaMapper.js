import { TarefaResponseDTO } from "../dtos/tarefaDTO.js";

class TarefaMapper {
    static paraResponseDTO(tarefa) {
        return new TarefaResponseDTO(tarefa);
    }
    static paraListaResponseDTO(tarefas) {
        return tarefas.map(tarefa => this.paraResponseDTO(tarefa));
    }
}   

export default TarefaMapper;