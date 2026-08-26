import { UsuarioResponseDTO } from "../dtos/usuarioDTO.js";

class UsuarioMapper {
    static paraResponseDTO(usuario) {
        return new UsuarioResponseDTO(usuario);
    }
}

export default UsuarioMapper;