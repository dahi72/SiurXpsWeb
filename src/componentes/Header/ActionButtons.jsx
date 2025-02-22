import { AccountCircle } from "@mui/icons-material";
import { Badge, Box, IconButton, Menu, MenuItem, Typography, CircularProgress } from "@mui/material";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../hooks/UsuarioContext";
import { useSnackbar } from "../../hooks/useSnackbar";
import Logout from "../Logout"; // Importa el componente Logout

const baseUrl = process.env.REACT_APP_API_URL;

export const ActionButtons = () => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState(null);
    const { usuario, setUsuario, loading: usuarioLoading } = useUsuario(); // Usamos el estado loading del contexto
    const [estadoCoordinador, setEstadoCoordinador] = useState(usuario?.estado);
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga del estado

    const nombreUsuario = usuario
        ? `${usuario.primerNombre} ${usuario.primerApellido}`
        : "";
        useEffect(() => {
            if (usuario && !usuarioLoading) {
                navigate("/dashboard");
            }
        }, [usuario, usuarioLoading, navigate]);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const getEstadoColor = () => {
        return estadoCoordinador ? '#4CAF50' : '#f44336';
    };

    const toggleEstado = async () => {
        setIsLoading(true); // Activar el estado de carga
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
            setUsuario(usu => ({ ...usu, estado: nuevoEstado }));
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
        } finally {
            setIsLoading(false); // Desactivar el estado de carga
        }
    };

    const menuItems = [
        { label: 'Mis datos', action: '/verMisDatos' },
        { label: 'Cambiar contraseña', action: '/cambiar-contrasena' },
        { label: 'Ir al Dashboard', action: '/dashboard' },
        { label: 'Registrar coordinador', action: '/registro', rolesPermitidos: ['Coordinador'] }
    ];

    const filteredMenuItems = menuItems.filter(item => {
        if (!item.rolesPermitidos) return true;
        return item.rolesPermitidos.includes(usuario?.rol);
    });

    return (
        <>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" gap={2}>
                {/* Mostrar un spinner si el usuario está cargando */}
                {usuarioLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} /> {/* Spinner de carga */}
                        <Typography variant="body1" sx={{ color: 'white' }}>
                            Cargando...
                        </Typography>
                    </Box>
                ) : (
                    <Typography sx={{ color: 'white' }}>{nombreUsuario}</Typography>
                )}
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
                <MenuItem onClick={toggleEstado} disabled={isLoading}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} /> {/* Spinner de carga */}
                            <Typography>Cargando...</Typography>
                        </Box>
                    ) : (
                        `Cambiar a ${estadoCoordinador ? 'Inactivo' : 'Activo'}`
                    )}
                </MenuItem>
                {filteredMenuItems.map((item, index) => (
                    <MenuItem key={index} onClick={() => { handleMenuClose(); navigate(item.action); }}>
                        {item.label}
                    </MenuItem>
                ))}
                {/* Integración de Logout */}
                <Logout onLogout={handleMenuClose} />
            </Menu>
        </>
    );
};
