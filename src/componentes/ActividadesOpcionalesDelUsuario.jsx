import { useEffect, useState, useCallback } from "react";
import { Grid, Card, CardContent, CircularProgress, Typography, Box } from "@mui/material";
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
console.log(error);
  // Obtener el usuario
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

  // Obtener actividades opcionales
  const obtenerActividades = useCallback(async () => {
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

      // Filtrar actividades en las que el usuario está inscrito
      if (usuario && Array.isArray(usuario.actividades)) {
        const actividadesInscritas = datos.filter((actividad) =>
          usuario.actividades.some((a) => Number(a.id) === Number(actividad.id))
        );

        if (actividadesInscritas.length === 0) {
          // Si no está inscrito en ninguna actividad
          setActividades([]); // No mostrar actividades
          setError("El usuario no está inscrito en ninguna actividad opcional.");
        } else {
          // Mostrar solo las actividades en las que está inscrito
          setActividades(actividadesInscritas);
        }
      } else {
        // Si no hay usuario o no tiene actividades, mostrar mensaje
        setActividades([]);
        setError("El usuario no está inscrito en ninguna actividad opcional.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }, [grupoDeViajeId, usuario, token, baseUrl]);

  // Cargar usuario y actividades
  useEffect(() => {
    obtenerUsuario();
  }, [obtenerUsuario]);

  useEffect(() => {
    if (usuario && grupoDeViajeId) {
      obtenerActividades();
    }
  }, [usuario, grupoDeViajeId, obtenerActividades]);

  if (cargando) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Actividades Opcionales
      </Typography>
      {actividades.length === 0 ? (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body1" color="textSecondary">
            No estás inscrito en ninguna actividad opcional.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: "10px" }}>
            Si deseas inscribirte, por favor escríbele a tu coordinador.
          </Typography>
        </Box>
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
                  <Typography>
                    <strong>País:</strong> {actividad.pais?.nombre || "No disponible"}
                  </Typography>
                  <Typography>
                    <strong>Ciudad:</strong> {actividad.ciudad?.nombre || "No disponible"}
                  </Typography>
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
