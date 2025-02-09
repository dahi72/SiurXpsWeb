import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MapaEventos from "./MapaEventos";
import { useParams } from 'react-router-dom';

const EventosDeItinerario = () => {
    const [eventosConCoord, setEventosConCoord] = useState([]);
    const [eventosDelItinerario, setEventosDelItinerario] = useState([]);
    const baseUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const { idItinerario } = useParams();
    const[paisesData, setPaisesData] = useState([]);

   
     // 1️⃣ Obtener eventos del itinerario
    const cargarEventosDeItinerario = useCallback(async (idItinerario) => {
     
        try {
            const response = await fetch(`${baseUrl}/Itinerario/${idItinerario}/eventos`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al cargar los grupos');
            }
            const data = await response.json();
            console.log("eventosDelItinerario", EventosDeItinerario)
            setEventosDelItinerario(data);
        } catch (error) {
            console.error(error.message || 'Ocurrió un error al cargar los grupos.');
        } 
    }, [baseUrl, token, setEventosDelItinerario]);

// 2️⃣ Obtener detalles de cada evento y sus coordenadas
// Función para obtener el listado completo de países
const obtenerListadoPaises = async () => {
    const paisesResponse = await fetch(`${baseUrl}/Pais/listado`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setPaisesData(await paisesResponse.json());
    return paisesData;
  };
  
  // Función para obtener las ciudades de un país usando su código ISO
  const obtenerCiudadesDelPais = async (codigoIso) => {
    const ciudadesResponse = await fetch(`${baseUrl}/Ciudad/${codigoIso}/Ciudades`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ciudadesData = await ciudadesResponse.json();
    return ciudadesData;
  };
  
  // Función para obtener el país y la ciudad correspondiente a partir de los IDs
  const obtenerPaisYCiudad = async (paisId, ciudadId, listadoPaises) => {
    if (!paisId || !ciudadId) return { pais: null, ciudad: null };
  
    // Filtra el país por el paisId
    const pais = listadoPaises.find((pais) => pais.id === paisId);
    if (!pais) return { pais: null, ciudad: null };
  
    // Obtener las ciudades del país usando su código ISO
    const ciudadesData = await obtenerCiudadesDelPais(pais.codigoIso);
    const ciudad = ciudadesData.find((ciudad) => ciudad.id === ciudadId);
  
    return { pais: pais.nombre, ciudad: ciudad ? ciudad.nombre : null };
  };
  

 // Función para obtener los detalles de cada tipo de evento
const obtenerDireccion = async (endpoint, id, token) => {
    if (!id) return null;
    
    const res = await fetch(`${baseUrl}/${endpoint}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`, // Agregar el token solo si está presente
      },
    });
    const data = await res.json();
  
    if (data.direccion && data.ciudadId && data.paisId) {
      // Obtener país y ciudad
      const { pais, ciudad } = await obtenerPaisYCiudad(data.paisId, data.ciudadId, paisesData);
      if (pais && ciudad) {
        return `${data.direccion}, ${ciudad}, ${pais}`;
      }
    }
    return null;
  };
  
  // Función para obtener los detalles de los eventos, incluyendo el nombre del país y ciudad
  const obtenerDetallesEvento = async (evento, token) => {
    const detalles = [];
  
    // Realiza las llamadas a la API para cada tipo de evento, pasando el token
    // const direccionActividad = await obtenerDireccion("Actividad", evento.actividadId, token);
    // const direccionTraslado = await obtenerDireccion("Traslado", evento.trasladoId, token);
    const direccionAeropuerto = await obtenerDireccion("Aeropuerto", evento.aeropuertoId, token);
    const direccionHotel = await obtenerDireccion("Hotel", evento.hotelId, token);
  
    // Agrega las direcciones a un array
      [/* direccionActividad, direccionTraslado,*/ direccionAeropuerto, direccionHotel].forEach((direccion) => {
      if (direccion) detalles.push(direccion);
    });
  
    return detalles;
  };
  
  
  // Función para obtener las coordenadas a partir de las direcciones
  const obtenerCoordenadasDeDirecciones = async (direcciones) => {
    const coordenadas = [];
  
    for (const direccion of direcciones) {
      const coords = await obtenerCoordenadas(direccion);  // Utiliza OpenCage o la API que prefieras
      if (coords) {
        coordenadas.push({
          nombre: direccion,
          lat: coords.lat,
          lon: coords.lng
        });
      }
    }
  
    return coordenadas;
  };
    
  const obtenerCoordenadas = async (direccion) => {
    const apiKey = "tu-api-key-de-opencage";  // Sustituye con tu clave API de OpenCage
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(direccion)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry; // Latitud y longitud de la primera coincidencia
        return { lat, lng };
      } else {
        console.error("No se encontraron coordenadas para esta dirección");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener las coordenadas:", error);
      return null;
    }
  };
  
  
  // Función principal que maneja la lógica de obtener eventos y geolocalizar
  const obtenerEventosConCoordenadas = async (eventos) => {
    
    const eventosSimplificados = await Promise.all(eventos.map(async (evento) => {
      const detallesEvento = await obtenerDetallesEvento(evento, token);
      const coordenadasEvento = await obtenerCoordenadasDeDirecciones(detallesEvento);
      return coordenadasEvento;
    }));
  
    return eventosSimplificados.flat();  // Devuelve todos los eventos en un solo array
  };
  


}
export default EventosDeItinerario;
