import React, { createContext, useState, useEffect } from "react";


export const CiudadContext = createContext();

export const CiudadProvider = ({ children }) => {
  const [ciudades, setCiudades] = useState([]);
  const [error, setError] = useState(null);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null); // No es necesario que sea un string, puede ser un objeto de país
  const baseUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  // Esta función se llama para cambiar el país seleccionado y obtener las ciudades
  const setPaisSeleccionadoContext = (pais) => {
    setPaisSeleccionado(pais);  // Actualiza el país seleccionado
  };

  // useEffect para obtener las ciudades solo cuando el país seleccionado cambie
  useEffect(() => {
    if (paisSeleccionado) {
      fetch(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then((data) => {
          const ciudadesOrdenadas = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
    setCiudades(ciudadesOrdenadas);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [paisSeleccionado, token, baseUrl]); // Dependencia del país seleccionado

  return (
    <CiudadContext.Provider value={{ ciudades, error, paisSeleccionado, setPaisSeleccionadoContext }}>
      {children}
    </CiudadContext.Provider>
  );
};
