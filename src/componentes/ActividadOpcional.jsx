import { useState, useEffect } from "react";
import { Box, Button, Typography, Snackbar, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useParams } from "react-router-dom";

function ActividadOpcional() {
  const { viajeroId } = useParams();
  const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActividad, setSelectedActividad] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [ setMensaje] = useState("");
  const [ setTipoAlerta] = useState("success");
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error('No hay sesión activa.');
        }

        const response = await fetch(`${baseUrl}/Actividad/opcionales`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Error al cargar actividades opcionales.');
        }

        const data = await response.json();
        setActividadesOpcionales(data);
      } catch (err) {
        setError(err.message);
        setTipoAlerta("error");
        setMensaje(err.message);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, setMensaje, setTipoAlerta, token]);

  const handleInscribir = async () => {
    if (!selectedActividad) {
      setMensaje("Debe seleccionar una actividad.");
      setTipoAlerta("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      if (!token) throw new Error("No hay sesión activa.");

      const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: parseInt(viajeroId),
          actividadId: parseInt(selectedActividad),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'El usuario ya está inscrito en esta actividad.');
      }

      setSuccessMessage("Inscripción realizada con éxito.");
      setSuccess(true);
      setMensaje("Inscripción realizada con éxito.");
      setTipoAlerta("success");
      setOpenSnackbar(true);
      setSelectedActividad("");

    } catch (err) {
      setError(err.message || "Error al inscribir al usuario en la actividad.");
      setTipoAlerta("error");
      setOpenSnackbar(true);
    }
  };

  const handleDesinscribir = async () => {
    if (!selectedActividad) {
      setMensaje("Debe seleccionar una actividad.");
      setTipoAlerta("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      if (!token) throw new Error("No hay sesión activa.");

      const response = await fetch(`${baseUrl}/Actividad/desinscribirUsuario`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: parseInt(viajeroId),
          actividadId: parseInt(selectedActividad),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "El usuario no está inscrito en esta actividad.");
      }

      setSuccessMessage("Usuario desinscrito correctamente.");
      setSuccess(true);
      setMensaje("Usuario desinscrito correctamente.");
      setTipoAlerta("success");
      setOpenSnackbar(true);
      setSelectedActividad("");

    } catch (err) {
      setError(err.message || "Error al desinscribir al usuario de la actividad.");
      setTipoAlerta("error");
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "background.default" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "background.default" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Actividades Opcionales
      </Typography>

      <Box sx={{ backgroundColor: "white", borderRadius: "10px", padding: "2rem", boxShadow: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Seleccionar Actividad</InputLabel>
          <Select
            value={selectedActividad}
            onChange={(e) => setSelectedActividad(e.target.value)}
            label="Seleccionar Actividad"
            fullWidth
          >
            <MenuItem value="">Seleccione una actividad</MenuItem>
            {actividadesOpcionales.map((actividad) => (
              <MenuItem key={actividad.id} value={actividad.id}>
                {actividad.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button variant="contained" color="primary" fullWidth onClick={handleInscribir} disabled={!selectedActividad}>
            Inscribir
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={handleDesinscribir} disabled={!selectedActividad}>
            Desinscribir
          </Button>
        </Box>
      </Box>

      {(successMessage || error) && (
        <Typography variant="body2" color={success ? "success.main" : "error.main"} sx={{ mt: 2 }}>
          {success ? successMessage : error}
        </Typography>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={success ? "success" : "error"} variant="filled" onClose={() => setOpenSnackbar(false)}>
          {success ? successMessage : error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ActividadOpcional;


// import { useState, useEffect } from "react";
// import { Box, Button, Typography, Snackbar, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
// import { useParams } from "react-router-dom";

// function ActividadOpcional() {
//   const { viajeroId } = useParams();
//   const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedActividad, setSelectedActividad] = useState('');
//   const [setSuccess] = useState(false);
//   const [ setSuccessMessage] = useState('');
//   const [ setError] = useState(null);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [mensaje, setMensaje] = useState("");
//   const [tipoAlerta, setTipoAlerta] = useState("success");
//   const token = localStorage.getItem('token');
//   const baseUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!token) {
//           setError('No hay sesión activa.');
//           setTipoAlerta('error');
//           setMensaje('No hay sesión activa.');
//           setOpenSnackbar(true);
//           return;
//         }

//         const opcionalesRes = await fetch(`${baseUrl}/Actividad/opcionales`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });

//         if (!opcionalesRes.ok) {
//           const errorData = await opcionalesRes.json();
//           throw new Error(errorData.message);
//         }

//         setActividadesOpcionales(await opcionalesRes.json());
//       } catch (err) {
//         setError('Hubo un error al cargar los datos.');
//         setTipoAlerta('error');
//         setMensaje('Hubo un error al cargar los datos.');
//         setOpenSnackbar(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [baseUrl, token, setError]);

//   const handleInscribir = async () => {
//     if (!selectedActividad) {
//       setError('Debe seleccionar una actividad.');
//       setTipoAlerta('error');
//       setMensaje('Debe seleccionar una actividad.');
//       setOpenSnackbar(true);
//       return;
//     }

//     try {
      
//       if (!token) {
//         setError('No hay sesión activa.');
//         setTipoAlerta('error');
//         setMensaje('No hay sesión activa.');
//         setOpenSnackbar(true);
//         return;
//       }

//       const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           usuarioId: parseInt(viajeroId),
//           actividadId: parseInt(selectedActividad),
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'El usuario ya esta inscripto en esta actividad');
//       }

//       setSuccessMessage('Inscripción realizada con éxito');
//       setSuccess(true);
//       setSelectedActividad('');
      
//       setTimeout(() => {
//         setSuccess(false);
//       }, 3000);
//     } catch (err) {
//       setError('Error al inscribir al usuario en la actividad.');
//       setTipoAlerta('error');
//       setMensaje('Error al inscribir al usuario en la actividad.');
//       setOpenSnackbar(true);
//     }
//   };

//   const handleDesinscribir = async () => {
//     if (!selectedActividad) {
//       setError('Debe seleccionar una actividad.');
//       setTipoAlerta('error');
//       setMensaje('Debe seleccionar una actividad.');
//       setOpenSnackbar(true);
//       return;
//     }

//     try {
//       if (!token) {
//         setError('No hay sesión activa.');
//         setTipoAlerta('error');
//         setMensaje('No hay sesión activa.');
//         setOpenSnackbar(true);
//         return;
//       }

//       const response = await fetch(`${baseUrl}/Actividad/desinscribirUsuario`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           usuarioId: parseInt(viajeroId),
//           actividadId: parseInt(selectedActividad),
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'El usuario no está inscrito en esa actividad');
//       }

//       setSuccessMessage('Usuario desinscrito correctamente de la actividad');
//       setSuccess(true);
//       setSelectedActividad('');
      
//       setTimeout(() => {
//         setSuccess(false);
//       }, 3000);
//     } catch (err) {
//       setError('Error al desinscribir al usuario de la actividad.');
//       setTipoAlerta('error');
//       setMensaje('Error al desinscribir al usuario de la actividad.');
//       setOpenSnackbar(true);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "background.default" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ padding: "2rem", backgroundColor: "background.default" }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Gestión de Actividades Opcionales
//       </Typography>

//       <Box sx={{ backgroundColor: "white", borderRadius: "10px", padding: "2rem", boxShadow: 3 }}>
//         <FormControl fullWidth>
//           <InputLabel>Seleccionar Actividad</InputLabel>
//           <Select
//             value={selectedActividad}
//             onChange={(e) => setSelectedActividad(e.target.value)}
//             label="Seleccionar Actividad"
//             fullWidth
//           >
//             <MenuItem value="">Seleccione una actividad</MenuItem>
//             {actividadesOpcionales.map((actividad) => (
//               <MenuItem key={actividad.id} value={actividad.id}>
//                 {actividad.nombre}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//           <Button variant="contained" color="primary" fullWidth onClick={handleInscribir} disabled={!selectedActividad}>
//             Inscribir
//           </Button>
//           <Button variant="contained" color="error" fullWidth onClick={handleDesinscribir} disabled={!selectedActividad}>
//             Desinscribir
//           </Button>
//         </Box>
//       </Box>

//       <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
//         <Alert severity={tipoAlerta} variant="filled" onClose={() => setOpenSnackbar(false)}>
//           {mensaje}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

// export default ActividadOpcional;