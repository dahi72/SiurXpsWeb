import { createContext, useContext, useState } from "react";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');   
   

     return (
         <SnackbarContext.Provider
             value={{
                 openSnackbar,
                 snackbarMessage,
                 snackbarSeverity,
                 setOpenSnackbar,
                 setSnackbarMessage,
                 setSnackbarSeverity
             }} >
         {children}
       </SnackbarContext.Provider>
     );
  };


export const useSnackbar = () => {
    return useContext(SnackbarContext);
}
