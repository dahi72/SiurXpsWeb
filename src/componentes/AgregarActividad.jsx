import { useState, useEffect } from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Button, Grid } from "@mui/material";
import axios from "axios";


const baseUrl = process.env.REACT_APP_API_URL; 
const token = localStorage.getItem("token"); 

const AltaActividad = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    duracion: "",
    opcional: false,
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
    console.log("formData", formData)
    
    const handleSubmit = (e) => {
        e.preventDefault();
      
        axios.post(`${baseUrl}/Actividad/altaActividad`, JSON.stringify(formData), { 
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        })
        .then(response => alert("Actividad creada con éxito"))
        .catch(error => {
          console.error("Error al crear actividad:", error.response?.data || error.message);
        });
      };
      
    return (
<form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px" }}>
    <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Duración (minutos)" name="duracion" type="number" value={formData.duracion} onChange={handleChange} required />
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
          <FormControlLabel control={<Checkbox name="opcional" checked={formData.opcional} onChange={handleChange} />} label="Opcional" />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Crear Actividad</Button>
        </Grid>
      </Grid>
            </form>

  );
};

export default AltaActividad;


// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Box, Typography, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, CircularProgress, Grid } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';

// function AgregarActividad() {
//     const [actividad, setActividad] = useState({
//         nombre: '',
//         descripcion: '',
//         ubicacion: '',
//         duracion: 0,
//         opcional: false,
//         pais: '',
//         ciudad: '',
//         tips: ''
//     });
//     const [paises, setPaises] = useState([]);
//     const [ciudades, setCiudades] = useState([]);
//     const [loadingPaises, setLoadingPaises] = useState(true);
//     const [loadingCiudades, setLoadingCiudades] = useState(false);
//     const { itinerarioId } = useParams();
//     const baseUrl = process.env.REACT_APP_API_URL;
//     const navigate = useNavigate();
//     const [paisId, setPaisId] = useState(""); 
//     const [setPaisCodigoIso] = useState("");


//     useEffect(() => {
//         const fetchPaises = async () => {
//             try {
//                 const response = await fetch(`${baseUrl}/Pais/listado`);
//                 const data = await response.json();
//                 const sortedPaises = data.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar países alfabéticamente
//                 setPaises(sortedPaises);
//                 setLoadingPaises(false);
//             } catch (error) {
//                 console.error('Error al obtener los países:', error);
//             }
//         };
//         fetchPaises();
//     }, [baseUrl]);

//     const handlePaisChange = async (e) => {
//         const selectedPaisId = e.target.value; // Pais id para la actividad
//         const selectedPaisCodigoIso = e.target.selectedOptions[0].getAttribute("data-codigoIso"); // Pais codigoIso para ciudades
        
//         // Actualizamos el estado con los valores correspondientes
//         setPaisId(selectedPaisId); 
//         setPaisCodigoIso(selectedPaisCodigoIso); 
//         setActividad((prevState) => ({ ...prevState, pais: paisId }));
//         // Llamada para cargar las ciudades
//         setLoadingCiudades(true);
//         try {
//           const response = await fetch(`${baseUrl}/Ciudad/${selectedPaisCodigoIso}/ciudades`);
//           const data = await response.json();
//           setCiudades(data);
//         } catch (error) {
//           console.error("Error al obtener las ciudades", error);
//         } finally {
//           setLoadingCiudades(false);
//         }
//       };
      

//     // const handleCiudadChange = (event) => {
//     //     setActividad({ ...actividad, ciudad: event.target.value });
//     // };
//     const handleCiudadChange = (e) => {
//         setActividad((prevState) => ({ ...prevState, ciudad: e.target.value }));
//       };
      


//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setActividad({
//             ...actividad,
//             [name]: type === 'checkbox' ? checked : value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`${baseUrl}/Actividad/altaActividad`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(actividad)
//             });

//             if (response.ok) {
//                 console.log('Actividad creada exitosamente');
//                 navigate(`/crear-eventos/${itinerarioId}`);
//             } else {
//                 console.error('Error al crear la actividad');
//             }
//         } catch (error) {
//             console.error('Error de red:', error);
//         }
//     };

