import React from 'react';
import { Container, Typography, List, ListItem, Link, Box } from '@mui/material';


const PoliticaPrivacidad = () => {
    
  return (
    <>
      <Container maxWidth="md" sx={{ py: 4, backgroundColor: 'white', textAlign: 'justify' }}>
        <Typography variant="h4" gutterBottom align="center">
          Política de Privacidad de la plataforma SiurXp
        </Typography>
        
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            1. Introducción
          </Typography>
          <Typography variant="body1" paragraph>
            Bienvenido a la plataforma de Siur Viajes, SiurXp. Al utilizar esta aplicación, usted acepta los términos de la presente Política de Privacidad. Si no está de acuerdo, le recomendamos no proporcionarnos su información personal.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            2. Datos que recolectamos
          </Typography>
          <Typography variant="body1" paragraph>
            En Siur Viajes recopilamos los siguientes datos personales de los usuarios: Nombre, Apellido, Correo Electrónico, Teléfono, Fecha de Nacimiento, Pasaporte y Ubicación. Esta información es utilizada con fines de gestión de la experiencia del usuario, tales como:
          </Typography>
          <List>
            <ListItem>Registrar a los viajeros para llevar un control de los participantes.</ListItem>
            <ListItem>Ofrecer asistencia y soporte durante el viaje.</ListItem>
            <ListItem>Utilizar la ubicación para optimizar la experiencia y brindar información en tiempo real.</ListItem>
          </List>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            3. Uso de la información
          </Typography>
          <Typography variant="body1" paragraph>
            Los datos recolectados serán utilizados exclusivamente para los fines establecidos en esta política. No compartimos, vendemos ni transferimos sus datos personales a terceros.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            4. Derechos del usuario
          </Typography>
          <Typography variant="body1" paragraph>
           Usted puede ejercer sus derechos acceder a sus datos personales recolectados, solicitar la corrección de datos incorrectos, la eliminación de sus datos personales y a oponerse al procesamiento de los mismos.
          </Typography>
                   
          <Typography variant="body1" paragraph>
            Para ejercer estos derechos, puede contactarnos a través de nuestro correo electrónico: 
            <Link href="mailto:siurxps@gmail.com">siurxps@gmail.com</Link>.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            5. Seguridad de la información
          </Typography>
          <Typography variant="body1" paragraph>
            En Siur Viajes estamos comprometidos con la seguridad de sus datos personales. Implementamos medidas técnicas y organizativas adecuadas para proteger su información de accesos no autorizados, pérdidas o alteraciones.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            6. Modificaciones a esta política
          </Typography>
          <Typography variant="body1" paragraph>
            Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio será notificado en esta sección, y el uso continuo de nuestra aplicación implica su aceptación de los nuevos términos.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            7. Contacto
          </Typography>
          <Typography variant="body1" paragraph>
            Para cualquier consulta o inquietud sobre esta Política de Privacidad o el manejo de sus datos, puede contactarnos en <Link href="mailto:siurxps@gmail.com">siurxps@gmail.com</Link> o visitarnos en nuestra oficina en Plaza Independencia 831, 11100 Montevideo.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            8. Legislación aplicable
          </Typography>
          <Typography variant="body1" paragraph>
            Esta Política de Privacidad se rige por las leyes de la República Oriental del Uruguay, particularmente la Ley N° 18.331 de Protección de Datos Personales.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default PoliticaPrivacidad;
