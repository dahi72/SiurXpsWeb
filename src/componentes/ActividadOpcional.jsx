import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

function ActividadOpcional() {
  const { viajeroId } = useParams();
  const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActividad, setSelectedActividad] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay sesión activa.');
          return;
        }

        const opcionalesRes = await fetch(`${baseUrl}/Actividad/opcionales`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!opcionalesRes.ok) {
          const errorData = await opcionalesRes.json();
          throw new Error(errorData.message);
        }

        setActividadesOpcionales(await opcionalesRes.json());
      } catch (err) {
        setError('Hubo un error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  const handleInscribir = async () => {
    if (!selectedActividad) {
      setError('Debe seleccionar una actividad.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa.');
        return;
      }

      const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: parseInt(viajeroId),
          actividadId: parseInt(selectedActividad)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al inscribir al usuario');
      }

      setSuccessMessage('Inscripción realizada con éxito');
      setSuccess(true);
      setSelectedActividad('');
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Error al inscribir al usuario en la actividad.');
    }
  };

  const handleDesinscribir = async () => {
    if (!selectedActividad) {
      setError('Debe seleccionar una actividad.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa.');
        return;
      }

      const response = await fetch(`${baseUrl}/Actividad/desinscribirUsuario`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: parseInt(viajeroId),
          actividadId: parseInt(selectedActividad)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al desinscribir al usuario');
      }

      setSuccessMessage('Usuario desinscrito correctamente de la actividad');
      setSuccess(true);
      setSelectedActividad('');
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Error al desinscribir al usuario de la actividad.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-100">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          Gestión de Actividades Opcionales
        </h1>
        
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Seleccionar Actividad
              </label>
              <select
                value={selectedActividad}
                onChange={(e) => setSelectedActividad(e.target.value)}
                className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              >
                <option value="">Seleccione una actividad</option>
                {actividadesOpcionales.map((actividad) => (
                  <option key={actividad.id} value={actividad.id}>
                    {actividad.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleInscribir}
                disabled={!selectedActividad}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Inscribir
              </button>

              <button
                onClick={handleDesinscribir}
                disabled={!selectedActividad}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Desinscribir
              </button>
            </div>
          </div>
        </div>

        {success && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActividadOpcional;




// import { useEffect, useState } from 'react';
// import { Container, Typography, Paper, Select, MenuItem, 
//          FormControl, InputLabel, Button, Snackbar, Alert, 
//   CircularProgress, Box
// } from '@mui/material';
// import { useNavigate } from "react-router-dom";


// const ActividadOpcional = () => {
//   const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedActividad, setSelectedActividad] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem('token');
//   const baseUrl = process.env.REACT_APP_API_URL;
//   const navigate = useNavigate();
//   useEffect(() => {
//     const obtenerActividades = async () => {
//       try {
        
//         const opcionalesRes = await fetch(`${baseUrl}/Actividad/opcionales`, {
//           method: 'GET',
//           headers: { 'Authorization': `Bearer ${token}` },
//         });

//         if (!opcionalesRes.ok) {
//             const errorData = await opcionalesRes.json(); 
//             throw new Error(errorData.message);
//         }

//         setActividadesOpcionales(await opcionalesRes.json());
//       } catch (err) {
//         setError('Hubo un error al cargar las actividades.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtenerActividades();
//   }, [baseUrl, token]);

//   const handleInscribir = async () => {
//     if (!selectedActividad) return;

//     try {

//       const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//        // body: JSON.stringify({ actividadId: selectedActividad }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json(); 
//         throw new Error(errorData.message || 'Error al inscribir al usuario');
//       }

//       const nuevaActividad = actividadesOpcionales.find((act) => act.id === selectedActividad);
//       if (nuevaActividad) {
//         setSuccess(true);
   
//       }
//     } catch {
//       setError('Error al inscribirse en la actividad.');
//     }
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ py: 4 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
//           Actividades Opcionales
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
//                 Inscribir
//               </Button>
//             </Paper>
//           </>
//         )}

//         <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
//             Atrás
//         </Button>

//         <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
//           <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
//             Inscripción realizada con éxito.
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   );
// };

// export default ActividadOpcional;

