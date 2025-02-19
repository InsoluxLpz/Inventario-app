import React, { useEffect, useState } from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Switch,
  FormControlLabel,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@mui/material";
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const drawerWidth = 250;

// Estilos del Main (contenido principal)
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

// Estilos del AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// Estilos de la barra de búsqueda
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

// * Estilos del botón de cerrar sesión
const LogoutButton = styled("button")(({ theme }) => ({
  marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.error.main, // Rojo
  color: theme.palette.common.white, // Blanco
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.common.white}`, // Borde blanco
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.error.main, 0.85),
  },
}));

export const NavBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const handleNavigate = (path) => navigate(path); // Navega a la ruta correspondiente
  const [openProducts, setOpenProducts] = useState(false);

  useEffect(() => {
    setSelectedItem(location.pathname); // Actualiza el ítem seleccionado cuando cambie la ruta
  }, [location.pathname]);

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  // * funcion de logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProductsClick = () => {
    setOpenProducts(!openProducts); // Alternar el estado de abierto/cerrado
  };

  // Títulos dinámicos para cada ruta
  const routeTitles = {
    "/inicio": "Inicio",
    "/motos": "Administración de Motos",
    "/AgregarProductos": "Agregar Productos",
    "/productos": "Productos",
    "/proveedores": "Proveedores"
  };

  // Obtén el título según la ruta actual
  const currentTitle = routeTitles[location.pathname] || "Inicio";

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        open={open}
        style={{ backgroundColor: "#a93226" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {currentTitle}
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar"
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchChange}
            />
          </Search>
          {/* Botón de cerrar sesión */}
          <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader style={{ backgroundColor: "#f39c12" }}>
          <IconButton onClick={handleDrawerClose}>
            <ArrowBackIosNewIcon style={{ color: "white" }} />
            <Typography variant="h6" style={{ color: "white", marginRight: 50 }}>
              MODULOS
            </Typography>
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          <ListItem
            button
            selected={selectedItem === "/inicio"}
            onClick={() => handleNavigate("/inicio")}
          >
            <ListItemIcon sx={{ minWidth: 32 }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>

          <ListItem
            button
            selected={selectedItem === "/motos"}
            onClick={() => handleNavigate("/motos")}
          >
            <ListItemIcon sx={{ minWidth: 32 }}><TwoWheelerIcon /></ListItemIcon>
            <ListItemText primary="Motos" />
          </ListItem>

          <ListItem button onClick={handleProductsClick}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {openProducts ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
            </ListItemIcon>
            <ListItemText primary="Productos" />
          </ListItem>

          {/* Subcategorías de "Productos" */}
          <Collapse in={openProducts} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                selected={selectedItem === "/AgregarProductos"}
                onClick={() => handleNavigate("/AgregarProductos")}
                sx={{ paddingLeft: 4 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CategoryIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      Agregar Producto
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/productos"}
                onClick={() => handleNavigate("/productos")}
                sx={{ paddingLeft: 4 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <InventoryTwoToneIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      Lista de Productos
                    </Typography>
                  }
                />

              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            selected={selectedItem === "/proveedores"}
            onClick={() => handleNavigate("/proveedores")}
          >
            <ListItemIcon sx={{ minWidth: 32 }}><ConnectWithoutContactIcon/></ListItemIcon>
            <ListItemText primary="Proveedores" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
};