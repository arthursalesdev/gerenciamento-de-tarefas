import React, { createContext, useContext } from "react";

const InicioContext = createContext();

export const InicioProvider = ({ children }) => {

    const irParaLogin = (navigation) => {
        navigation.navigate("Login");
    };

    const irParaCadastro = (navigation) => {
        navigation.navigate("Cadastro");
    };

    return (
        <InicioContext.Provider value={{ irParaLogin, irParaCadastro }}>
            {children}
        </InicioContext.Provider>
    );
};

export const useInicio = () => {
    return useContext(InicioContext);
};