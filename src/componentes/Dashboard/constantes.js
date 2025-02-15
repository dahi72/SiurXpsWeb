
import { Groups, LocationCity, TravelExplore, UploadFile } from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';

export const opcionesCoordinador = [
    { 
        label: 'Gestión de grupo de Viaje',
        action: '/crearGrupo',
        icon: <Groups sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: 'Gestión de Itinerario',
        action: '/crear-itinerario',
        icon: <LocationCity sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: 'Ver Itinerarios',
        action: '/VerItinerario',
        icon: <LocationCity sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: '¿Dónde estoy?',
        action: '/donde-estoy2',
        icon: <TravelExplore sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: 'Mis grupos',
        action: '/misGrupos',
        icon: <Groups sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: 'Gestión de catálogo',
        action: '/catalogos',
        icon: <UploadFile sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    }
];


export const opcionesViajero = [
    { 
        label: '¿Dónde estoy?',
        action: '/donde-estoy2',
        icon: <TravelExplore sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: 'Ver Itinerarios',
        action: '/VerItinerarioViajero',
        icon: <LocationCity sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: 'Mis Datos',
        action: '/verMisDatos',
        icon:   <PersonIcon sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    }
   
];
