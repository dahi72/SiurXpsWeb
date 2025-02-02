
import React, { useEffect, useState, useCallback } from 'react';
import { 
    Box, 
    Typography, 
    Paper,  
    Button, 
    Snackbar, 
    Alert,
    Container,
    Divider,
    CircularProgress,
    ListItemText,
    ListItem,
    List
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { format } from 'date-fns';

const MisGrupos = () => {
    const [grupos, setGrupos] = useState([]);
    const [paisesFiltrados, setPaisesFiltrados] = useState([]);
    const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    
    const cargarPaisesYCiudades = useCallback(async (grupos) => {
        try {
            // Obtener la lista de países
            const responsePaises = await fetch(`${baseUrl}/Pais/listado`);
            if (!responsePaises.ok) throw new Error('Error al obtener los países');
            const paises = await responsePaises.json();
    
            // Filtrar países que coincidan con los ids de los grupos
            const paisesIds = new Set(grupos.flatMap(g => g.paisesDestinoIds || []));
            const paisesFiltrados = paises.filter(p => paisesIds.has(p.id));
            setPaisesFiltrados(paisesFiltrados);
    
            // Obtener y filtrar ciudades de cada país filtrado
            const ciudadesPromises = paisesFiltrados.map(async (pais) => {
                const responseCiudades = await fetch(`${baseUrl}/Ciudad/${pais.codigoIso}/ciudades`);
                if (!responseCiudades.ok) throw new Error('Error al obtener ciudades');
                const ciudades = await responseCiudades.json();
    
                return ciudades.filter(c => grupos.some(g => g.ciudadesDestinoIds?.includes(c.id)));
            });
    
            const ciudadesFiltradas = (await Promise.all(ciudadesPromises)).flat();
            setCiudadesFiltradas(ciudadesFiltradas);
        } catch (error) {
            setError(error.message || 'Error al obtener países y ciudades.');
        }
    }, [baseUrl]); 

    const cargarGrupos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/GrupoDeViaje/coordinador/${localStorage.getItem("id")}/grupos`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Error al obtener los grupos');
            }
    
            const data = await response.json();
            setGrupos(data);
            await cargarPaisesYCiudades(data);
        } catch (error) {
            setError(error.message || 'Ocurrió un error al cargar los grupos.');
        } finally {
            setLoading(false);
        }
    }, [baseUrl, cargarPaisesYCiudades]);

    

    useEffect(() => {
        cargarGrupos();
    }, [cargarGrupos]);

    const handleDelete = async (grupoId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
            try {
                const response = await fetch(`${baseUrl}/GrupoDeViaje/${grupoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Error al eliminar el grupo');

                setSuccess(true);
                cargarGrupos();
            } catch (error) {
                setError('No se pudo eliminar el grupo');
            }
        }
    };

    const handleClick = (grupoId) => {
        navigate(`/viajeros/${grupoId}`);
    };

    const handleConfirmarGrupo = async (grupoId) => {
        try {
            const response = await fetch(`${baseUrl}/api/GrupoDeViaje/${grupoId}/confirmar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error al confirmar el grupo');

            setSuccess(true);
            cargarGrupos();
        } catch (error) {
            setError('No se pudo confirmar el grupo');
        }
    };

    const tieneViajeros = (grupo) => grupo.viajerosIds && grupo.viajerosIds.length > 0;
    const formatFechaCorta = (fecha) => format(new Date(fecha), 'dd MMM yyyy');
    const isGrupoEnViaje = (fechaInicio) => new Date(fechaInicio) <= new Date();

    return (
<Container maxWidth="lg">
<Box sx={{ 
display: 'flex', 
alignItems: 'center', 
mb: 4,
borderBottom: 1,
borderColor: 'divider',
pb: 2,
justifyContent: 'center',
width: '100%'
}}>
<Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
Mis grupos de viaje
</Typography>
</Box>

{loading && (
<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
<CircularProgress />
</Box>
)}

<Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
<Alert severity="success">Operación realizada con éxito</Alert>
</Snackbar>

<Snackbar open={Boolean(error)} autoHideDuration={3000} onClose={() => setError(null)}>
<Alert severity="error">{error}</Alert>
</Snackbar>

{!loading && grupos.length === 0 ? (
<Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
<Typography variant="h6" color="text.secondary">
No tienes grupos de viaje creados.
</Typography>
</Paper>
) : (
<Box sx={{ 
display: 'grid',
gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
gap: 3
}}>
{grupos.map(grupo => {
    const paisesGrupo = paisesFiltrados.filter(p => grupo.paisesDestinoIds?.includes(p.id));
    const ciudadesGrupo = ciudadesFiltradas.filter(c => grupo.ciudadesDestinoIds?.includes(c.id));

    return (
        <Paper key={grupo.id} elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {grupo.nombre}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Fechas:</strong> {formatFechaCorta(grupo.fechaInicio)} - {formatFechaCorta(grupo.fechaFin)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Destinos:</strong>
                <List>
                    {paisesGrupo.map((pais, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`País: ${pais.nombre}`} />
                        </ListItem>
                    ))}
                    {ciudadesGrupo.map((ciudad, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`Ciudad: ${ciudad.nombre}`} />
                        </ListItem>
                    ))}
                </List>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                <Button onClick={() => handleClick(grupo.id)} sx={{ mt: 2 }}>
                    Ver viajeros
                </Button>
            </Typography>
             <Box sx={{ 
                display: 'flex', 
                gap: 1,
                flexWrap: 'wrap',
                mt: 'auto' 
            }}>
            <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate(`/agregarViajeroAGrupo/${grupo.id}`)}
                size="small"
                fullWidth
            >
                Agregar Viajero
            </Button>
                                            
            <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => handleDelete(grupo.id)}
                disabled={isGrupoEnViaje(grupo.fechaInicio)}
                size="small"
                fullWidth
            >
                Eliminar
            </Button> 
            <Button
                variant="outlined"
                onClick={() => handleConfirmarGrupo(grupo.id)}
                disabled={isGrupoEnViaje(grupo.fechaInicio)|| !tieneViajeros(grupo)}
                size="small"
                fullWidth
            >
                Confirmar grupo
            </Button>            
        </Box> 
    </Paper>
                            );
                        })}
                    </Box>
                )}
        </Container>
    );
};

export default MisGrupos;






// import React, { useEffect, useState, useCallback, useContext } from 'react';
// import { 
//     Box, 
//     Typography, 
//     Paper,  
//     Button, 
//     Snackbar, 
//     Alert,
//     Container,
//     Divider,
//     CircularProgress,
//     ListItemText,
//     ListItem,
//     List
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import DeleteIcon from '@mui/icons-material/Delete';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import { format } from 'date-fns';
// import { PaisContext } from "../hooks/PaisContext"; 
// import { CiudadContext } from "../hooks/CiudadContext";


// const MisGrupos = () => {
//     const { paises } = useContext(PaisContext); 
//     const { ciudades } = useContext(CiudadContext);
//     const [grupos, setGrupos] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [setError] = useState(null);
//     const [setMensaje] = useState('');
//     const [success, setSuccess] = useState(false);
//     const baseUrl = process.env.REACT_APP_API_URL;
//     const navigate = useNavigate();
    
//     const cargarGrupos = useCallback(() => {
//         setLoading(true);
//         fetch(`${baseUrl}/GrupoDeViaje/coordinador/${localStorage.getItem("id")}/grupos`, {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(data => {
//                     if (data.length === 0) {
//                         setMensaje('No hay grupos para mostrar.');
//                         return []; // Retorna un array vacío para que el siguiente .then() lo procese correctamente
//                     }
//                     throw new Error('Error al obtener los grupos');
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Transformar los datos correctamente antes de asignarlos a setGrupos
//             const gruposConNombres = data.map(grupo => ({
//                 ...grupo,
//                 paisesDestino: grupo.paisesDestinoIds.map(id => 
//                     paises.find(p => p.id === id)?.nombre || `ID ${id}`
//                 ),
//                 ciudadesDestino: grupo.ciudadesDestinoIds.map(id => 
//                     ciudades.find(c => c.id === id)?.nombre || `ID ${id}`
//                 )
//             }));
    
//             setGrupos(gruposConNombres);
//             setMensaje('Grupos cargados correctamente.');
//         })
//         .catch(error => {
//             setError(error.message || 'Ocurrió un error al cargar los grupos.');
//         })
//         .finally(() => {
//             setLoading(false);
//         });
//     }, [baseUrl, paises, ciudades, setError, setMensaje]);

//     useEffect(() => {
//         cargarGrupos();
//     }, [cargarGrupos]);

//     const handleDelete = useCallback((grupoId) => {
//         if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
//             fetch(`${baseUrl}/GrupoDeViaje/${grupoId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
//                 .then(response => {
//                     if (!response.ok) throw new Error('Error al eliminar el grupo');
//                     setSuccess(true);
//                     cargarGrupos();
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                     setError('No se pudo eliminar el grupo');
//                 });
//         }
//     }, [baseUrl, cargarGrupos, setError]);

//     const handleClick = (grupoId) => {
//         navigate(`/viajeros/${grupoId}`);
//     };
   
//     const handleConfirmarGrupo = (grupoId) => {
//         fetch(`${baseUrl}/api/GrupoDeViaje/${grupoId}/confirmar`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'application/json'
//             }
//         })
//             .then(response => {
//                 if (!response.ok) throw new Error('Error al confirmar el grupo');
//                 setSuccess(true);
//                 cargarGrupos();
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 setError('No se pudo confirmar el grupo');
//             });
//     };

//     const tieneViajeros = (grupo) => grupo.viajerosIds && grupo.viajerosIds.length > 0;
//     const formatFechaCorta = (fecha) => format(new Date(fecha), 'dd MMM yyyy');
//     const isGrupoEnViaje = (fechaInicio) => new Date(fechaInicio) <= new Date();

//     return (
//     <Container maxWidth="lg">
//         <Box sx={{ py: 4 }}>
          
//             <Box sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 mb: 4,
//                 borderBottom: 1,
//                 borderColor: 'divider',
//                 pb: 2,
//                 justifyContent: 'center',
//                 width: '100%'
//             }}>
       
//         <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
//             Mis grupos de viaje
//         </Typography>
//         </Box>

//     {loading && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//             <CircularProgress />
//         </Box>
//     )}
//     <Snackbar
//         open={success}
//         autoHideDuration={3000}
//         onClose={() => setSuccess(false)}
//     >
//         <Alert severity="success" sx={{ width: '100%' }}>
//             Operación realizada con éxito
//         </Alert>
//     </Snackbar>

   
//     {!loading && grupos.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
//             <Typography variant="h6" color="text.secondary">
//                 No tienes grupos de viaje creados.
//             </Typography>
//         </Paper>
//     ) : (
//     <Box sx={{ 
//         display: 'grid',
//         gridTemplateColumns: { 
//             xs: '1fr', 
//             sm: 'repeat(2, 1fr)', 
//             md: 'repeat(3, 1fr)' 
//         },
//         gap: 3
//     }}>
//     {grupos.map(grupo => (
//         <Paper
//         key={grupo.id}
//         elevation={3}
//         sx={{
//             p: 3,
//             transition: 'transform 0.2s, box-shadow 0.2s',
//             '&:hover': {
//             transform: 'translateY(-4px)',
//             boxShadow: 8
//             }
//         }}
//         >
//                 <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//                     {grupo.nombre}
//                 </Typography>
//                 <Divider sx={{ mb: 2 }} />
//                 <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
//                     <strong>Fechas:</strong><br />
//                     {formatFechaCorta(grupo.fechaInicio)} - {formatFechaCorta(grupo.fechaFin)}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
//                         <strong>Destinos:</strong><br />
//                         <List>
//                             {grupo.paisesDestino.map((pais, index) => (
//                                 <ListItem key={index}>
//                                     <ListItemText primary={`País: ${pais}`} />
//                                 </ListItem>
//                             ))}
//                             {grupo.ciudadesDestino.map((ciudad, index) => (
//                                 <ListItem key={index}>
//                                     <ListItemText primary={`Ciudad: ${ciudad}`} />
//                                 </ListItem>
//                             ))}
//                         </List>
//             </Typography>

//     {/* <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
//             <strong>Destinos:</strong><br />
//             {grupo.paises && grupo.paises.map((pais, index) => (
//                 <Box key={index} sx={{ ml: 1, mb: 1 }}>
//                     • {pais.Nombre}
//                 </Box>
//             ))}
//             {grupo.ciudades && grupo.ciudades.map((ciudad, cidx) => (
//                 <Typography 
//                     key={cidx} 
//                     variant="body2" 
//                     component="div"
//                     sx={{ 
//                         fontSize: '0.9em',
//                         color: 'text.secondary',
//                         ml: 2
//                     }}
//                 >
//                     - {ciudad.Nombre}
//                 </Typography>
//             ))}
// </Typography> */}
// <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
// <Button onClick={() => handleClick(grupo.id)} sx={{ mt: 2 }}>
//                 Ver viajeros
// </Button>
// </Typography>

//     <Box sx={{ 
//         display: 'flex', 
//         gap: 1,
//         flexWrap: 'wrap',
//         mt: 'auto' 
//     }}>
//     <Button
//         variant="outlined"
//         startIcon={<PersonAddIcon />}
//         onClick={() => navigate(`/agregarViajeroAGrupo/${grupo.id}`)}
//         size="small"
//         fullWidth
//     >
//         Agregar Viajero
//     </Button>
                                    
//     <Button
//         variant="outlined"
//         startIcon={<DeleteIcon />}
//         color="error"
//         onClick={() => handleDelete(grupo.id)}
//         disabled={isGrupoEnViaje(grupo.fechaInicio)}
//         size="small"
//         fullWidth
//     >
//         Eliminar
//     </Button> 
//     <Button
//         variant="outlined"
//         onClick={() => handleConfirmarGrupo(grupo.id)}
//         disabled={isGrupoEnViaje(grupo.fechaInicio)|| !tieneViajeros(grupo)}
//         size="small"
//         fullWidth
//     >
//         Confirmar grupo
//     </Button>            
// </Box> 
// </Paper>
// ))}
// </Box>
// )}
// </Box>
// </Container>
// );
// };

// export default MisGrupos;