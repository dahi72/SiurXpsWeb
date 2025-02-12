import { useState, useEffect } from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_API_URL; 
const token = localStorage.getItem("token"); 

const AltaTraslado = () => {


const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lugarDeEncuentro: "",
    tipoDeTraslado: "",
    paisId: "",
    ciudadId: "",
    tips: "",
    pais: {
      id: 0,
      nombre: "",
      codigoIso: ""
    },
    ciudad: {
      id: 0,
      nombre: "",
      paisId: 0,
      paisCodigoIso: ""
    }
  });
  
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  // useEffect(() => {
  //   axios.get(`${baseUrl}/Pais/listado`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
  //     const paisesOrdenados = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
  //     setPaises(paisesOrdenados);
  //   });
  // }, []);
  // useEffect(() => {
  //   if (formData.paisId) {
  //     const paisSeleccionado = paises.find(p => p.id === formData.paisId);
  //     if (paisSeleccionado) {
  //       axios.get(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
  //         setCiudades(response.data);
  //       });
  //     }
  //   }
  // }, [formData.paisId, paises]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${baseUrl}/Pais/listado`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch countries');
        return response.json();
      })
      .then(data => {
        const paisesOrdenados = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setPaises(paisesOrdenados);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);


  useEffect(() => {
    if (formData.paisId) {
      const paisSeleccionado = paises.find(p => p.id === Number(formData.paisId));
      
      if (paisSeleccionado) {
        setFormData(prev => ({
          ...prev,
          pais: {
            id: paisSeleccionado.id,
            nombre: paisSeleccionado.nombre,
            codigoIso: paisSeleccionado.codigoIso
          }
        }));

        fetch(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (!response.ok) throw new Error('Failed to fetch cities');
            return response.json();
          })
          .then(data => {
            setCiudades(data);
          })
          .catch(error => {
            console.error("Error fetching cities:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('No está autorizado. Por favor inicie sesión.');
      navigate('/login');
      return;
    }

    try {
    const response = await fetch(`${baseUrl}/Traslado/altaTraslado`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...formData,
      paisId: Number(formData.paisId),
      ciudadId: Number(formData.ciudadId)
    })
  });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el traslado');
    }

    const data = await response.json();
    console.log(data);
    alert("Traslado creado con éxito");
    navigate(-1);
  } catch (error) {
    console.error("Error:", error);
    alert(error.message || 'Error al crear el traslado');
  }
};
    // axios.post(`${baseUrl}/Traslado/altaTraslado`, JSON.stringify(formData), { 
    //   headers: { 
    //     Authorization: `Bearer ${token}`, 
    //     "Content-Type": "application/json",
    //   }
    // })
    // .then(response => {
    //     alert("Actividad creada con éxito");
    //     navigate(-1); // Redirige a la página anterior
    //   })
    // .catch(error => {
    //   console.error("Error al crear traslado:", error.response?.data || error.message);
    // });
  

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Lugar de Encuentro" name="lugarDeEncuentro" value={formData.lugarDeEncuentro} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Traslado</InputLabel>
          <Select
            name="tipoDeTraslado"
            value={formData.tipoDeTraslado}
            onChange={handleChange}
            required
          >
            <MenuItem value={1}>Transfer In</MenuItem>
            <MenuItem value={2}>Transfer Out</MenuItem>
            <MenuItem value={3}>Tren</MenuItem>
            <MenuItem value={4}>Transfer InterHotel</MenuItem>
            <MenuItem value={5}>Bus</MenuItem>
            <MenuItem value={6}>Ferry</MenuItem>
          </Select>
        </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Tips" type="text"  name="tips" value={formData.tips} onChange={handleChange} />
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
  );
};

export default AltaTraslado;
