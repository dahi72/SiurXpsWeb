
import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Select, MenuItem, 
         FormControl, InputLabel, Button, Snackbar, Alert, 
         CircularProgress, Box } from '@mui/material';

const ActividadOpcional = () => {
  const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActividad, setSelectedActividad] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay sesión activa.');
          return;
        }

        const opcionalesRes = await fetch(`${baseUrl}/Actividad/opcionales`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!opcionalesRes.ok) {
            const errorData = await opcionalesRes.json(); 
            throw new Error(errorData.message || 'Error al obtener las actividades');
        }

        setActividadesOpcionales(await opcionalesRes.json());
      } catch (err) {
        setError('Hubo un error al cargar las actividades.');
      } finally {
        setLoading(false);
      }
    };

    obtenerActividades();
  }, [baseUrl]);

  const handleInscribir = async () => {
    if (!selectedActividad) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return setError('No hay sesión activa.');

      const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actividadId: selectedActividad }),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Error al inscribir al usuario');
      }

      const nuevaActividad = actividadesOpcionales.find((act) => act.id === selectedActividad);
      if (nuevaActividad) {
        setSuccess(true);
      }
    } catch {
      setError('Error al inscribirse en la actividad.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Actividades Opcionales
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
            {/* Sección de inscripción a actividades opcionales */}
            <Typography variant="h5" sx={{ mb: 2 }}>Inscripción a Actividades Opcionales</Typography>
            <Paper sx={{ p: 2, mb: 4 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Seleccionar Actividad</InputLabel>
                <Select value={selectedActividad} onChange={(e) => setSelectedActividad(e.target.value)}>
                  {actividadesOpcionales.map((actividad) => (
                    <MenuItem key={actividad.id} value={actividad.id}>
                      {actividad.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleInscribir} disabled={!selectedActividad}>
                Inscribirse
              </Button>
            </Paper>
          </>
        )}

        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Inscripción realizada con éxito.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ActividadOpcional;

// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { 
//   Container, Typography, Paper, Select, MenuItem, 
//   FormControl, InputLabel, Button, Snackbar, Alert, 
//   CircularProgress, Box 
// } from '@mui/material';

// const ActividadOpcional = () => {
//   const { viajeroId } = useParams();
//   const [actividadesInscritas, setActividadesInscritas] = useState([]);
//   const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedActividad, setSelectedActividad] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
  
//   const baseUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const obtenerActividades = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('No hay sesión activa.');
//           return;
//         }

//         const [inscritasRes, opcionalesRes] = await Promise.all([
//           fetch(`${baseUrl}/Usuario/usuario/${viajeroId}/opcionales`, {
//             method: 'GET',
//             headers: { 'Authorization': `Bearer ${token}` },
//           }),
//           fetch(`${baseUrl}/Actividad/opcionales`, {
//             method: 'GET',
//             headers: { 'Authorization': `Bearer ${token}` },
//           }),
//         ]);

//         if (!inscritasRes.ok || !opcionalesRes.ok) {
//             const errorData = await inscritasRes.json() || opcionalesRes.json(); 
//             throw new Error(errorData.message || 'Error al obtener las actividades');
//         }

//         setActividadesInscritas(await inscritasRes.json());
//         setActividadesOpcionales(await opcionalesRes.json());
//       } catch (err) {
//         setError('Hubo un error al cargar las actividades.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (viajeroId) obtenerActividades();
//   }, [viajeroId, baseUrl]);

//   const handleDesinscribir = async (actividadId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return setError('No hay sesión activa.');

//       const response = await fetch(`${baseUrl}/Actividad/desinscribirUsuario`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ viajeroId, actividadId }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Error al desinscribir al usuario');
//       }

//       setActividadesInscritas(actividadesInscritas.filter((act) => act.id !== actividadId));
//       setSuccess(true);
//     } catch {
//       setError('Error al desinscribirse de la actividad.');
//     }
//   };

//   const handleInscribir = async () => {
//     if (!selectedActividad) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return setError('No hay sesión activa.');

//       const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ viajeroId, actividadId: selectedActividad }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json(); 
//         throw new Error(errorData.message || 'Error al inscribir al usuario');
//       }

//       const nuevaActividad = actividadesOpcionales.find((act) => act.id === selectedActividad);
//       if (nuevaActividad) {
//         setActividadesInscritas([...actividadesInscritas, nuevaActividad]);
//       }
//       setSuccess(true);
//     } catch {
//       setError('Error al inscribirse en la actividad.');
//     }
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ py: 4 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
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
//             {/* Sección de actividades inscritas */}
//             <Typography variant="h5" sx={{ mb: 2 }}>Actividades Inscritas</Typography>
//             <Paper sx={{ p: 2, mb: 4 }}>
//               {actividadesInscritas.length > 0 ? (
//                 actividadesInscritas.map((actividad) => (
//                   <Box key={actividad.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography>{actividad.nombre}</Typography>
//                     <Button variant="outlined" color="error" onClick={() => handleDesinscribir(actividad.id)}>
//                       Desinscribirse
//                     </Button>
//                   </Box>
//                 ))
//               ) : (
//                 <Typography>No tienes actividades inscritas.</Typography>
//               )}
//             </Paper>

//             {/* Sección de inscripción a actividades opcionales */}
//             <Typography variant="h5" sx={{ mb: 2 }}>Inscripción a Actividades Opcionales</Typography>
//             <Paper sx={{ p: 2, mb: 4 }}>
//               <FormControl fullWidth sx={{ mb: 3 }}>
//                 <InputLabel>Seleccionar Actividad</InputLabel>
//                 <Select value={selectedActividad} onChange={(e) => setSelectedActividad(e.target.value)}>
//                   {actividadesOpcionales.map((actividad) => (
//                     <MenuItem key={actividad.id} value={actividad.id}>
//                       {actividad.nombre}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <Button variant="contained" onClick={handleInscribir} disabled={!selectedActividad}>
//                 Inscribirse
//               </Button>
//             </Paper>
//           </>
//         )}

//         <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
//           <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
//             Operación realizada con éxito.
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   );
// };

// export default ActividadOpcional;




// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { 
//   Container, Typography, Paper, Select, MenuItem, 
//   FormControl, InputLabel, Button, Snackbar, Alert, 
//   CircularProgress, Box 
// } from '@mui/material';

// const ActividadOpcional = () => {
//   const { viajeroId } = useParams();
//   const [actividadesInscritas, setActividadesInscritas] = useState([]);
//   const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedActividad, setSelectedActividad] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
  
//   const baseUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const obtenerActividades = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('No hay sesión activa.');
//           return;
//         }

//         const [inscritasRes, opcionalesRes] = await Promise.all([
//           fetch(`${baseUrl}/Usuario/usuario/${viajeroId}/opcionales`, {
//             method: 'GET',
//             headers: { 'Authorization': `Bearer ${token}` },
//           }),
//           fetch(`${baseUrl}/Actividad/opcionales`, {
//             method: 'GET',
//             headers: { 'Authorization': `Bearer ${token}` },
//           }),
//         ]);

//         if (!inscritasRes.ok || !opcionalesRes.ok) {
        
//             const errorData = await inscritasRes.json()|| opcionalesRes.json(); 
//         throw new Error(errorData.message || 'Error al obtener las activdades');
//         }
        

//         setActividadesInscritas(await inscritasRes.json());
//         setActividadesOpcionales(await opcionalesRes.json());
//       } catch (err) {
//         setError('Hubo un error al cargar las actividades.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (viajeroId) obtenerActividades();
//   }, [viajeroId,baseUrl]);

//   const handleDesinscribir = async (actividadId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return setError('No hay sesión activa.');

//       const response = await fetch(`${baseUrl}/Actividad/desinscribirUsuario`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ viajeroId, actividadId }),
//       });

//       if (!response.ok){
//         const errorData = await response.json();
//     throw new Error(errorData.message || 'Error al desincribir al usuario');
//     }

//       setActividadesInscritas(actividadesInscritas.filter((act) => act.id !== actividadId));
//       setSuccess(true);
//     } catch {
//       setError('Error al desinscribirse de la actividad.');
//     }
//   };

//   const handleInscribir = async () => {
//     if (!selectedActividad) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return setError('No hay sesión activa.');

//       const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ viajeroId, actividadId: selectedActividad }),
//       });

//       if (!response.ok){
//         const errorData = await response.json(); 
//     throw new Error(errorData.message || 'Error al incribir al usuario');
//     }

//       const nuevaActividad = actividadesOpcionales.find((act) => act.id === selectedActividad);
//       if (nuevaActividad) {
//         setActividadesInscritas([...actividadesInscritas, nuevaActividad]);
//       }
//       setSuccess(true);
//     } catch {
//       setError('Error al inscribirse en la actividad.');
//     }
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ py: 4 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
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
//             <Typography variant="h5" sx={{ mb: 2 }}>Actividades Inscritas</Typography>
//             <Paper sx={{ p: 2, mb: 4 }}>
//               {actividadesInscritas.length > 0 ? (
//                 actividadesInscritas.map((actividad) => (
//                   <Box key={actividad.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography>{actividad.nombre}</Typography>
//                     <Button variant="outlined" color="error" onClick={() => handleDesinscribir(actividad.id)}>
//                       Desinscribirse
//                     </Button>
//                   </Box>
//                 ))
//               ) : (
//                 <Typography>No tienes actividades inscritas.</Typography>
//               )}
//             </Paper>
//             <Typography variant="h5" sx={{ mb: 2 }}>Inscripción a Actividades Opcionales</Typography>
//             <FormControl fullWidth sx={{ mb: 3 }}>
//               <InputLabel>Seleccionar Actividad</InputLabel>
//               <Select value={selectedActividad} onChange={(e) => setSelectedActividad(e.target.value)}>
//                 {actividadesOpcionales.map((actividad) => (
//                   <MenuItem key={actividad.id} value={actividad.id}>
//                     {actividad.nombre}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button variant="contained" onClick={handleInscribir} disabled={!selectedActividad}>
//               Inscribirse
//             </Button>
//           </>
//         )}
    
//         <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
//           <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
//             Operación realizada con éxito.
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   );
// };

// export default ActividadOpcional;
