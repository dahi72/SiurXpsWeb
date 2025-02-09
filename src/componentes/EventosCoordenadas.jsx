import { useState, useEffect, useCallback } from "react";
import MapaEventos from "./MapaEventos";
import { useParams } from 'react-router-dom';

const EventosDeItinerario = () => {
    const [eventosDelItinerario, setEventosDelItinerario] = useState([]);
    const [eventosConCoordenadas, setEventosConCoordenadas] = useState([]);
    const [ setPaisesData] = useState([]);
    const baseUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const { idItinerario } = useParams();

    // 1️⃣ Obtener eventos del itinerario
    const obtenerEventosDeItinerario = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/Itinerario/${idItinerario}/eventos`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Error al cargar los eventos');
            const data = await response.json();
            setEventosDelItinerario(data);
        } catch (error) {
            console.error(error.message || 'Ocurrió un error al cargar los eventos.');
        }
    }, [baseUrl, token, idItinerario]);

    // 2️⃣ Obtener listado de países
    const obtenerListadoPaises= useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/Pais/listado`);
            const data = await response.json();
            setPaisesData(data);
        } catch (error) {
            console.error("Error al obtener los países", error);
        }
    }, [baseUrl, setPaisesData]);


    // 3️⃣ Obtener coordenadas
    const obtenerCoordenadas = async (direccion) => {
        const apiKey = 'ffe0407498914865a2e38a5418e8a482'; 
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(direccion)}&key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                return { lat, lng };
            }
        } catch (error) {
            console.error("Error al obtener coordenadas:", error);
        }
        return null;
    };

// 4️⃣ Obtener detalles de eventos con coordenadas
const obtenerEventosConCoordenadas = useCallback(async () => {
    const eventosConCoords = await Promise.all(eventosDelItinerario.map(async (evento) => {
        const coordenadas = await obtenerCoordenadas(evento.direccion);
        return coordenadas ? { ...evento, lat: coordenadas.lat, lon: coordenadas.lng } : null;
    }));

    setEventosConCoordenadas(eventosConCoords.filter(e => e)); // Filtra los valores nulos
}, [ eventosDelItinerario]); // Agregué eventosDelItinerario a las dependencias


    // 5️⃣ Ejecutar las funciones en `useEffect`
    useEffect(() => {
        obtenerEventosDeItinerario();
        obtenerListadoPaises();
    }, [obtenerEventosDeItinerario, obtenerListadoPaises]);

    useEffect(() => {
        if (eventosDelItinerario.length > 0) {
            obtenerEventosConCoordenadas();
        }
    }, [eventosDelItinerario, obtenerEventosConCoordenadas]);

    return (
        <div>
            <h2>Mapa de Eventos</h2>
            <MapaEventos eventos={eventosConCoordenadas} />
        </div>
    );
};

export default EventosDeItinerario;
