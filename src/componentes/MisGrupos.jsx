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
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { format } from 'date-fns';

const MisGrupos = () => {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [setError] = useState(null);
    const [setMensaje] = useState('');
    const [success, setSuccess] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    
    const cargarGrupos = useCallback(() => {
        setLoading(true);
        
   

    fetch(`${baseUrl}/GrupoDeViaje/coordinador/${localStorage.getItem("id")}/grupos`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    if (data.length === 0) {
                        setMensaje('No hay grupos para mostrar.');                       
                        return []; 
                    }
                });
            }
            return response.json();
        })
        .then(data => {
            setGrupos(data);
            setMensaje('Grupos cargados correctamente.');
          
        })
        .catch(error => {
            setError(error.message || 'Ocurrió un error al cargar los grupos.'); 
        })
        .finally(() => setLoading(false));
    }, [baseUrl, setMensaje, setError]);

    useEffect(() => {
        cargarGrupos();
    }, [cargarGrupos]);

    const handleDelete = useCallback((grupoId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
            fetch(`${baseUrl}/GrupoDeViaje/${grupoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error al eliminar el grupo');
                    setSuccess(true);
                    cargarGrupos();
                })
                .catch(error => {
                    console.error('Error:', error);
                    setError('No se pudo eliminar el grupo');
                });
        }
    }, [baseUrl, cargarGrupos, setError]);

    const handleClick = (grupoId) => {
        navigate(`/viajeros/${grupoId}`);
    };
   
    const handleConfirmarGrupo = (grupoId) => {
        fetch(`${baseUrl}/api/GrupoDeViaje/${grupoId}/confirmar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al confirmar el grupo');
                setSuccess(true);
                cargarGrupos();
            })
            .catch(error => {
                console.error('Error:', error);
                setError('No se pudo confirmar el grupo');
            });
    };

    const formatFechaCorta = (fecha) => format(new Date(fecha), 'dd MMM yyyy');
    const isGrupoEnViaje = (fechaInicio) => new Date(fechaInicio) <= new Date();

    return (
    <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          
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
    <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
    >
        <Alert severity="success" sx={{ width: '100%' }}>
            Operación realizada con éxito
        </Alert>
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
        gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
        },
        gap: 3
    }}>
    {grupos.map(grupo => (
        <Paper
        key={grupo.id}
        elevation={3}
        sx={{
            p: 3,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 8
            }
        }}
        >
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        {grupo.nombre}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        <strong>Fechas:</strong><br />
        {formatFechaCorta(grupo.fechaInicio)} - {formatFechaCorta(grupo.fechaFin)}
         </Typography>
         <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            <strong>Destinos:</strong><br />
            {grupo.paises && Array.isArray(grupo.paises) && grupo.paises.length > 0 ? (
                grupo.paises.map((pais, index) => (
                    <Box key={index} sx={{ ml: 1, mb: 1 }}>
                        • {pais.nombre}
                    </Box>
                ))
            ) : (
                <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                    No hay países disponibles.
                </Typography>
            )}
            
            {grupo.ciudades && Array.isArray(grupo.ciudades) && grupo.ciudades.length > 0 ? (
                grupo.ciudades.map((ciudad, cidx) => (
                    <Typography 
                        key={cidx} 
                        variant="body2" 
                        component="div"
                        sx={{ 
                            fontSize: '0.9em',
                            color: 'text.secondary',
                            ml: 2
                        }}
                    >
                        - {ciudad.nombre}
                    </Typography>
                ))
            ) : (
                <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                    No hay ciudades disponibles.
                </Typography>
            )}
</Typography>

    {/* <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            <strong>Destinos:</strong><br />
            {grupo.paises && grupo.paises.map((pais, index) => (
                <Box key={index} sx={{ ml: 1, mb: 1 }}>
                    • {pais.Nombre}
                </Box>
            ))}
            {grupo.ciudades && grupo.ciudades.map((ciudad, cidx) => (
                <Typography 
                    key={cidx} 
                    variant="body2" 
                    component="div"
                    sx={{ 
                        fontSize: '0.9em',
                        color: 'text.secondary',
                        ml: 2
                    }}
                >
                    - {ciudad.Nombre}
                </Typography>
            ))}
</Typography> */}
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
        disabled={isGrupoEnViaje(grupo.fechaInicio)}
        size="small"
        fullWidth
    >
        Confirmar grupo
    </Button>            
</Box> 
</Paper>
))}
</Box>
)}
</Box>
</Container>
);
};

export default MisGrupos;