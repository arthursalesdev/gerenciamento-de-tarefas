import swaggerJSDoc from "swagger-jsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "API - Gerenciamento de Tarefas",
            version: "1.0.0",
            description: "Documentação da API de gerenciamento de tarefas"
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },

            schemas: {
                Usuario: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1
                        },
                        nome: {
                            type: "string",
                            example: "Arthur"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "arthur@teste.com"
                        },
                        criadoEm: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-30T12:00:00.000Z"
                        }
                    }
                },

                LoginResponse: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            description: "Token JWT utilizado nas rotas protegidas",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        },
                        usuario: {
                            $ref: "#/components/schemas/Usuario"
                        }
                    }
                },

                Tarefa: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        usuarioId: { type: "integer", example: 1 },
                        equipeId: {
                            type: "integer",
                            nullable: true,
                            example: 2
                        },
                        responsavelId: {
                            type: "integer",
                            nullable: true,
                            example: 3
                        },
                        titulo: {
                            type: "string",
                            maxLength: 150,
                            example: "Finalizar documentação"
                        },
                        descricao: {
                            type: "string",
                            nullable: true,
                            example: "Revisar os endpoints"
                        },
                        status: {
                            type: "string",
                            enum: ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"],
                            example: "PENDENTE"
                        },
                        prioridade: {
                            type: "string",
                            enum: ["BAIXA", "MEDIA", "ALTA"],
                            example: "MEDIA"
                        },
                        dataLimite: {
                            type: "string",
                            format: "date-time",
                            nullable: true
                        },
                        criadoEm: {
                            type: "string",
                            format: "date-time"
                        },
                        atualizadoEm: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },

                Erro: {
                    type: "object",
                    required: ["mensagem"],
                    properties: {
                        mensagem: {
                            type: "string",
                            example: "Tarefa não encontrada"
                        }
                    }
                },

                CriarTarefa: {
                    type: "object",
                    required: ["titulo"],
                    properties: {
                        titulo: {
                            type: "string",
                            minLength: 1,
                            maxLength: 150,
                            example: "Implementar autenticação"
                        },
                        descricao: {
                            type: "string",
                            nullable: true,
                            example: "Integrar o login ao backend"
                        },
                        prioridade: {
                            type: "string",
                            enum: ["BAIXA", "MEDIA", "ALTA"],
                            default: "MEDIA"
                        },
                        dataLimite: {
                            type: "string",
                            format: "date-time"
                        },
                        equipeId: {
                            type: "integer",
                            minimum: 1,
                            nullable: true,
                            description: "Omitir para criar uma tarefa individual"
                        },
                        responsavelId: {
                            type: "integer",
                            minimum: 1,
                            nullable: true,
                            description: "Usuário responsável, que deve pertencer à equipe"
                        }
                    }
                },

                AtualizarTarefa: {
                    type: "object",
                    properties: {
                        titulo: {
                            type: "string",
                            maxLength: 150
                        },
                        descricao: {
                            type: "string",
                            nullable: true
                        },
                        status: {
                            type: "string",
                            enum: ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"]
                        },
                        prioridade: {
                            type: "string",
                            enum: ["BAIXA", "MEDIA", "ALTA"]
                        },
                        dataLimite: {
                            type: "string",
                            format: "date-time",
                            nullable: true
                        }
                    }
                },

                Equipe: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1
                        },
                        nome: {
                            type: "string",
                            example: "Equipe TCC"
                        },
                        criadorId: {
                            type: "integer",
                            example: 1
                        },
                        criadoEm: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-30T12:00:00.000Z"
                        },
                        atualizadoEm: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-30T12:00:00.000Z"
                        }
                    }
                },

                CriarEquipe: {
                    type: "object",
                    required: ["nome"],
                    properties: {
                        nome: {
                            type: "string",
                            minLength: 1,
                            maxLength: 100,
                            example: "Equipe TCC"
                        }
                    }
                },

                AtualizarEquipe: {
                    type: "object",
                    required: ["nome"],
                    properties: {
                        nome: {
                            type: "string",
                            minLength: 1,
                            maxLength: 100,
                            example: "Equipe Desenvolvimento"
                        }
                    }
                },

                MembroEquipe: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1
                        },
                        usuarioId: {
                            type: "integer",
                            example: 2
                        },
                        equipeId: {
                            type: "integer",
                            example: 1
                        },
                        criadoEm: {
                            type: "string",
                            format: "date-time",
                            example: "2026-10-01T12:00:00.000Z"
                        },
                        cargo: {
                            type: "string",
                            enum: ["DONO", "LIDER", "MEMBRO", "VISUALIZADOR"],
                            example: "MEMBRO"
                        },
                    }
                },

                AdicionarMembro: {
                    type: "object",
                    required: ["usuarioId"],
                    properties: {
                        usuarioId: {
                            type: "integer",
                            minimum: 1,
                            example: 2
                        }
                    }
                },

                AlterarCargoMembro: {
                    type: "object",
                    required: ["cargo"],
                    properties: {
                        cargo: {
                            type: "string",
                            enum: ["DONO", "LIDER", "MEMBRO", "VISUALIZADOR"],
                            example: "LIDER"
                        }
                    }
                },
            }
        }
    },

    apis: [
        path.resolve(diretorioAtual, "../routes/*.js")
    ],
    failOnErrors: true
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;