import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapaEventos = ({ eventos }) => {
  return (
    <MapContainer center={[-34.6037, -58.3816]} zoom={5} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {eventos.map((evento, index) => (
        <Marker key={index} position={[evento.lat, evento.lng]}>
          <Popup>
            <strong>{evento.nombre}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapaEventos;
