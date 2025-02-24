import { useState, useEffect } from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";


const AltaActividad = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
    ubicacion: "",
    duracion: "",
    opcional: false,
    tips: "",
    paisId: "",
    ciudadId: "",
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
  const token = localStorage.getItem('token');
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
  }, [navigate, baseUrl, token]);

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
  }, [formData.paisId, paises, baseUrl, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };

      if (name === "ciudadId") {
        const ciudadSeleccionada = ciudades.find(c => c.id === Number(value));
        if (ciudadSeleccionada) {
          newData.ciudad = {
            id: ciudadSeleccionada.id,
            nombre: ciudadSeleccionada.nombre,
            paisId: Number(formData.paisId),
            paisCodigoIso: formData.pais.codigoIso
          };
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert('No está autorizado. Por favor inicie sesión.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/Actividad/altaActividad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          duracion: Number(formData.duracion),
          paisId: Number(formData.paisId),
          ciudadId: Number(formData.ciudadId)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la actividad');
      }

      const data = await response.json();
      console.log(data);
      alert("Actividad creada con éxito");
      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || 'Error al crear la actividad');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField 
            fullWidth 
            label="Nombre" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth 
            label="Descripción" 
            name="descripcion" 
            multiline 
            rows={4}
            value={formData.descripcion} 
            onChange={handleChange} 
            required 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth 
            label="Ubicación" 
            name="ubicacion" 
            multiline 
            rows={2}
            value={formData.ubicacion} 
            onChange={handleChange} 
            required 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            fullWidth 
            label="Duración (horas)" 
            name="duracion" 
            type="number" 
            value={formData.duracion} 
            onChange={handleChange} 
            required 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth 
            label="Tips" 
            name="tips" 
            multiline
            rows={2}
            value={formData.tips} 
            onChange={handleChange} 
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth required>
            <InputLabel>País</InputLabel>
            <Select 
              name="paisId" 
              value={formData.paisId} 
              onChange={handleChange}
            >
              {paises.map(pais => (
                <MenuItem key={pais.id} value={pais.id}>
                  {pais.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth required>
            <InputLabel>Ciudad</InputLabel>
            <Select 
              name="ciudadId" 
              value={formData.ciudadId} 
              onChange={handleChange}
              disabled={!formData.paisId}
            >
              {ciudades.map(ciudad => (
                <MenuItem key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel 
            control={
              <Checkbox 
                name="opcional" 
                checked={formData.opcional} 
                onChange={handleChange} 
              />
            } 
            label="Opcional" 
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
          >
            Crear Actividad
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AltaActividad;
