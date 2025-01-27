import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

export const SidebarContent = () => {
  return (
    <List>
      {['Inicio', 'Perfil', 'Configuración', 'Ayuda'].map((text) => (
        <ListItem button key={text} component={Link} to={`/${text.toLowerCase()}`}>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  );
};

