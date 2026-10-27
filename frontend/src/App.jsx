import Inicio from "./pages/Inicio/inicio";
import Tarefas from "./pages/tarefas/tarefas";
import Gerenciamento from "./pages/Gerenciamento/gerenciamento";
import Painel from "./pages/Painel/painel";

import { TemaProvider } from "./context/temaContext";
import { TarefasProvider } from "./context/tarefasContext";
import { AuthProvider } from "./context/authContext";
import { AreaProvider } from "./context/areaContext";
import { EquipesProvider } from "./context/equipesContext";
import { MembrosProvider } from "./context/membrosContext";
import { CargosProvider } from "./context/cargosContext";
import { PermissoesProvider } from "./context/permissoesContext";
import { ConvitesProvider } from "./context/convitesContext";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import RotaProtegida from "./routes/rotaProtegida";

function App() {
    return (
        <TemaProvider>
            <AuthProvider>
                <CargosProvider>
                    <EquipesProvider>
                        <MembrosProvider>
                            <ConvitesProvider>
                                <AreaProvider>
                                    <PermissoesProvider>
                                        <TarefasProvider>
                                            <BrowserRouter>
                                                <Routes>
                                                    <Route path="/" element={<Inicio />} />
                                                    <Route path="/tarefas" element={<RotaProtegida> <Tarefas /> </RotaProtegida>} />
                                                    <Route path="/gerenciamento" element={<RotaProtegida> <Gerenciamento /> </RotaProtegida>} />
                                                    <Route path="/painel" element={<RotaProtegida> <Painel /> </RotaProtegida>} />
                                                </Routes>
                                            </BrowserRouter>
                                        </TarefasProvider>
                                    </PermissoesProvider>
                                </AreaProvider>
                            </ConvitesProvider>
                        </MembrosProvider>
                    </EquipesProvider>
                </CargosProvider>
            </AuthProvider>
        </TemaProvider>
    );
}

export default App;