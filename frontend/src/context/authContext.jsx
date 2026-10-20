import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const CHAVE_USUARIO = "usuarioLogado";
const CHAVE_USUARIOS = "usuariosCadastrados";

export function AuthProvider({ children }) {
    const [usuarioLogado, setUsuarioLogado] = useState(() => {
        const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);
        return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    });

    const [usuarios, setUsuarios] = useState(() => {
        const usuariosSalvos = localStorage.getItem(CHAVE_USUARIOS);
        return usuariosSalvos ? JSON.parse(usuariosSalvos) : [];
    });

    useEffect(() => {
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
    }, [usuarios]);

    useEffect(() => {
        if (usuarioLogado) {
            localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuarioLogado));
        } else {
            localStorage.removeItem(CHAVE_USUARIO);
        }
    }, [usuarioLogado]);

    const gerarTag = () => {
        const letras = "abcdefghijklmnopqrstuvwxyz";
        const numeros = "0123456789";

        let tag = "";
        let tagExiste = true;

        while (tagExiste) {
            let parteLetras = "";
            let parteNumeros = "";

            for (let i = 0; i < 3; i++) {
                parteLetras += letras[Math.floor(Math.random() * letras.length)];
            }

            for (let i = 0; i < 4; i++) {
                parteNumeros += numeros[Math.floor(Math.random() * numeros.length)];
            }

            tag = `#${parteLetras}${parteNumeros}`;
            tagExiste = usuarios.some((usuario) => usuario.tag?.toLowerCase() === tag.toLowerCase());
        }

        return tag;
    };

    const cadastro = ({ nome, nomeUsuario, email, senha }) => {
        const emailNormalizado = email.trim().toLowerCase();
        const nomeUsuarioNormalizado = nomeUsuario.trim().toLowerCase();

        const emailExistente = usuarios.find((usuario) =>usuario.email === emailNormalizado);

        if (emailExistente) {
            return {sucesso: false, mensagem: "Já existe uma conta com este e-mail"};
        }

        const novoUsuario = {id: Date.now(), nome: nome.trim(), nomeUsuario: nomeUsuarioNormalizado, tag: gerarTag(), email: emailNormalizado, telefone: "", senha};
        setUsuarios((usuariosAtuais) => [...usuariosAtuais, novoUsuario]);

        return { sucesso: true, mensagem: "Conta criada com sucesso", usuario: novoUsuario };
    };

    const login = ({ email, senha }) => {
        const emailNormalizado = email.trim().toLowerCase();
        const usuarioEncontrado = usuarios.find((usuario) => usuario.email === emailNormalizado && usuario.senha === senha);

        if (!usuarioEncontrado) {
            return { sucesso: false, mensagem: "E-mail ou senha inválidos" };
        }

        const usuarioSessao = {
            id: usuarioEncontrado.id, nome: usuarioEncontrado.nome, nomeUsuario: usuarioEncontrado.nomeUsuario,
            tag: usuarioEncontrado.tag, email: usuarioEncontrado.email, telefone: usuarioEncontrado.telefone || ""
        };

        setUsuarioLogado(usuarioSessao);
        return { sucesso: true, mensagem: "Login realizado com sucesso.", usuario: usuarioSessao };
    };

    const logout = () => {
        setUsuarioLogado(null);
    };

    const buscarUsuarioPorIdentidade = (nomeUsuario, tag) => {
        return usuarios.find((usuario) => usuario.nomeUsuario?.toLowerCase() === nomeUsuario.trim().toLowerCase() && usuario.tag?.toLowerCase() === tag.trim().toLowerCase());
    };

    const atualizarPerfil = (dados) => {
        if (!usuarioLogado) {
            return {sucesso: false, mensagem: "Nenhum usuário logado"};
        }

        const emailNormalizado = dados.email.trim().toLowerCase();
        const nomeUsuarioNormalizado = dados.nomeUsuario.trim().toLowerCase();
        const emailExistente = usuarios.find((usuario) => usuario.email === emailNormalizado && String(usuario.id) !== String(usuarioLogado.id));

        if (emailExistente) {
            return {
                sucesso: false, mensagem: "Este e-mail já está sendo utilizado"
            };
        }

        const usuarioAtualizado = {...usuarioLogado, nome: dados.nome.trim(), nomeUsuario: nomeUsuarioNormalizado, email: emailNormalizado, telefone: dados.telefone?.trim() || ""};

        setUsuarios((usuariosAtuais) =>
            usuariosAtuais.map((usuario) =>
                String(usuario.id) === String(usuarioLogado.id)
                    ? {
                        ...usuario, nome: usuarioAtualizado.nome, nomeUsuario: usuarioAtualizado.nomeUsuario, email: usuarioAtualizado.email, telefone: usuarioAtualizado.telefone
                    }
                    : usuario
            )
        );

        setUsuarioLogado(usuarioAtualizado);
        return {sucesso: true, mensagem: "Perfil atualizado com sucesso"};
    };

    return (
        <AuthContext.Provider
            value={{
                usuarioLogado, usuarios, estaLogado: Boolean(usuarioLogado),
                login, cadastro, logout, atualizarPerfil, buscarUsuarioPorIdentidade
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth deve ser usado dentro de um AuthProvider."
        );
    }

    return context;
}