import React from 'react';
import './App.css';
import './estilos.css';
import NoEncontrado from './componentes/NoEncontrado';
import Login from './componentes/Login'; 
import Registro from './componentes/Registro'; 
import CambiarContrasena from './componentes/CambioContrasena';
import Logout from './componentes/Logout';
import Dashboard from './componentes/Dashboard/Dashboard';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import VerMisDatos from './componentes/VerMisDatos';
import MisDatos from './componentes/MisDatos';
import { UsuarioProvider } from './hooks/UsuarioContext';
import CrearGrupoDeViaje from './componentes/CrearGrupoDeViaje';
import { PaisProvider } from './hooks/PaisContext';
import { CiudadProvider } from './hooks/CiudadContext';
import PoliticaDePrivacidad from './componentes/PoliticaDePrivacidad';
import TerminosYCondiciones from './componentes/TerminosYCondiciones'; 
import MisGrupos from './componentes/MisGrupos';
import Catalogos from './componentes/Catalogos';
import Hoteles from './componentes/Hoteles';
import Aeropuertos from './componentes/Aeropuertos';
import Vuelos from './componentes/Vuelos';
import Aerolineas from './componentes/Aerolineas';
import Traslados from './componentes/Traslados';
import AgregarViajeroAGrupo from './componentes/AgregarViajeroAGrupo';
import DondeEstoy from './componentes/DondeEstoy';
import VerItinerario from './componentes/VerItinerario';
import RecuperarContrasena from './componentes/RecuperarContrasena'; 
import { Layout } from './componentes/Layout';
import { SnackbarProvider } from './hooks/useSnackbar';
import CrearEvento from './componentes/CrearEvento';
import AgregarActividad from './componentes/AgregarActividad';
import AgregarTraslado from './componentes/AgregarTraslado';
import DetallesItinerario from './componentes/DetallesItinerario';
import DondeEstoy2 from './componentes/DondeEstoy2';
import EditarItinerario from './componentes/EditarItinerario';
import Viajeros from './componentes/Viajeros';
//import FormularioActividad from './componentes/FormularioActividad';
import FormularioTraslado from './componentes/FormularioTraslado';
import FormularioHotel from './componentes/FormularioHotel';
import FormularioAeropuerto from './componentes/FormularioAeropuerto';
import FormularioAerolinea from './componentes/FormularioAerolinea';
import FormularioVuelo from './componentes/FormularioVuelo';
import ActividadOpcional from './componentes/ActividadOpcional';
import VerDatosViajero from './componentes/VerDatosViajeros';
import CrearItinerario2 from './componentes/CrearItinerario2';
import ListadoUsuariosDeActividadOpcional from './componentes/ListadoUsuariosDeActividadOpcional';
import VerItinerarioViajero from './componentes/VerItinerarioViajero';

const App = () => {
  const isAuthenticated = localStorage.getItem("token") || localStorage.getItem("id");

  return (
    <UsuarioProvider>
      <PaisProvider>
        <CiudadProvider>
          <SnackbarProvider>
            <BrowserRouter future={{ v7_relativeSplatPath: true }}>
              <Layout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/politicaDePrivacidad" element={<PoliticaDePrivacidad />} />
                  <Route path="/terminos" element={<TerminosYCondiciones />} />
                  <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
                  
                  {/* Authentication routes */}
                  <Route path="/" element={<Login />} />
                  <Route path="/registro" element={isAuthenticated ? <Registro />: <Navigate to="/" />} />
                  <Route path="/logout" element={<Logout />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/verMisDatos"
                    element={isAuthenticated ? <VerMisDatos /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/misDatos"
                    element={isAuthenticated ? <MisDatos /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/misGrupos"
                    element={isAuthenticated ? <MisGrupos /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/catalogos"
                    element={isAuthenticated ? <Catalogos /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/donde-estoy"
                    element={isAuthenticated ? <DondeEstoy /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/hoteles"
                    element={isAuthenticated ? <Hoteles /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/aeropuertos"
                    element={isAuthenticated ? <Aeropuertos /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/vuelos"
                    element={isAuthenticated ? <Vuelos /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/aerolineas"
                    element={isAuthenticated ? <Aerolineas /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/traslados"
                    element={isAuthenticated ? <Traslados /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/crear-itinerario"
                    element={isAuthenticated ? <CrearItinerario2 /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/VerItinerario"
                    element={isAuthenticated ? <VerItinerario /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/crear-eventos/:itinerarioId"
                    element={isAuthenticated ? <CrearEvento /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/agregar-actividad/:itinerarioId"
                    element={isAuthenticated ? <AgregarActividad /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/agregar-traslado/:itinerarioId"
                    element={isAuthenticated ? <AgregarTraslado /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/itinerario/:id/eventos"
                    element={isAuthenticated ? <DetallesItinerario /> : <Navigate to="/" />}
                  />
                 
                  <Route
                    path="/editar-traslado/:id"
                    element={isAuthenticated ? <FormularioTraslado /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/editar-hotel/:id"
                    element={isAuthenticated ? <FormularioHotel /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/editar-aerolinea/:id"
                    element={isAuthenticated ? <FormularioAerolinea /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/editar-vuelo/:id"
                    element={isAuthenticated ? <FormularioVuelo /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/editar-aeropuerto/:id"
                    element={isAuthenticated ? <FormularioAeropuerto /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/crearGrupo"
                    element={isAuthenticated ? <CrearGrupoDeViaje /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/viajeros/:grupoId"
                    element={isAuthenticated ? <Viajeros /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/itinerario/:id/editarItinerario"
                    element={isAuthenticated ? <EditarItinerario /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/donde-estoy2"
                    element={isAuthenticated ? <DondeEstoy2 /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/cambiar-contrasena"
                    element={isAuthenticated ? <CambiarContrasena /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/agregarViajeroAGrupo/:grupoId"
                    element={isAuthenticated ? <AgregarViajeroAGrupo /> : <Navigate to="/" />}
                  />
                 <Route
                    path="/actividad-opcional/:grupoId/:viajeroId"
                    element={isAuthenticated ? <ActividadOpcional /> : <Navigate to="/" />}
                  />

                  <Route
                    path="/verDatosViajero"
                    element={isAuthenticated ? <VerDatosViajero /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/usuariosActividadOpcional/:itinerarioId"
                    element={isAuthenticated ? <ListadoUsuariosDeActividadOpcional /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/VerItinerarioViajero"
                    element={isAuthenticated ? <VerItinerarioViajero /> : <Navigate to="/" />}
                  />

                  {/* 404 route */}
                  <Route path="*" element={<NoEncontrado />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </SnackbarProvider>
        </CiudadProvider>
      </PaisProvider>
    </UsuarioProvider>
  );
}

export default App;
