import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Navigate } from "react-router-dom";

const Hoteles = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [hoteles, setHoteles] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [hotelActual, setHotelActual] = useState(null);
  const token = localStorage.getItem("token");
  const [nuevoHotel, setNuevoHotel] = useState({
    nombre: "",
    direccion: "",
    paisId: "",
    ciudadId: "",
    checkIn: "",
    checkOut: "",
    paginaWeb: "",
    tips: "",
  });
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const baseUrl = process.env.REACT_APP_API_URL;

  const setAuthHeaders = useCallback(
    (headers = {}) => {
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return headers;
    },
    [token]
  );

  const obtenerHoteles = useCallback(async () => {
    const response = await fetch(`${baseUrl}/Hotel/altaHotel`, {
      headers: setAuthHeaders(),
    });
    const data = await response.json();
    setHoteles(data);
  }, [baseUrl, setAuthHeaders]);

  const obtenerPaises = useCallback(async () => {
    const response = await fetch(`${baseUrl}/Pais/listado`, {
      headers: setAuthHeaders(),
    });
    const data = await response.json();
    data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
    setPaises(data);
  }, [baseUrl, setAuthHeaders]);

  useEffect(() => {
    obtenerHoteles();
    obtenerPaises();
  }, [obtenerHoteles, obtenerPaises]);

  const obtenerCiudades = async (paisIso) => {
    const response = await fetch(`${baseUrl}/Ciudad/${paisIso}/ciudades`, {
      headers: setAuthHeaders(),
    });
    const data = await response.json();
    data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
    setCiudades(data);
  };

  const handleEditar = (hotel) => {
    setHotelActual(hotel);
    setOpen(true);
  };

  const handleEliminar = async (id) => {
    await fetch(`${baseUrl}/Hotel/${id}`, {
      method: "DELETE",
      headers: setAuthHeaders(),
    });
    obtenerHoteles();
  };

  const handleGuardar = async () => {
    const headers = setAuthHeaders({ "Content-Type": "application/json" });
    if (hotelActual) {
      await fetch(`${baseUrl}/Hotel/${hotelActual.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(hotelActual),
      });
    } else {
      await fetch(`${baseUrl}/Hotel`, {
        method: "POST",
        headers,
        body: JSON.stringify(nuevoHotel),
      });
    }
    setOpen(false);
    obtenerHoteles();
  };

  return (
    <Box sx={{ width: "80%", margin: "auto", mt: 4 }}>
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="Lista de Hoteles" />
        <Tab label="Agregar Hotel" />
      </Tabs>

      {tabIndex === 0 && (
        <>
          <TextField
            fullWidth
            label="Filtrar por nombre"
            variant="outlined"
            margin="normal"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hoteles
                  .filter((h) =>
                    h.nombre.toLowerCase().includes(filtro.toLowerCase())
                  )
                  .map((hotel) => (
                    <TableRow key={hotel.id}>
                      <TableCell>{hotel.nombre}</TableCell>
                      <TableCell>{hotel.direccion}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditar(hotel)}>
                          Editar
                        </Button>
                        <Button onClick={() => handleEliminar(hotel.id)}>
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tabIndex === 1 && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            value={nuevoHotel.nombre}
            onChange={(e) =>
              setNuevoHotel({ ...nuevoHotel, nombre: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Dirección"
            value={nuevoHotel.direccion}
            onChange={(e) =>
              setNuevoHotel({ ...nuevoHotel, direccion: e.target.value })
            }
            margin="normal"
          />
          <Select
            fullWidth
            value={nuevoHotel.paisId}
            onChange={(e) => {
              setNuevoHotel({
                ...nuevoHotel,
                paisId: e.target.value,
                ciudadId: "",
              });
              obtenerCiudades(e.target.value);
            }}
            margin="normal"
          >
            {paises.map((pais) => (
              <MenuItem key={pais.codigoIso} value={pais.codigoIso}>
                {pais.nombre}
              </MenuItem>
            ))}
          </Select>
          <Select
            fullWidth
            value={nuevoHotel.ciudadId}
            onChange={(e) =>
              setNuevoHotel({ ...nuevoHotel, ciudadId: e.target.value })
            }
            margin="normal"
          >
            {ciudades.map((ciudad) => (
              <MenuItem key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Check-In"
            type="time"
            value={nuevoHotel.checkIn}
            onChange={(e) =>
              setNuevoHotel({ ...nuevoHotel, checkIn: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Check-Out"
            type="time"
            value={nuevoHotel.checkOut}
            onChange={(e) =>
              setNuevoHotel({ ...nuevoHotel, checkOut: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Página Web"
            value={nuevoHotel.paginaWeb}
            onChange={(e) =>
              setNuevoHotel({ ...nuevoHotel, paginaWeb: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Tips"
            value={nuevoHotel.tips}
            onChange={(e) =>
              setNuevoHotel({ ...nuevoHotel, tips: e.target.value })
            }
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleGuardar}
            sx={{ mt: 2 }}
          >
            Guardar
          </Button>
          <Button
            variant="outlined"
            onClick={() => Navigate("/catalogos")}
            sx={{
              mt: 2,
              backgroundColor: "rgb(227, 242, 253)",
              color: "#1976d2",
            }}
          >
            Volver a Catálogos
          </Button>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Editar Hotel</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre"
            value={hotelActual?.nombre || ""}
            onChange={(e) =>
              setHotelActual({ ...hotelActual, nombre: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Dirección"
            value={hotelActual?.direccion || ""}
            onChange={(e) =>
              setHotelActual({ ...hotelActual, direccion: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Hoteles;



// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField, Grid, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const Hoteles = () => {
//   const navigate = useNavigate(); 
//   const [tips, setTips] = useState('');
//   const [tabValue, setTabValue] = useState(0);
//   const [nombre, setNombre] = useState('');
//   const [checkIn, setCheckIn] = useState('00:00:00'); 
//   const [checkOut, setCheckOut] = useState('00:00:00'); 
//   const [paginaWeb, setPaginaWeb] = useState('');
//   const [direccion, setDireccion] = useState('');
//   const [paises, setPaises] = useState([]);
//   const [ciudades, setCiudades] = useState([]);
//   const [paisId, setPaisId] = useState('');
//   const [ciudadId, setCiudadId] = useState('');
//   const [hoteles, setHoteles] = useState([]); 
//   const [filtroPais, setFiltroPais] = useState('');
//   const [filtroCiudad, setFiltroCiudad] = useState('');
//   const [filtroNombre, setFiltroNombre] = useState('');
//   const token = localStorage.getItem('token');
//   

//   const isFormComplete = () => {
//     return (
//       nombre &&
//       checkIn !== '00:00:00' &&
//       checkOut !== '00:00:00' &&
//       paginaWeb &&
//       direccion &&
//       paisId.id &&
//       ciudadId
//     );
//   };


//   useEffect(() => {
//     const cargarPaises = async () => {
//         try {
//           const response = await fetch(`${baseUrl}/Pais/listado`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//             }
//         });

//             if (!response.ok) throw new Error('Error al obtener los países');

//             const data = await response.json();
            
//             const paisesOrdenados = data.sort((a, b) => {
//                 if (a.nombre < b.nombre) return -1;
//                 if (a.nombre > b.nombre) return 1;
//                 return 0;
//             });

//             setPaises(paisesOrdenados);
//         } catch (error) {
//             console.error('Error al cargar los países:', error);
//         }
//     };

//     cargarPaises();
//   }, [baseUrl, token]);

//   const handleCiudadChange = async (codigoIso) => {
//     try {
//         const response = await fetch(`${baseUrl}/Ciudad/${codigoIso}/ciudades`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) throw new Error('Error al obtener las ciudades');

//         const data = await response.json();
        
//         const ciudadesOrdenadas = data.sort((a, b) => {
//             if (a.nombre < b.nombre) return -1;
//             if (a.nombre > b.nombre) return 1;
//             return 0;
//         });

//         setCiudades(ciudadesOrdenadas);
//     } catch (error) {
//         console.error('Error al cargar las ciudades:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const nuevoHotel = {
//       nombre,
//       checkIn,
//       checkOut,
//       paginaWeb,
//       direccion,
//       paisId : paisId.id,
//       ciudadId,
//       tips
//     };

//     try {
//       const response = await fetch(`${baseUrl}/Hotel/altaHotel`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(nuevoHotel),
//       });
  
//       const data = await response.json(); 
//       console.log('Respuesta del servidor:', data);
//       if (!response.ok) {
//         throw new Error(data?.mensaje || 'Error al agregar el hotel');
//       }
  
//       setNombre('');
//       setCheckIn('');
//       setCheckOut('');
//       setPaginaWeb('');
//       setDireccion('');
//       setPaisId('');
//       setCiudadId('');
//       setTips('');
      
//       const hotelesResponse = await fetch(`${baseUrl}/Hotel/hoteles`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
    
//       if (!hotelesResponse.ok) {
//         throw new Error(`Error ${hotelesResponse.status}: ${hotelesResponse.statusText}`);
//       }
    
//       const hotelesData = await hotelesResponse.json();
      
//       setHoteles(Array.isArray(hotelesData) ? hotelesData : []);
      
//     } catch (error) {
//       console.error('Error en la solicitud de hoteles:', error.message);
//     }
//   };

//   const handleCheckInChange = (e) => {
//     let time = e.target.value;
//     if (/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(time)) {
//       time = `${time}:00`; 
//     }
//     setCheckIn(time); 
//   };

//   const handleCheckOutChange = (e) => {
//     let time = e.target.value;
//     if (/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(time)) {
//       time = `${time}:00`;
//     }
//     setCheckOut(time); 
//   };

//   const handleFiltroPaisChange = async (e) => {
//     setFiltroPais(e.target.value);
//     setFiltroCiudad('');
//     if (e.target.value) {
//       handleCiudadChange(e.target.value);
//     }
//   };

//   const handleFiltroCiudadChange = (e) => {
//     setFiltroCiudad(e.target.value);
//   };

//   const handleFiltroNombreChange = (e) => {
//     setFiltroNombre(e.target.value);
//   };

//   const filteredHoteles = hoteles.filter(hotel => {
//     return (
//       (filtroPais ? hotel.paisId === filtroPais : true) &&
//       (filtroCiudad ? hotel.ciudadId === filtroCiudad : true) &&
//       (filtroNombre ? hotel.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) : true)
//     );
//   });

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         padding: '2rem'
//       }}
//     >
//       <Box
//         sx={{
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           borderRadius: '10px',
//           padding: '2rem',
//           flexGrow: 1,
//           textAlign: 'center'
//         }}
//       >
//         <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
//           Gestión de Hoteles
//         </Typography>

//         <Tabs 
//           value={tabValue} 
//           onChange={(event, newValue) => setTabValue(newValue)} 
//           sx={{ 
//             mb: 3,
//             '& .MuiTab-root': {
//               fontWeight: 'bold',
//               color: 'rgba(25, 118, 210, 0.7)',
//               '&.Mui-selected': {
//                 color: 'primary.main',
//               }
//             }
//           }}
//         >
//           <Tab label="Buscar Hoteles" />
//           <Tab label="Agregar Nuevo Hotel" />
//         </Tabs>

//         {tabValue === 0 && (
//           <Box>
//             {/* Filtros */}
//             <Grid container spacing={2} sx={{ mb: 3 }}>
//               <Grid item xs={12} sm={4}>
//                 <TextField 
//                   fullWidth 
//                   label="Nombre del Hotel" 
//                   variant="outlined" 
//                   value={filtroNombre}
//                   onChange={handleFiltroNombreChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel>País</InputLabel>
//                   <Select
//                     value={filtroPais}
//                     onChange={handleFiltroPaisChange}
//                     label="País"
//                   >
//                     {paises.map((pais) => (
//                       <MenuItem key={pais.codigoIso} value={pais.codigoIso}>
//                         {pais.nombre}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel>Ciudad</InputLabel>
//                   <Select
//                     value={filtroCiudad}
//                     onChange={handleFiltroCiudadChange}
//                     label="Ciudad"
//                   >
//                     {ciudades.map((ciudad) => (
//                       <MenuItem key={ciudad.id} value={ciudad.id}>
//                         {ciudad.nombre}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>

//             {/* Tabla de Hoteles Filtrados */}
//             <TableContainer component={Paper} sx={{ mb: 3 }}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Nombre</TableCell>
//                     <TableCell>Check-in</TableCell>
//                     <TableCell>Check-out</TableCell>
//                     <TableCell>Página Web</TableCell>
//                     <TableCell>Dirección</TableCell>
//                     <TableCell>País</TableCell>
//                     <TableCell>Ciudad</TableCell>
//                     <TableCell>Tips</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredHoteles.length > 0 ? (
//                     filteredHoteles.map((hotel) => (
//                       <TableRow key={hotel.id}>
//                         <TableCell>{hotel.nombre}</TableCell>
//                         <TableCell>{hotel.checkIn}</TableCell>
//                         <TableCell>{hotel.checkOut}</TableCell>
//                         <TableCell>{hotel.paginaWeb}</TableCell>
//                         <TableCell>{hotel.direccion}</TableCell>
//                         <TableCell>{hotel.paisNombre}</TableCell>
//                         <TableCell>{hotel.ciudadNombre}</TableCell>
//                         <TableCell>{hotel.tips}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={8} align="center">
//                         No se encontraron hoteles.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         )}

//         {tabValue === 1 && (
//           <Box>
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Nombre del Hotel" 
//                     variant="outlined" 
//                     value={nombre} 
//                     onChange={(e) => setNombre(e.target.value)} 
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Check-in" 
//                     variant="outlined" 
//                     value={checkIn} 
//                     onChange={handleCheckInChange} 
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Check-out" 
//                     variant="outlined" 
//                     value={checkOut} 
//                     onChange={handleCheckOutChange} 
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Página Web" 
//                     variant="outlined" 
//                     value={paginaWeb} 
//                     onChange={(e) => setPaginaWeb(e.target.value)} 
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Dirección" 
//                     variant="outlined" 
//                     value={direccion} 
//                     onChange={(e) => setDireccion(e.target.value)} 
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel>País</InputLabel>
//                     <Select
//                       value={paisId ? paisId.id : ''}
//                       onChange={(e) => {
//                         const selectedPais = paises.find(pais => pais.id === e.target.value);
//                         if (selectedPais) {
//                           setPaisId(selectedPais);
//                           setCiudades([]);  
//                           handleCiudadChange(selectedPais.codigoIso); 
//                         }
//                       }}
//                       label="País"
//                     >
//                       {paises.map((pais) => (
//                         <MenuItem key={pais.id} value={pais.id}>
//                           {pais.nombre}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel>Ciudad</InputLabel>
//                     <Select
//                       value={ciudadId}
//                       onChange={(e) => setCiudadId(e.target.value)}
//                       label="Ciudad"
//                     >
//                       {ciudades.map((ciudad) => (
//                         <MenuItem key={ciudad.id} value={ciudad.id}>
//                           {ciudad.nombre}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Tips"
//                     variant="outlined"
//                     multiline
//                     rows={4}
//                     value={tips}
//                     onChange={(e) => setTips(e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Button 
//                     type="submit" 
//                     variant="contained" 
//                     color="primary" 
//                     fullWidth 
//                     sx={{ mt: 3 }}
//                     disabled={!isFormComplete()}
//                   >
//                     Agregar Hotel
//                   </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           </Box>
//         )}
//       </Box>
//       <Box>
//       <Button variant="outlined" 
//           onClick={() => navigate('/catalogos')} 
//           sx={{ 
//           mb: 2, 
//           backgroundColor: 'rgb(227, 242, 253)', 
//           color: '#1976d2'
//     }}
//   >
//           Volver a Catálogos
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Hoteles;

