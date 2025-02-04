import { Groups, LocationCity, TravelExplore, UploadFile } from "@mui/icons-material";

export const opcionesCoordinador = [
    { 
        label: 'Crear grupo de Viaje',
        action: '/crearGrupo',
        icon: <Groups sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: 'Crear Itinerario',
        action: '/crear-itinerario',
        icon: <LocationCity sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    },
    { 
        label: 'Ver Itinerario',
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
        label: 'Cargar catálogo',
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
        label: 'Ver Itinerario',
        action: '/itinerario-visual',
        icon: <LocationCity sx={{ fontSize: 40, color: '#1565C0', mb: 1 }} />
    }
];