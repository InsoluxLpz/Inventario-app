


import { useSpring, animated } from '@react-spring/web';
import { Box } from "@mui/material";
import { NavBar } from "../components/NavBar";
import imagenFondo from "../img/logo prestamaz tenemos dinero para ti_negro.png";

const AnimatedLogo = () => {
  const styles = useSpring({
    from: { opacity: 0, transform: 'scale(0.5)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 200, friction: 120 },
  });

  return (
    <animated.img
      src={imagenFondo}
      alt="Logo animado"
      style={{ ...styles, maxWidth: '50%', maxHeight: '80vh', objectFit: 'contain' }}
    />
  );
};

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
        <AnimatedLogo />
      </Box>
    </>
  );
};