//     const isSubmitDisabled = () => {
//         return !(actividad.nombre && actividad.descripcion && actividad.ubicacion && actividad.duracion && actividad.pais && actividad.ciudad);
//     };

//     return (
//         <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2, boxShadow: 3 }}>
//             <Typography variant="h4" gutterBottom sx={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>
//                 Agregar Nueva Actividad
//             </Typography>
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Nombre"
//                             name="nombre"
//                             value={actividad.nombre}
//                             onChange={handleChange}
//                             fullWidth
//                             required
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Descripción"
//                             name="descripcion"
//                             value={actividad.descripcion}
//                             onChange={handleChange}
//                             fullWidth
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Ubicación"
//                             name="ubicacion"
//                             value={actividad.ubicacion}
//                             onChange={handleChange}
//                             fullWidth
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Duración"
//                             name="duracion"
//                             type="number"
//                             value={actividad.duracion}
//                             onChange={handleChange}
//                             fullWidth
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     checked={actividad.opcional}
//                                     onChange={handleChange}
//                                     name="opcional"
//                                 />
//                             }
//                             label="Opcional"
//                         />
//                     </Grid>

//                     <FormControl fullWidth margin="normal" required>
//                         <InputLabel>País</InputLabel>
//                         <Select
//                             value={paisId}  // Asegúrate de que el valor del Select esté controlado por el estado paisId
//                             onChange={handlePaisChange}  // Llama a la función handlePaisChange cuando se cambie el valor
//                             label="País"
//                         >
//                             {loadingPaises ? (
//                             <MenuItem disabled>
//                                 <CircularProgress size={24} />
//                             </MenuItem>
//                             ) : (
//                             paises.map((pais) => (
//                                 <MenuItem
//                                 key={pais.id}
//                                 value={pais.id} // Guardamos el ID del país
//                                 data-codigoIso={pais.codigoIso}  // Añadimos el código ISO como atributo
//                                 >
//                                 {pais.nombre}  
//                                 </MenuItem>
//                             ))
//                             )}
//                         </Select>
//                         </FormControl>

//                     <Grid item xs={12} sm={6}>
//                     <FormControl fullWidth>
//                         <InputLabel>Ciudad</InputLabel>
//                         <Select
//                         name="ciudad"
//                         value={actividad.ciudad}
//                         onChange={handleCiudadChange}
//                         label="Ciudad"
//                         required
//                         disabled={loadingCiudades || !paisId}
//                         >
//                         {loadingCiudades ? (
//                             <MenuItem disabled>
//                             <CircularProgress size={24} />
//                             </MenuItem>
//                         ) : (
//                             ciudades.map((ciudad) => (
//                             <MenuItem key={ciudad.id} value={ciudad.id}>
//                                 {ciudad.nombre}
//                             </MenuItem>
//                             ))
//                         )}
//                         </Select>
//                     </FormControl>
//                     </Grid>

//                     {/* <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth>
//                             <InputLabel>Ciudad</InputLabel>
//                             <Select
//                                 name="ciudad"
//                                 value={actividad.ciudad}
//                                 onChange={handleCiudadChange}
//                                 label="Ciudad"
//                                 required
//                                 disabled={loadingCiudades || !actividad.pais}
//                             >
//                                 {loadingCiudades ? (
//                                     <MenuItem disabled>
//                                         <CircularProgress size={24} />
//                                     </MenuItem>
//                                 ) : (
//                                     ciudades.map((ciudad) => (
//                                         <MenuItem key={ciudad.codigo} value={ciudad.codigo}>
//                                             {ciudad.nombre}
//                                         </MenuItem>
//                                     ))
//                                 )}
//                             </Select>
//                         </FormControl>
//                     </Grid>*/}

//                     <Grid item xs={12}>
//                         <TextField
//                             label="Tips (opcional)"
//                             name="tips"
//                             value={actividad.tips}
//                             onChange={handleChange}
//                             fullWidth
//                         />
//                     </Grid> 

//                     <Grid item xs={12}>
//                         <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             disabled={isSubmitDisabled()}
//                             sx={{ width: '100%', padding: '14px', fontWeight: 'bold' }}
//                         >
//                             Crear Actividad
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </form>
//         </Box>
//     );
// }

// export default AgregarActividad;
