import React, { createContext, useState, useEffect, useContext } from "react";

export const UsuarioContext = createContext();

const baseUrl = process.env.REACT_APP_API_URL;

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);

   useEffect(() => {
    const id = JSON.parse(localStorage.getItem("id"));
     const token = localStorage.getItem("token");
     

     if (id && token && !usuario?.primerNombre) {
      
       const url = `${baseUrl}/Usuario/${id}`;

       fetch(url, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`,
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
         
           if (data) {
           
             setUsuario({
              ...usuario,
              primerNombre: data.primerNombre,
              primerApellido: data.primerApellido,
               estado: data.estado,
               pasaporte: data.pasaporte,
               email: data.email,
               documentoPasaporteRuta: data.documentoPasaporteRuta,
             });
           } else {
             throw new Error("Estructura de datos inesperada");
           }
           setLoading(false);
         })
         .catch((error) => {
           setError(error.message);  
           setLoading(false);  
         });
     } else {
       setLoading(false);  
     }
   }, [usuario]); 

   return (
     <UsuarioContext.Provider value={{ usuario, setUsuario, loading, error }}>
       {children}
     </UsuarioContext.Provider>
   );
};

export const useUsuario = () => {
    return useContext(UsuarioContext);
};
