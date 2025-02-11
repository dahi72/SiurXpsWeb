import { useState, useEffect } from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Button, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_API_URL; 
const token = localStorage.getItem('token'); 

const AltaActividad = () => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    duracion: "",
    opcional: false,
    paisId: "",
    ciudadId: "",
    tips: ""
  });
  
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/Pais/listado`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
      const paisesOrdenados = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setPaises(paisesOrdenados);
    });
  }, []);
  // useEffect(() => {
  //   if (!formData.paisId) return; // Evitar ejecución innecesaria
  
  //   const paisSeleccionado = paises.find(p => p.id === Number(formData.paisId));
  //   if (paisSeleccionado) {
  //     // Solo actualizamos formData si el país seleccionado cambia
  //     if (formData.paisId !== paisSeleccionado.id) {
  //       setFormData(prev => ({
  //         ...prev,
  //         paisId: paisSeleccionado.id,   // Actualizamos el ID del país
  //         pais: paisSeleccionado          // Actualizamos el objeto del país completo
  //       }));
  //     }
  
  //     // Obtener ciudades del país seleccionado
  //     axios.get(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`, { 
  //       headers: { Authorization: `Bearer ${token}` } 
  //     }).then(response => {
  //       setCiudades(response.data);
  //     });
  //   }
  // }, [formData.paisId, paises]);  // Solo dependemos de paisId y paises para evitar loop
  
  // useEffect(() => {
  //   if (!formData.paisId) return; // Evitar ejecución innecesaria
    
  //   const paisSeleccionado = paises.find(p => p.id === Number(formData.paisId));
  //   if (paisSeleccionado) {
  //     // Solo actualizamos si el país seleccionado cambió
  //     if (!formData.pais || formData.pais !== paisSeleccionado) {
  //       setFormData(prev => ({
  //         ...prev,
  //         paisId: paisSeleccionado.id,   // Aseguramos que se mantenga el ID
  //         pais: paisSeleccionado  
  //       }));
  //     }
  
  //     // Obtener ciudades del país seleccionado
  //     axios.get(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`, { 
  //       headers: { Authorization: `Bearer ${token}` } 
  //     }).then(response => {
  //       setCiudades(response.data);
  //     });
  //   }
  // }, [formData.paisId, paises, formData.pais]);
  
  
  

  useEffect(() => {
    if (formData.paisId ) {
      const paisSeleccionado = paises.find(p => p.id === formData.paisId);
      if (paisSeleccionado) {
        setFormData(prev => ({
          ...prev,
          paisId: paisSeleccionado.id, // Asegurarse de mantener paisId
          pais: paisSeleccionado // Guardar el nombre del país
        }));
        axios.get(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
          setCiudades(response.data);
        });
      }
    }
  }, [formData.paisId, paises, formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
    
  //   setFormData(prev => {
  //     let newData = {
  //       ...prev,
  //       [name]: type === "checkbox" ? checked : value
  //     };

  //     // Si se cambia la ciudad, guardamos también su nombre
  //     if (name === "ciudadId") {
  //       const ciudadSeleccionada = ciudades.find(ciudad => ciudad.id === Number(value));
  //       newData.ciudad = ciudadSeleccionada ? ciudadSeleccionada.nombre : "";
  //     }

  //     return newData;
  //   });
  // };
  
    console.log("formData", formData)
    
  const handleSubmit = (e) => {
    e.preventDefault();
      
    fetch(`${baseUrl}/Actividad/altaActividad`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error("Error al crear actividad:", errorData.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("Actividad creada con éxito");
        navigate(-1);
      })
      
  }        
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
    //     axios.post(`${baseUrl}/Actividad/altaActividad`, JSON.stringify(formData), { 
    //       headers: { 
    //         Authorization: `Bearer ${token}`, 
    //         "Content-Type": "application/json",
    //       }
    //     })
    //     .then(response => {
    //         alert("Actividad creada con éxito");
    //         navigate(-1); 
    //       })
   
    //     .catch(error => {
    //       console.error("Error al crear actividad:", error.response?.data || error.mensaje);
    //     });
    // };
 
      
    return (
<form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px" }}>
    <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Nombre" type="text"  name="nombre" value={formData.nombre} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Descripción" type="text" multiline name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Ubicación" name="ubicacion" type="text" multiline value={formData.ubicacion} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Duración (minutos)" name="duracion" type="number" value={formData.duracion} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Tips" type="text"  name="tips" value={formData.tips} onChange={handleChange}  />
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

