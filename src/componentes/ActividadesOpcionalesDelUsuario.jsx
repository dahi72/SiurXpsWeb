import { useEffect, useState, useCallback } from "react";
import { Grid, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const ActividadesOpcionalesDelUsuario = () => {
  const [actividades, setActividades] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;
  const { grupoDeViajeId } = useParams();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const obtenerUsuario = useCallback(async () => {
    try {
      const respuesta = await fetch(`${baseUrl}/Usuario/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || "Error al obtener el usuario.");
      }

      const datos = await respuesta.json();
      setUsuario(datos);
    } catch (error) {
      setError(error.message);
    }
  }, [baseUrl, token, id]);

  useEffect(() => {
    if (!usuario) {
      obtenerUsuario();
    }
  }, [usuario, obtenerUsuario]);

  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        const respuesta = await fetch(`${baseUrl}/Actividad/opcionales/${grupoDeViajeId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(errorData.message || "Error al obtener las actividades opcionales.");
        }

        const datos = await respuesta.json();
        console.log("Respuesta del backend (actividades opcionales):", datos);

        if (usuario) {
          const actividadesFiltradas = datos.filter(
            (actividad) =>
              Array.isArray(usuario.actividades) &&
              !usuario.actividades.some((a) => Number(a.id) === Number(actividad.id))
          );
          setActividades(actividadesFiltradas);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    if (grupoDeViajeId && usuario) {
      obtenerActividades();
    }
  }, [grupoDeViajeId, usuario, token, baseUrl]);

  if (cargando) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Actividades Opcionales
      </Typography>
      {actividades.length === 0 ? (
        <p>No hay actividades opcionales disponibles para este grupo de viaje.</p>
      ) : (
        <Grid container spacing={2}>
          {actividades.map((actividad) => (
            <Grid item xs={12} sm={6} md={4} key={actividad.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{actividad.nombre}</Typography>
                  <Typography>
                    <strong>Descripción:</strong> {actividad.descripcion}
                  </Typography>
                  <Typography>
                    <strong>Ubicación:</strong> {actividad.ubicacion}
                  </Typography>
                  <Typography>
                    <strong>Duración:</strong> {actividad.duracion}
                  </Typography>
                  <Typography>
                    <strong>Tips:</strong> {actividad.tips}
                  </Typography>
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
