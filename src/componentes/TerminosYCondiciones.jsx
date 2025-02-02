import React from 'react';
import { Container, Typography,Link, Box } from '@mui/material';


const TerminosYCondiciones = () => {
    
   
  return (
    <>    
      <Container maxWidth="md" sx={{ py: 4, backgroundColor: 'white', textAlign: 'justify' }}>
        <Typography variant="h4" gutterBottom align="center">
          Términos y Condiciones de uso de la plataforma SiurXp
        </Typography>
        
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            1. Introducción
          </Typography>
          <Typography variant="body1" paragraph>
          Bienvenido a SiurXp, la plataforma desarrollada por Siur Viajes. Al acceder y utilizar nuestra aplicación, usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le solicitamos que no utilice la plataforma.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            2. Aceptación de los Términos
          </Typography>
          <Typography variant="body1" paragraph>
          El uso de SiurXp implica la aceptación plena y sin reservas de estos Términos y Condiciones. Estos pueden ser modificados en cualquier momento, por lo que se recomienda revisarlos periódicamente.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            3. Uso de la Plataforma
          </Typography>
          <Typography variant="body1" paragraph>
          Uso Autorizado: La plataforma está destinada exclusivamente para uso personal y no comercial.
          </Typography>
          <Typography> Prohibiciones: Está prohibido el uso de la aplicación para actividades ilegales, fraudulentas o que infrinjan derechos de terceros.
        </Typography>

        <Typography>Responsabilidad del Usuario: El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y por todas las actividades realizadas bajo su cuenta.</Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            4. Propiedad Intelectual
          </Typography>
          <Typography variant="body1" paragraph>
          Todos los contenidos disponibles en SiurXp, incluyendo textos, gráficos, logos, iconos, imágenes y software, son propiedad de Siur Viajes o de sus licenciantes y están protegidos por las leyes de propiedad intelectual.
          </Typography>
                   
          </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            5. Datos Personales
          </Typography>
          <Typography variant="body1" paragraph>
          La recolección y tratamiento de datos personales se rige por nuestra Política de Privacidad, donde se detalla cómo se manejan sus datos dentro de la plataforma.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            6.  Limitación de Responsabilidad
          </Typography>
          <Typography variant="body1" paragraph>
          Siur Viajes no será responsable por daños directos, indirectos, incidentales o consecuentes que puedan surgir del uso o incapacidad para usar la plataforma.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            7. Modificaciones a los Términos
          </Typography>
          <Typography variant="body1" paragraph>
          Nos reservamos el derecho a modificar estos Términos y Condiciones en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación en esta sección.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            8. Legislación aplicable
          </Typography>
          <Typography variant="body1" paragraph>
          Estos Términos y Condiciones se rigen por las leyes de la República Oriental del Uruguay. Cualquier disputa relacionada con estos términos será resuelta en los tribunales competentes del país.
          </Typography>
        </Box>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            9. Contacto
          </Typography>
          <Typography variant="body1" paragraph>
          Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactarnos a través del correo electrónico: <Link href="mailto:siurxps@gmail.com">siurxps@gmail.com</Link> o visitarnos en nuestra oficina en Plaza Independencia 831, 11100 Montevideo.
          </Typography>
        </Box>

      </Container>
    </>
  );
};

export default TerminosYCondiciones;
