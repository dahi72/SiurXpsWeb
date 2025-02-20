import { useEffect, useState } from "react";
import { useUsuario } from "../hooks/UsuarioContext";
import { Grid } from "lucide-react";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const ActividadesOpcionalesDelUsuario = () => {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useUsuario();
  const baseUrl = process.env.REACT_APP_API_URL;
  const { grupoDeViajeId } = useParams(); 
    const token = localStorage.getItem('token'); 
  useEffect(() => {
    const obtenerActividades = async () => {
        try {
          const respuesta = await fetch(`${baseUrl}/Actividad/opcionales/${grupoDeViajeId}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,  
              "Content-Type": "application/json"
            }
          });

        if (!respuesta.ok) {
          throw new Error("Error al obtener las actividades opcionales.");
        }

        const datos = await respuesta.json();

        const actividadesFiltradas = datos.actividades.filter(
          (actividad) => !usuario.actividades.some((a) => a.id === actividad.id)
        );

        setActividades(actividadesFiltradas);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    if (grupoDeViajeId && usuario) {
      obtenerActividades();
    }
  }, [ token, grupoDeViajeId,usuario, baseUrl]);
    console.log("actividades", usuario.actividades)
    console.log("grupoID", grupoDeViajeId)
    
  if (cargando) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Actividades Opcionales</Typography>
      {actividades.length === 0 ? (
        <p>No esta inscripto a ninguna actividad opcional.</p>
      ) : (
        <Grid container spacing={2}>
          {actividades.map((actividad) => (
            <Grid item xs={12} sm={6} md={4} key={actividad.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{actividad.nombre}</Typography>
                  <Typography><strong>Descripción:</strong> {actividad.descripcion}</Typography>
                  <Typography><strong>Ubicación:</strong> {actividad.ubicacion}</Typography>
                  <Typography><strong>Duración:</strong> {actividad.duracion}</Typography>
                  <Typography><strong>Tips:</strong> {actividad.tips}</Typography>
                  <Typography><strong>País:</strong> {actividad.pais.nombre}</Typography>
                  <Typography><strong>Ciudad:</strong> {actividad.ciudad.nombre}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ActividadesOpcionalesDelUsuario;
