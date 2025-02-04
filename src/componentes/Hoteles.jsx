import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField, Grid, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Hoteles = () => {
  const navigate = useNavigate(); 
  const [tips, setTips] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [nombre, setNombre] = useState('');
  const [checkIn, setCheckIn] = useState('00:00:00'); 
  const [checkOut, setCheckOut] = useState('00:00:00'); 
  const [paginaWeb, setPaginaWeb] = useState('');
  const [direccion, setDireccion] = useState('');
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [paisId, setPaisId] = useState('');
  const [ciudadId, setCiudadId] = useState('');
  const [hoteles, setHoteles] = useState([]); 
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const cargarPaises = async () => {
        try {
          const response = await fetch(`${baseUrl}/Pais/listado`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

            if (!response.ok) throw new Error('Error al obtener los países');

            const data = await response.json();
            
            const paisesOrdenados = data.sort((a, b) => {
                if (a.nombre < b.nombre) return -1;
                if (a.nombre > b.nombre) return 1;
                return 0;
            });

            setPaises(paisesOrdenados);
        } catch (error) {
            console.error('Error al cargar los países:', error);
        }
    };

    cargarPaises();
  }, [baseUrl, token]);

  const handleCiudadChange = async (codigoIso) => {
    try {
        const response = await fetch(`${baseUrl}/Ciudad/${codigoIso}/ciudades`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error al obtener las ciudades');

        const data = await response.json();
        
        const ciudadesOrdenadas = data.sort((a, b) => {
            if (a.nombre < b.nombre) return -1;
            if (a.nombre > b.nombre) return 1;
            return 0;
        });

        setCiudades(ciudadesOrdenadas);
    } catch (error) {
        console.error('Error al cargar las ciudades:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoHotel = {
      nombre,
      checkIn,
      checkOut,
      paginaWeb,
      direccion,
      paisId,
      ciudadId,
      tips
    };
    try {
      const response = await fetch(`${baseUrl}/Hotel/altaHotel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoHotel),
      });
  
      const data = await response.json(); 
  
      if (!response.ok) {
        throw new Error(data?.mensaje || 'Error al agregar el hotel');
      }
  
      setNombre('');
      setCheckIn('');
      setCheckOut('');
      setPaginaWeb('');
      setDireccion('');
      setPaisId('');
      setCiudadId('');
      setTips('');
      
    } catch (error) {
      console.error('Error en la solicitud:', error.message);
    }

    try {
      const hotelesResponse = await fetch(`${baseUrl}/Hotel/hoteles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    
      if (!hotelesResponse.ok) {
        throw new Error(`Error ${hotelesResponse.status}: ${hotelesResponse.statusText}`);
      }
    
      const hotelesData = await hotelesResponse.json();
      
      setHoteles(Array.isArray(hotelesData) ? hotelesData : []);
      
    } catch (error) {
      console.error('Error en la solicitud de hoteles:', error.message);
    }
  };

  const handleCheckInChange = (e) => {
    let time = e.target.value;
    if (/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(time)) {
      time = `${time}:00`; 
    }
    setCheckIn(time); 
  };

  const handleCheckOutChange = (e) => {
    let time = e.target.value;
    if (/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(time)) {
      time = `${time}:00`;
    }
    setCheckOut(time); 
  };

  const handleFiltroPaisChange = async (e) => {
    setFiltroPais(e.target.value);
    setFiltroCiudad('');
    if (e.target.value) {
      handleCiudadChange(e.target.value);
    }
  };

  const handleFiltroCiudadChange = (e) => {
    setFiltroCiudad(e.target.value);
  };

  const handleFiltroNombreChange = (e) => {
    setFiltroNombre(e.target.value);
  };

  const filteredHoteles = hoteles.filter(hotel => {
    return (
      (filtroPais ? hotel.paisId === filtroPais : true) &&
      (filtroCiudad ? hotel.ciudadId === filtroCiudad : true) &&
      (filtroNombre ? hotel.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) : true)
    );
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          padding: '2rem',
          flexGrow: 1,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          Gestión de Hoteles
        </Typography>

        <Tabs 
          value={tabValue} 
          onChange={(event, newValue) => setTabValue(newValue)} 
          sx={{ 
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              color: 'rgba(25, 118, 210, 0.7)',
              '&.Mui-selected': {
                color: 'primary.main',
              }
            }
          }}
        >
          <Tab label="Buscar Hoteles" />
          <Tab label="Agregar Nuevo Hotel" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            {/* Filtros */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Nombre del Hotel" 
                  variant="outlined" 
                  value={filtroNombre}
                  onChange={handleFiltroNombreChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>País</InputLabel>
                  <Select
                    value={filtroPais}
                    onChange={handleFiltroPaisChange}
                    label="País"
                  >
                    {paises.map((pais) => (
                      <MenuItem key={pais.codigoIso} value={pais.codigoIso}>
                        {pais.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Ciudad</InputLabel>
                  <Select
                    value={filtroCiudad}
                    onChange={handleFiltroCiudadChange}
                    label="Ciudad"
                  >
                    {ciudades.map((ciudad) => (
                      <MenuItem key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Tabla de Hoteles Filtrados */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Check-out</TableCell>
                    <TableCell>Página Web</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>País</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Tips</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHoteles.length > 0 ? (
                    filteredHoteles.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell>{hotel.nombre}</TableCell>
                        <TableCell>{hotel.checkIn}</TableCell>
                        <TableCell>{hotel.checkOut}</TableCell>
                        <TableCell>{hotel.paginaWeb}</TableCell>
                        <TableCell>{hotel.direccion}</TableCell>
                        <TableCell>{hotel.paisNombre}</TableCell>
                        <TableCell>{hotel.ciudadNombre}</TableCell>
                        <TableCell>{hotel.tips}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No se encontraron hoteles.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Nombre del Hotel" 
                    variant="outlined" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Check-in" 
                    variant="outlined" 
                    value={checkIn} 
                    onChange={handleCheckInChange} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Check-out" 
                    variant="outlined" 
                    value={checkOut} 
                    onChange={handleCheckOutChange} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Página Web" 
                    variant="outlined" 
                    value={paginaWeb} 
                    onChange={(e) => setPaginaWeb(e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Dirección" 
                    variant="outlined" 
                    value={direccion} 
                    onChange={(e) => setDireccion(e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>País</InputLabel>
                    <Select
                      value={paisId}
                      onChange={(e) => {
                        setPaisId(e.target.value);
                        handleCiudadChange(e.target.value);
                      }}
                      label="País"
                    >
                      {paises.map((pais) => (
                        <MenuItem key={pais.codigoIso} value={pais.codigoIso}>
                          {pais.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      value={ciudadId}
                      onChange={(e) => setCiudadId(e.target.value)}
                      label="Ciudad"
                    >
                      {ciudades.map((ciudad) => (
                        <MenuItem key={ciudad.id} value={ciudad.id}>
                          {ciudad.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tips"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={tips}
                    onChange={(e) => setTips(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3 }}
                  >
                    Agregar Hotel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
      </Box>
      <Box>
      <Button variant="outlined" 
          onClick={() => navigate('/catalogos')} 
          sx={{ 
          mb: 2, 
          backgroundColor: 'rgb(227, 242, 253)', 
          color: '#1976d2'
    }}
  >
          Volver a Catálogos
        </Button>
      </Box>
    </Box>
  );
};

export default Hoteles;






// import React, { useState, useEffect } from "react";
// import { 
//   Box, 
//   Button, 
//   TextField, 
//   Typography,  
//   Grid, 
//   Paper,
//   Tabs,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from "@mui/material";
// import { useNavigate } from "react-router-dom"; 

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
//   const token = localStorage.getItem('token');
//   const baseUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const cargarPaises = async () => {
//         try {
//           const response = await fetch(`${baseUrl}/Pais/listado`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
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
//       paisId,
//       ciudadId,
//       tips
//     };
//     console.log("Nuevo hotel:", nuevoHotel);
//     console.log("token localStorge:", token);
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
  
//       if (!response.ok) {
//         throw new Error(data?.mensaje || 'Error al agregar el hotel');
//       }
  
//       console.log('Hotel agregado exitosamente:', data);
      
//       setNombre('');
//       setCheckIn('');
//       setCheckOut('');
//       setPaginaWeb('');
//       setDireccion('');
//       setPaisId('');
//       setCiudadId('');
//       setTips('');
      
//     } catch (error) {
//       console.error('Error en la solicitud:', error.message);
//     }

//     try {
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
// };
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
//             {/* Tabla de Hoteles */}
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
//                   {hoteles.length > 0 ? (
//                     hoteles.map((hotel) => (
//                       <TableRow key={hotel.id}>
//                         <TableCell>{hotel.nombre}</TableCell>
//                         <TableCell>{hotel.checkIn}</TableCell>
//                         <TableCell>{hotel.checkOut}</TableCell>
//                         <TableCell>
//                           <a href={hotel.paginaWeb} target="_blank" rel="noopener noreferrer">
//                             {hotel.paginaWeb}
//                           </a>
//                         </TableCell>
//                         <TableCell>{hotel.direccion}</TableCell>
//                         <TableCell>{hotel.paisId}</TableCell>
//                         <TableCell>{hotel.ciudadId}</TableCell>
//                         <TableCell>{hotel.tips}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={7} style={{ textAlign: 'center' }}>
//                         No hay hoteles disponibles.
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
//             {/* Formulario de Carga */}
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Nombre" 
//                     variant="outlined" 
//                     value={nombre}
//                     onChange={(e) => setNombre(e.target.value)}
//                   />
//                 </Grid>
//                 <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Horario Check-in"
//                       value={checkIn} 
//                       onChange={handleCheckInChange}
//                       InputLabelProps={{
//                         shrink: true,
//                       }}
//                       variant="outlined"
//                       inputProps={{
//                         pattern: "([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])", 
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Horario Check-out"
//                       value={checkOut}
//                       onChange={handleCheckOutChange}
//                       InputLabelProps={{
//                         shrink: true,
//                       }}
//                       variant="outlined"
//                       inputProps={{
//                         pattern: "([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])",
//                       }}
//                     />
//                   </Grid>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Página Web" 
//                     type="url" 
//                     value={paginaWeb}
//                     onChange={(e) => setPaginaWeb(e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                 <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel>País</InputLabel>
//                   <Select
//                     value={paisId || ""}  
//                     onChange={(e) => {
//                       const selectedPais = paises.find(p => p.id === e.target.value);  
//                       if (selectedPais) {
//                         setPaisId(selectedPais.id);  
//                         setCiudades([]);  
//                         handleCiudadChange(selectedPais.codigoIso);  
//                       }
//                     }}
//                   >
//                     <MenuItem value="">Seleccione un país</MenuItem>  
//                     {paises.map(p => (
//                       <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>  
//                     ))}
//                   </Select>
//                 </FormControl>
//                 </Grid>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth margin="normal" disabled={ciudades.length === 0}>
//                   <InputLabel>Ciudad</InputLabel>
//                   <Select
//                     value={ciudadId || ""}  
//                     onChange={(e) => setCiudadId(e.target.value)}  
//                   >
//                     <MenuItem value="">Seleccione una ciudad</MenuItem>  
//                     {ciudades.map(c => (
//                       <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem> 
//                     ))}
//                   </Select>
//                 </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                 <FormControl fullWidth margin="normal">
//                   <TextField 
//                     label="Dirección"
//                     variant="outlined"
//                     value={direccion}
//                     onChange={(e) => setDireccion(e.target.value)}
//                     fullWidth
//                   />
//                 </FormControl>
//                 <FormControl fullWidth margin="normal">
//                   <TextField 
//                     label="Tips"
//                     variant="outlined"
//                     value={tips}
//                     onChange={(e) => setTips(e.target.value)}
//                     fullWidth
//                   />
//                 </FormControl>
//                 <FormControl fullWidth margin="normal">
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     type="submit" 
//                     fullWidth
//                   >
//                     Agregar Hotel
//                   </Button>
//                 </FormControl>
//                 </Grid>
//               </Grid>
//             </form>
//           </Box>
//         )}
//       </Box>
//    
//     </Box>
//   );
// };
// export default Hoteles;
