import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Ícono personalizado para los marcadores
const iconoEvento = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
});

const MapaEventos = ({ eventosConCoordenadas }) => {  // 🔹 Recibe los eventos como prop
    return (
        <MapContainer center={[-34.9011, -56.1645]} zoom={5} style={{ height: "500px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {eventosConCoordenadas.map((evento, index) => (  // 🔹 Usa los eventos para crear los marcadores
                <Marker key={index} position={[evento.lat, evento.lon]} icon={iconoEvento}>
                    <Popup>
                        <strong>{evento.nombre}</strong>
                        <br />
                        {evento.direccion}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapaEventos;
