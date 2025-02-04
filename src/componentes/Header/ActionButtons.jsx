import { AccountCircle } from "@mui/icons-material";
import { Badge, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../hooks/UsuarioContext";
import { useSnackbar } from "../../hooks/useSnackbar";

const baseUrl = process.env.REACT_APP_API_URL;

export const ActionButtons = () => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState(null);
    const { usuario, setUsuario } = useUsuario();


    const nombreUsuario = usuario
    ? `${usuario.primerNombre} ${usuario.primerApellido}`
        : "";
    
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const [estadoCoordinador, setEstadoCoordinador] = useState();

    useEffect(() => {
       
        if (!usuario) return;
        setEstadoCoordinador(usuario.estado)
    }, [usuario, estadoCoordinador]);

    const menuItems = [
        { label: 'Mis datos', action: '/verMisDatos' },
        { label: 'Cambiar contraseña', action: '/cambiar-contrasena' },
        { label: 'Registrar coordinador', action: '/registro', rolesPermitidos: ['Coordinador'] }
    ];

    const getEstadoColor = () => {
        return estadoCoordinador ? '#4CAF50' : '#f44336';
    };

    const toggleEstado = async () => {
        try {
            const nuevoEstado = !estadoCoordinador;
            
            const response = await fetch(`${baseUrl}/Usuario/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    estado: nuevoEstado 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el estado');
            }

            setEstadoCoordinador(nuevoEstado);
            setUsuario(usu => ({ ...usu, estado: nuevoEstado}))
            setSnackbarMessage('Estado actualizado correctamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            handleMenuClose();
            setTimeout(() => {
                setOpenSnackbar(false);
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage(error.message || 'Error al actualizar el estado');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setTimeout(() => {
                setOpenSnackbar(false);
            }, 3000);
        }
    };

    // Filtrar los elementos del menú según el rol del usuario
    const filteredMenuItems = menuItems.filter(item => {
        if (!item.rolesPermitidos) return true; // Si no hay roles definidos, incluir el ítem
        return item.rolesPermitidos.includes(usuario.rol); // Verificar si el rol del usuario está permitido
    });

    return (
        <>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" gap={2} >
                <Typography>{nombreUsuario}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge
                        overlap="circular"
                        variant="dot"
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: getEstadoColor(),
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                            }
                        }}
                    />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                        {estadoCoordinador ? 'Activo' : 'Inactivo'}
                    </Typography>
                </Box>
            </Box>
                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    onClick={handleMenuOpen}
                >
                    <AccountCircle />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem sx={{ pointerEvents: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Badge
                                overlap="circular"
                                variant="dot"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: getEstadoColor(),
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                    }
                                }}
                            />
                            <Typography>
                                Estado: {estadoCoordinador ? 'Activo' : 'Inactivo'}
                            </Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem onClick={toggleEstado}>
                        Cambiar a {estadoCoordinador ? 'Inactivo' : 'Activo'}
                    </MenuItem>
<<<<<<< HEAD
                    {menuItems.map((item, index) => (
                        <MenuItem key={index} onClick={() => { handleMenuClose(); navigate(item.action); }}>
                            {item.label}
                        </MenuItem>
                    ))}
                    <MenuItem onClick={() => { handleMenuClose(); navigate("/dashboard"); }}>
                        Dashboard
                    </MenuItem>
=======
                    {filteredMenuItems.map((item, index) => (
                    <MenuItem key={index} onClick={() => { handleMenuClose(); navigate(item.action); }}>
                        {item.label}
                    </MenuItem>
                ))}
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
                </Menu>
    </>);
}