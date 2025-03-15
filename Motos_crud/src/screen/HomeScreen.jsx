import { NavBar } from "../components/NavBar";
import { Box } from "@mui/material";
import imagenFondo from "../img/logo prestamaz tenemos dinero para ti_negro.png"; // Asegúrate de que la ruta sea correcta

export const HomeScreen = () => {
    return (
        <>
            <NavBar />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                }}
            >
                <img
                    src={imagenFondo}
                    alt="Imagen de inicio"
                    style={{
                        maxWidth: "50%",
                        maxHeight: "80vh",
                        objectFit: "contain",
                    }}
                />
            </Box>
        </>
    );
};
