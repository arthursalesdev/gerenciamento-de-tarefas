import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("taskflow_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
        const requisicao = erro.config;
        const autorizacao = requisicao?.headers?.Authorization;
        const tokenAtual = localStorage.getItem("taskflow_token");

        const rota = requisicao?.url?.split("?")[0];
        const ehRotaPublica = rota === "/auth/login" || rota === "/auth/cadastro";

        if (
            erro.response?.status === 401 &&
            !ehRotaPublica &&
            tokenAtual &&
            autorizacao === `Bearer ${tokenAtual}`
        ) {
            window.dispatchEvent(new Event("taskflow:sessao-expirada"));
        }

        return Promise.reject(erro);
    }
);

export default api;