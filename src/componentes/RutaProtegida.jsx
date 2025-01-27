import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UsuarioContext } from "../hooks/UsuarioContext";

const RutaProtegida = ({ children }) => {
  const { usuario, loading, error } = useContext(UsuarioContext);
  
  if (loading) {
    return <div>Cargando...</div>;  // Mostrar una interfaz de carga
  }

  if (error) {
    return <div>Error: {error}</div>;  // Mostrar un mensaje de error si no se puede cargar el usuario
  }

  // Verifica si el usuario está autenticado y si tiene un token válido
  if (!usuario || !localStorage.getItem('token')) {
    return <Navigate to="/" />;  // Redirige al login si no hay usuario ni token
  }

  return children;  // Muestra el contenido protegido si todo está bien
};

export default RutaProtegida;