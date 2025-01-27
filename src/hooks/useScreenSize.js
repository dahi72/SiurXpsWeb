// useScreenSize.js
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useScreenSize = () => {
  const theme = useTheme();

  // Verificar si el tamaño de pantalla coincide con cada breakpoint
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  // También puedes verificar si es un tamaño menor o mayor a un breakpoint
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const isDownMd = useMediaQuery(theme.breakpoints.down('md'));

  // Devuelve un objeto con el estado de cada tamaño de pantalla
  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isUpMd,
    isDownMd,
    isDownSm
  };
};

