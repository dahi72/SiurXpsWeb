import { useState, useEffect } from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid } from "@mui/material";
import axios from "axios";
import { Box } from "lucide-react";

const baseUrl = process.env.REACT_APP_API_URL; 
const token = localStorage.getItem("token"); 

const AltaTraslado = () => {



  const [formData, setFormData] = useState({
    lugarDeEncuentro: "",
    horario: "",
    tipoDeTraslado: "",
    paisId: "",
    ciudadId: ""
  });
  
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/Pais/listado`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
      const paisesOrdenados = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setPaises(paisesOrdenados);
    });
  }, []);

  
    
  useEffect(() => {
    if (formData.paisId) {
      const paisSeleccionado = paises.find(p => p.id === formData.paisId);
      if (paisSeleccionado) {
        axios.get(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
          setCiudades(response.data);
        });
      }
    }
  }, [formData.paisId, paises]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}/Traslado/altaTraslado`, formData, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => alert("Traslado creado con éxito"))
      .catch(error => alert("Error al crear traslado"));
  };

    return (
<Box sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", padding: 3, borderRadius: 2 }}>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Lugar de Encuentro" name="lugarDeEncuentro" value={formData.lugarDeEncuentro} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Horario" name="horario" type="time" value={formData.horario} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Tipo de Traslado" name="tipoDeTraslado" type="number" value={formData.tipoDeTraslado} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>País</InputLabel>
            <Select name="paisId" value={formData.paisId} onChange={handleChange} required>
              {paises.map(pais => (
                <MenuItem key={pais.id} value={pais.id}>{pais.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Ciudad</InputLabel>
            <Select name="ciudadId" value={formData.ciudadId} onChange={handleChange} required>
              {ciudades.map(ciudad => (
                <MenuItem key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Crear Traslado</Button>
        </Grid>
      </Grid>
            </form>
</Box>
  );
};

export default AltaTraslado;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Container, TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Typography } from '@mui/material';

// function AgregarTraslado() {
//     const { itinerarioId } = useParams();
//     const navigate = useNavigate();
    
//     const [traslado, setTraslado] = useState({
//         nombre: '',
//         lugarDeEncuentro: '',
//         horario: '',
//         tips: '',
//         paisId: '',
//         ciudadId: '',
//         tipoTraslado: ''
//     });

//     const [paises, setPaises] = useState([]);
//     const [ciudades, setCiudades] = useState([]);
//     const baseUrl = process.env.REACT_APP_API_URL;

//     useEffect(() => {
//         const cargarPaises = async () => {
//             try {
//                 const response = await fetch(`${baseUrl}/Pais/listado`);
//                 const data = await response.json();
//                 const paisesOrdenados = data.sort((a, b) => a.nombre.localeCompare(b.nombre));  
//                 setPaises(paisesOrdenados);
//             } catch (error) {
//                 console.error('Error al cargar los países:', error);
//             }
//         };
    
//         cargarPaises();
//     }, [baseUrl]);
    
   
//     useEffect(() => {
//         const cargarCiudades = async () => {
//             if (traslado.paisId) {
             
//                 const paisSeleccionado = paises.find(pais => pais.id === traslado.paisId);
    
//                 if (paisSeleccionado) {
//                     try {
//                         const response = await fetch(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`);
//                         const data = await response.json();
//                         const ciudadesOrdenadas = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
//                         setCiudades(ciudadesOrdenadas);
//                     } catch (error) {
//                         console.error('Error al cargar las ciudades:', error);
//                     }
//                 }
//             }
//         };
    
//         cargarCiudades();
//     }, [traslado.paisId, paises, baseUrl]); 

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setTraslado({ ...traslado, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`${baseUrl}/Traslado/altaTraslado`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(traslado),
//             });
//             if (response.ok) {
//                 navigate(`/crear-evento/${itinerarioId}`);
//             } else {
//                 console.error('Error al crear el traslado');
//             }
//         } catch (error) {
//             console.error('Error de red:', error);
//         }
//     };

//     return (
//         <Container maxWidth="md">
//             <Typography variant="h4" gutterBottom align="center">
//                 Crear Traslado
//             </Typography>
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Nombre del traslado"
//                             name="nombre"
//                             value={traslado.nombre}
//                             onChange={handleChange}
//                             required
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Lugar de encuentro"
//                             name="lugarDeEncuentro"
//                             value={traslado.lugarDeEncuentro}
//                             onChange={handleChange}
//                             required
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Horario"
//                             type="datetime-local"
//                             name="horario"
//                             value={traslado.horario}
//                             onChange={handleChange}
//                             required
//                             InputLabelProps={{
//                                 shrink: true,
//                             }}
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Tips (Opcional)"
//                             name="tips"
//                             value={traslado.tips}
//                             onChange={handleChange}
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth required>
//                             <InputLabel>País</InputLabel>
//                             <Select
//                                 name="paisId"
//                                 value={traslado.paisId}
//                                 onChange={handleChange}
//                             >
//                                 <MenuItem value="">
//                                     <em>Seleccionar país</em>
//                                 </MenuItem>
//                                 {paises.map((pais) => (
//                                     <MenuItem key={pais.id} value={pais.id}>
//                                         {pais.nombre}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth required>
//                             <InputLabel>Ciudad</InputLabel>
//                             <Select
//                                 name="ciudadId"
//                                 value={traslado.ciudadId}
//                                 onChange={handleChange}
//                                 disabled={!traslado.paisId}
//                             >
//                                 <MenuItem value="">
//                                     <em>Seleccionar ciudad</em>
//                                 </MenuItem>
//                                 {ciudades.map((ciudad) => (
//                                     <MenuItem key={ciudad.id} value={ciudad.id}>
//                                         {ciudad.nombre}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth required>
//                             <InputLabel>Tipo de Traslado</InputLabel>
//                             <Select
//                                 name="tipoTraslado"
//                                 value={traslado.tipoTraslado}
//                                 onChange={handleChange}
//                             >
//                                 <MenuItem value="">
//                                     <em>Seleccionar tipo de traslado</em>
//                                 </MenuItem>
//                                 <MenuItem value="1">TransferIn</MenuItem>
//                                 <MenuItem value="2">TransferOut</MenuItem>
//                                 <MenuItem value="3">Tren</MenuItem>
//                                 <MenuItem value="4">TransferInterHotel</MenuItem>
//                                 <MenuItem value="5">Bus</MenuItem>
//                                 <MenuItem value="6">Ferry</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={12}>
//                         <Button fullWidth variant="contained" color="primary" type="submit">
//                             Crear Traslado
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </form>
//         </Container>
//     );
// }

// export default AgregarTraslado;
