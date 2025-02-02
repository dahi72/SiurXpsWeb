import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography,  
  Grid, 
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 

const Hoteles = () => {
  const navigate = useNavigate(); 
  const [tabValue, setTabValue] = useState(0);
  const [nombre, setNombre] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [direccion, setDireccion] = useState('');
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [paisId, setPaisId] = useState('');
  const [ciudadId, setCiudadId] = useState('');
  const [hoteles, setHoteles] = useState([]); 
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
      paisId ,
      ciudadId
    };
    console.log("Nuevo hotel:", nuevoHotel);
    try {
      const response = await fetch(`${baseUrl}/Hotel/altaHotel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(nuevoHotel),
      });

      if (response.ok) {
        console.log('Hotel agregado exitosamente');
        setNombre('');
        setCheckIn('');
        setCheckOut('');
        setPaginaWeb('');
        setDireccion('');
        setPaisId('');
        setCiudadId('');

        const hotelesResponse = await fetch(`${baseUrl}/Hotel/listado`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        });
        const hotelesData = await hotelesResponse.json();
        setHoteles(hotelesData);
      } else {
        console.error('Error al agregar el hotel');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

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
            {/* Tabla de Hoteles */}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hoteles.length > 0 ? (
                    hoteles.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell>{hotel.nombre}</TableCell>
                        <TableCell>{hotel.checkIn}</TableCell>
                        <TableCell>{hotel.checkOut}</TableCell>
                        <TableCell>
                          <a href={hotel.paginaWeb} target="_blank" rel="noopener noreferrer">
                            {hotel.paginaWeb}
                          </a>
                        </TableCell>
                        <TableCell>{hotel.direccion}</TableCell>
                        <TableCell>{hotel.paisId}</TableCell>
                        <TableCell>{hotel.ciudadId}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                        No hay hoteles disponibles.
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
            {/* Formulario de Carga */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Nombre" 
                    variant="outlined" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Horario Check-in" 
                    type="time" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Horario Check-out" 
                    type="time" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Página Web" 
                    type="url" 
                    value={paginaWeb}
                    onChange={(e) => setPaginaWeb(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>País</InputLabel>
                  <Select
                    value={paisId?.id || ""}  // El value es solo el id del país
                    onChange={(e) => {
                      const selectedPais = paises.find(p => p.id === e.target.value);  // Buscamos el país completo por id
                      if (selectedPais) {
                        setPaisId(selectedPais);  // Guardamos el país completo en el estado
                        setCiudades([]);  // Limpiamos las ciudades al cambiar de país
                        handleCiudadChange(selectedPais.codigoIso);  // Usamos codigoIso para cargar las ciudades
                      }
                    }}
                  >
                    <MenuItem value="">Seleccione un país</MenuItem>  {/* Opción por defecto */}
                    {paises.map(p => (
                      <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>  // El value de cada opción es el id del país
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" disabled={ciudades.length === 0}>
                  <InputLabel>Ciudad</InputLabel>
                  <Select
                    value={ciudadId || ""}  // El valor es el id de la ciudad
                    onChange={(e) => setCiudadId(e.target.value)}  // Actualiza el estado con el id de la ciudad
                  >
                    <MenuItem value="">Seleccione una ciudad</MenuItem>  {/* Opción por defecto */}
                    {ciudades.map(c => (
                      <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>  // El value de cada opción es el id de la ciudad
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <TextField 
                    label="Dirección"
                    variant="outlined"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    fullWidth
                  >
                    Agregar Hotel
                  </Button>
                </FormControl>
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
//   TableRow
// } from "@mui/material";
// import { useNavigate } from "react-router-dom"; 

// const Hoteles = () => {
//   const navigate = useNavigate(); 
//   const [tabValue, setTabValue] = useState(0);
//   const [nombre, setNombre] = useState('');
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
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
//             const response = await fetch(`${baseUrl}/Pais/listado`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

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
// }, [baseUrl, token]);
  
//   useEffect(() => {
//     const cargarHoteles = async (nuevoHotel) => {
//       try {
//         const response = await fetch(`${baseUrl}/Hotel/altaHotel`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         },
//           body: JSON.stringify(nuevoHotel),
//         });
    
//         if (response.ok) {
//           console.log('Hotel agregado exitosamente');
//           setNombre('');
//           setCheckIn('');
//           setCheckOut('');
//           setPaginaWeb('');
//           setDireccion('');
//           setPaisId('');
//           setCiudadId('');
//         } else {
//           console.error('Error al agregar el hotel');
//         }
//       } catch (error) {
//         console.error('Error de red:', error);
//       };
//     }
//     cargarHoteles();
//   }, [baseUrl, token]);
  
    
//   const handleCiudadChange = async (codigoIso) => {
//     try {
//             const response = await fetch(`${baseUrl}/Ciudad/${codigoIso}/ciudades`, {
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
// };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const nuevoHotel = {
//       nombre,
//       checkIn,
//       checkOut,
//       paginaWeb,
//       direccion,
//       paisId,
//       ciudadId
//     };

//     try {
//       const response = await fetch(`${baseUrl}/Hotel/altaHotel`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//       },
//         body: JSON.stringify(nuevoHotel),
//       });

//       if (response.ok) {
//         console.log('Hotel agregado exitosamente');
//         setNombre('');
//         setCheckIn('');
//         setCheckOut('');
//         setPaginaWeb('');
//         setDireccion('');
//         setPaisId('');
//         setCiudadId('');

//     const hotelesResponse = await fetch(`${baseUrl}/Hotel/listado`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//     });
//     const hotelesData = await hotelesResponse.json();
//     setHoteles(hotelesData);
//     } else {
//       console.error('Error al agregar el hotel');
//     }
//     } catch (error) {
//       console.error('Error de red:', error);
//     }
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
//                         <TableCell>{hotel.pais}</TableCell>
//                         <TableCell>{hotel.ciudad}</TableCell>
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
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Horario Check-in" 
//                     type="time" 
//                     value={checkIn}
//                     onChange={(e) => setCheckIn(e.target.value)}
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     variant="outlined"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Horario Check-out" 
//                     type="time" 
//                     value={checkOut}
//                     onChange={(e) => setCheckOut(e.target.value)}
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     variant="outlined"
//                   />
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
//                   <TextField 
//                     fullWidth 
//                     label="País" 
//                     variant="outlined" 
//                     select
//                     value={paisId}
//                     onChange={(e) => {
//                       const selectedPais = JSON.parse(e.target.value);
//                       setPaisId(selectedPais.id);
//                       setCiudades([]);
//                       handleCiudadChange(selectedPais.codigoIso); 
//                     }}
//                     SelectProps={{
//                       native: true,
//                     }}
//                   >
//                     <option value="">Seleccione un país</option>
//                     {paises.map(p => (
//                       <option key={p.id} value={JSON.stringify(p)}>{p.nombre}</option>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField 
//                     fullWidth 
//                     label="Ciudad" 
//                     variant="outlined" 
//                     select
//                     value={ciudadId}
//                     onChange={(e) => setCiudadId(e.target.value)}
//                     SelectProps={{
//                       native: true,
//                     }}
//                   >
//                     <option value="">Seleccione una ciudad</option>
//                     {ciudades.map(c => (
//                       <option key={c.id} value={c.id}>{c.nombre}</option>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField 
//                     fullWidth 
//                     label="Dirección" 
//                     variant="outlined" 
//                     value={direccion}
//                     onChange={(e) => setDireccion(e.target.value)}
//                   />
//                 </Grid>
//               </Grid>
//               <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
//                 <Button variant="contained" color="primary" type="submit">
//                   Agregar Hotel
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         )}
//       </Box>
//       <Box>
//         <Button variant="outlined" 
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