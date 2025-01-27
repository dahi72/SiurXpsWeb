import React, { createContext, useState, useEffect } from "react";

export const PaisContext = createContext();

export const PaisProvider = ({ children }) => {
   const [paises, setPaises] = useState([]);
   const [error, setError] = useState(null);
   const baseUrl = process.env.REACT_APP_API_URL;
   const token = localStorage.getItem("token");

   useEffect(() => {
     fetch(`${baseUrl}/Pais/listado`, {
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
        const paisesOrdenados = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setPaises(paisesOrdenados);
       })
       .catch((error) => {
         setError(error.message); 
       });
   }, [baseUrl, token]); 

   return (
     <PaisContext.Provider value={{ paises, error }}>
       {children}
     </PaisContext.Provider>
   );
};
