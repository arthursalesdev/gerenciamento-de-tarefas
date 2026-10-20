import swaggerJSDoc from "swagger-jsdoc";

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
                        id: {
                            type: "integer",
                            example: 1
                        },
                        titulo: {
                            type: "string",
                            example: "Finalizar atividade"
                        },
                        descricao: {
                            type: "string",
                            nullable: true,
                            example: "Finalizar documentação da API"
                        },
                        status: {
                            type: "string",
                            enum: ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"],
                            example: "PENDENTE"
                        },
                        prioridade: {
                            type: "string",
                            enum: ["BAIXA", "MEDIA", "ALTA"],
                            nullable: true,
                            example: "ALTA"
                        },
                        dataLimite: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            example: "2026-10-10T23:59:00.000Z"
                        },
                        criadoEm: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-30T12:00:00.000Z"
                        },
                        atualizadoEm: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            example: "2026-09-30T13:00:00.000Z"
                        }
                    }
                },

                Erro: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Erro ao processar a requisição"
                        }
                    }
                },

                CriarTarefa: {
                    type: "object",
                    required: ["titulo"],
                    properties: {
                        titulo: {
                            type: "string",
                            maxLength: 150,
                            example: "Finalizar atividade"
                        },
                        descricao: {
                            type: "string",
                            example: "Finalizar documentação da API"
                        },
                        prioridade: {
                            type: "string",
                            enum: ["BAIXA", "MEDIA", "ALTA"],
                            example: "ALTA"
                        },
                        dataLimite: {
                            type: "string",
                            format: "date-time",
                            example: "2026-10-10T23:59:00.000Z"
                        }
                    }
                },

                AtualizarTarefa: {
                    type: "object",
                    properties: {
                        titulo: {
                            type: "string",
                            maxLength: 150,
                            example: "Finalizar documentação"
                        },
                        descricao: {
                            type: "string",
                            example: "Revisar e finalizar a documentação da API"
                        },
                        status: {
                            type: "string",
                            enum: ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"],
                            example: "EM_ANDAMENTO"
                        },
                        prioridade: {
                            type: "string",
                            enum: ["BAIXA", "MEDIA", "ALTA"],
                            example: "MEDIA"
                        },
                        dataLimite: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            example: "2026-10-15T23:59:00.000Z"
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
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;