
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Snackbar, 
  Alert, 
  CircularProgress, 
  Box
} from '@mui/material';


const ActividadOpcional = () => {
  const { idViajero } = useParams();
  const [actividadesInscritas, setActividadesInscritas] = useState ([]);
  const [actividadesOpcionales, setActividadesOpcionales] = useState ([]);
  const [loading, setLoading] = useState(true);
  const [selectedActividad, setSelectedActividad] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  // Use import.meta.env instead of process.env for Vite
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const obtenerActividadesInscritas = async () => {
      try {
        const response = await fetch(`${baseUrl}/Usuario/usuario/${idViajero}/opcionales`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setActividadesInscritas(data);
        } else {
          setError('No se pudo obtener las actividades inscritas.');
        }
      } catch (error) {
        setError('Hubo un error al obtener las actividades inscritas.');
      }
    };

    const obtenerActividadesOpcionales = async () => {
      try {
        const response = await fetch(`${baseUrl}/Actividad/opcionales`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setActividadesOpcionales(data);
        } else {
          setError('No se pudo obtener las actividades disponibles.');
        }
      } catch (error) {
        setError('Hubo un error al obtener las actividades disponibles.');
      } finally {
        setLoading(false);
      }
    };

    if (idViajero) {
      obtenerActividadesInscritas();
      obtenerActividadesOpcionales();
    }
  }, [idViajero, baseUrl]);

  const handleDesinscribir = async (actividadId) => {
    try {
      const response = await fetch(`${baseUrl}/Actividad/desinscribirUsuario`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idViajero, actividadId }),
      });

      if (!response.ok) {
        throw new Error('Error al desinscribir de la actividad');
      }

      setActividadesInscritas(actividadesInscritas.filter((actividad) => actividad.id !== actividadId));
      setSuccess(true);
    } catch (error) {
      setError('Hubo un error al desinscribir la actividad.');
    }
  };

  const handleInscribir = async () => {
    if (!selectedActividad) return;

    try {
      const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idViajero, actividadId: selectedActividad }),
      });

      if (!response.ok) {
        throw new Error('Error al inscribir a la actividad');
      }

      const nuevaActividad = actividadesOpcionales.find((actividad) => actividad.id === selectedActividad);
      if (nuevaActividad) {
        setActividadesInscritas([...actividadesInscritas, nuevaActividad]);
      }
      setSuccess(true);
    } catch (error) {
      setError('Hubo un error al inscribir a la actividad.');
    }
  };

  const handleSelectChange = (event) => {
    setSelectedActividad(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          Actividades Opcionales - Usuario
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary">
              {error}
            </Typography>
          </Paper>
        ) : (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Actividades opcionales Inscritas
            </Typography>
            <Paper sx={{ p: 2, mb: 4 }}>
              {actividadesInscritas.length > 0 ? (
                actividadesInscritas.map((actividad) => (
                  <Box key={actividad.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{actividad.nombre}</Typography>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={() => handleDesinscribir(actividad.id)}
                    >
                      Desinscribirse
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No tienes actividades opcionales inscritas.</Typography>
              )}
            </Paper>

            <Typography variant="h5" sx={{ mb: 2 }}>
              Inscripción a Actividad opcionales
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Seleccionar Actividad opcional</InputLabel>
              <Select
                value={selectedActividad}
                onChange={handleSelectChange}
                label="Seleccionar Actividad"
              >
                {actividadesOpcionales.map((actividad) => (
                  <MenuItem key={actividad.id} value={actividad.id}>
                    {actividad.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              onClick={handleInscribir}
              disabled={!selectedActividad}
            >
              Inscribirse a actividad opcional
            </Button>
          </>
        )}

        <Snackbar 
          open={success} 
          autoHideDuration={3000} 
          onClose={() => setSuccess(false)}
        >
          <Alert 
            onClose={() => setSuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            Operación realizada con éxito
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ActividadOpcional;



// import React, { useEffect, useState } from 'react';
// import { Container, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Button, Snackbar, Alert, CircularProgress, Box } from '@mui/material';
// import { useParams } from 'react-router-dom';

// const ActividadOpcional = () => {
//   const { idViajero } = useParams();
//   const [actividadesInscritas, setActividadesInscritas] = useState([]);
//   const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedActividad, setSelectedActividad] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const baseUrl = process.env.REACT_APP_API_URL;
    
//   useEffect(() => {
//     const obtenerActividadesInscritas = async () => {
//       try {
//         const response = await fetch(`${baseUrl}/Usuario/usuario/${idViajero}/opcionales`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setActividadesInscritas(data);
//         } else {
//           setError('No se pudo obtener las actividades inscritas.');
//         }
//       } catch (error) {
//         setError('Hubo un error al obtener las actividades inscritas.');
//       }
//     };

//     // Obtener el listado de todas las actividades opcionales
//     const obtenerActividadesOpcionales = async () => {
//       try {
//         const response = await fetch(`${baseUrl}/Actividad/opcionales`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setActividadesOpcionales(data);
//         } else {
//           setError('No se pudo obtener las actividades disponibles.');
//         }
//       } catch (error) {
//         setError('Hubo un error al obtener las actividades disponibles.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtenerActividadesInscritas();
//     obtenerActividadesOpcionales();
//   }, [ idViajero, baseUrl]);

//   const handleDesinscribir = async (actividadId) => {
//     try {
//       const response = await fetch(`${baseUrl}/Actividad/desinscribirUsuario`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//           body: JSON.stringify({ idViajero, actividadId }),
//       });

//       if (!response.ok) {
//         throw new Error('Error al desinscribir de la actividad');
//       }

//       setActividadesInscritas(actividadesInscritas.filter((actividad) => actividad.id !== actividadId));
//       setSuccess(true);
//     } catch (error) {
//       setError('Hubo un error al desinscribir la actividad.');
//     }
//   };

//   const handleInscribir = async () => {
//     if (!selectedActividad) return;

//     try {
//       const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ idViajero, actividadId: selectedActividad }),
//       });

//       if (!response.ok) {
//         throw new Error('Error al inscribir a la actividad');
//       }

//       setActividadesInscritas([...actividadesInscritas, actividadesOpcionales.find((actividad) => actividad.id === selectedActividad)]);
//       setSuccess(true);
//     } catch (error) {
//       setError('Hubo un error al inscribir a la actividad.');
//     }
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ py: 4 }}>
//         <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
//           Actividades Opcionales - Usuario
//         </Typography>

//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : error ? (
//           <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
//             <Typography variant="h6" color="text.secondary">
//               {error}
//             </Typography>
//           </Paper>
//         ) : (
//           <>
//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Actividades opcionales Inscritas
//             </Typography>
//             <Paper sx={{ p: 2, mb: 4 }}>
//               {actividadesInscritas.length > 0 ? (
//                 actividadesInscritas.map((actividad) => (
//                   <Box key={actividad.id} sx={{ mb: 2 }}>
//                     <Typography>{actividad.nombre}</Typography>
//                     <Button variant="outlined" color="error" onClick={() => handleDesinscribir(actividad.id)}>
//                       Desinscribirse
//                     </Button>
//                   </Box>
//                 ))
//               ) : (
//                 <Typography>No tienes actividades opcionales inscritas.</Typography>
//               )}
//             </Paper>

//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Inscripción a Actividad opcionales
//             </Typography>
//             <FormControl fullWidth sx={{ mb: 3 }}>
//               <InputLabel>Seleccionar Actividad opcional</InputLabel>
//               <Select
//                 value={selectedActividad}
//                 onChange={(e) => setSelectedActividad(e.target.value)}
//                 label="Seleccionar Actividad"
//               >
//                 {actividadesOpcionales.map((actividad) => (
//                   <MenuItem key={actividad.id} value={actividad.id}>
//                     {actividad.nombre}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button variant="contained" onClick={handleInscribir}>
//               Inscribirse a actividad opcional
//             </Button>
//           </>
//         )}

//         <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
//           <Alert severity="success" sx={{ width: '100%' }}>
//             Operación realizada con éxito
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   );
// };

// export default ActividadOpcional;
