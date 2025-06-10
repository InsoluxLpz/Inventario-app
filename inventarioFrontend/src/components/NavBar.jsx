import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useLocation } from "react-router-dom";
import { Collapse, Typography } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import HandymanIcon from "@mui/icons-material/Handyman";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import HomeIcon from "@mui/icons-material/Home";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from 'sweetalert2';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import WarehouseIcon from '@mui/icons-material/Warehouse';

const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // Cambié esto para alinear el título
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  backgroundColor: "#f1c40f", // Color para el header del Drawer
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: "#e5e8e8 ", // Color para el drawer completo
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: "#e5e8e8 ", // Color para el drawer completo
    },
  }),
}));

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const [openProducts, setOpenProducts] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  const handleNavigate = (path) => navigate(path);

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location.pathname]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };

  const handleServicesClick = () => {
    setOpenServices(!openServices);
  };

  const handleAdminClick = () => {
    setOpenAdmin(!openAdmin);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Cerrar Sesión",
      text: "¿Quieres cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f1c40f",
      cancelButtonColor: "#7f8c8d",
      confirmButtonText: "Sí,Cerrar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const routeTitles = {
    "/inicio": "Inicio",
    "/motos": "Flotilla",
    "/productos": "Catalogo de Productos",
    "/servicios/RealizarServicio": "Servicios",
    "/servicios/ListaServicios": "Servicios",
    "/almacen/ProductoAlmacenTable": "Inventario Productos",
    "/almacen/MovimientosAlmacenTable": "Movimientos de productos",
    "/Proveedores": "Catalogo de Proveedores",
    "/servicios/ListaMantenimientos": "Reporte Mantenimientos",
    "/servicios/CatalogoServicios": "Catalogo de servicios",
    "/almacen/Entradas": "Entradas/Salidas",
    "/servicios/RealizarMantenimiento": "Agregar Mantenimiento",
    "/grupos/ListaGrupos": "Agregar Grupo",
    "/relacionMultiAlmacenes/ListaMultiAlmacenes": "Lista Almacenes",
  };

  const currentTitle = routeTitles[location.pathname] || "Inicio";

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        open={open}
        style={{ backgroundColor: "#34495e  " }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {currentTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DrawerHeader>
          <Typography variant="h6" style={{ color: "black" }}>
            MODULOS
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          <ListItem
            button
            selected={selectedItem === "/inicio"}
            onClick={() => handleNavigate("/inicio")}
            sx={{
              backgroundColor:
                selectedItem === "/inicio" ? "#85929e   " : "transparent",
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Inicio"
              sx={{ display: open ? "block" : "none" }}
            />
          </ListItem>

          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.7)", borderWidth: 1 }} />

          <ListItem button onClick={handleProductsClick}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <NewspaperIcon />
            </ListItemIcon>
            <ListItemText
              primary="Catálogos"
              sx={{ display: open ? "block" : "none" }}
            />

            {open && (
              <ExpandMoreIcon
                sx={{
                  transition: "transform 0.3s",
                  transform: openProducts ? "rotate(180deg)" : "rotate(0deg)",
                  marginLeft: "auto",
                }}
              />
            )}
          </ListItem>

          <Collapse in={openProducts} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                selected={selectedItem === "/Proveedores"}
                onClick={() => handleNavigate("/Proveedores")}
                sx={{
                  backgroundColor:
                    selectedItem === "/Proveedores"
                      ? "#85929e  "
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LocalShippingIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Proveedores"
                  sx={{
                    fontSize: "0.875rem",
                    display: open ? "block" : "none",
                  }}
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/motos"}
                onClick={() => handleNavigate("/motos")}
                sx={{
                  backgroundColor:
                    selectedItem === "/motos" ? "#85929e  " : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <TwoWheelerIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Flotilla"
                  sx={{
                    fontSize: "0.875rem",
                    display: open ? "block" : "none",
                  }}
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/productos"}
                onClick={() => handleNavigate("/productos")}
                sx={{
                  backgroundColor:
                    selectedItem === "/productos" ? "#85929e  " : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <InventoryTwoToneIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Productos"
                  sx={{
                    fontSize: "0.875rem",
                    display: open ? "block" : "none",
                  }}
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/servicios/CatalogoServicios"}
                onClick={() => handleNavigate("/servicios/CatalogoServicios")}
                sx={{
                  backgroundColor:
                    selectedItem === "/servicios/CatalogoServicios"
                      ? "#85929e"
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <MiscellaneousServicesIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Servicios"
                  sx={{
                    fontSize: "0.875rem",
                    display: open ? "block" : "none",
                  }}
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/grupos/ListaGrupos"}
                onClick={() => handleNavigate("/grupos/ListaGrupos")}
                sx={{
                  backgroundColor:
                    selectedItem === "Agregar Grupo"
                      ? "#85929e"
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <GroupWorkIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Grupos"
                  sx={{
                    fontSize: "0.875rem",
                    display: open ? "block" : "none",
                  }}
                />
              </ListItem>

              {/* se agregaron multialmacenes */}
              <ListItem
                button
                selected={selectedItem === "/relacionMultiAlmacenes/ListaMultiAlmacenes"}
                onClick={() => handleNavigate("/relacionMultiAlmacenes/ListaMultiAlmacenes")}
                sx={{
                  backgroundColor:
                    selectedItem === "Lista Almacenes"
                      ? "#85929e"
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <WarehouseIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Almacenes"
                  sx={{
                    fontSize: "0.875rem",
                    display: open ? "block" : "none",
                  }}
                />
              </ListItem>

            </List>
          </Collapse>

          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.7)", borderWidth: 1 }} />

          <ListItem button onClick={handleAdminClick}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Administración"
              sx={{ display: open ? "block" : "none" }}
            />

            {open && (
              <ExpandMoreIcon
                sx={{
                  transition: "transform 0.3s",
                  transform: openAdmin ? "rotate(180deg)" : "rotate(0deg)",
                  marginLeft: "auto",
                }}
              />
            )}
          </ListItem>

          <Collapse in={openAdmin} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                selected={selectedItem === "/servicios/RealizarMantenimiento"}
                onClick={() =>
                  handleNavigate("/servicios/RealizarMantenimiento")
                }
                sx={{
                  backgroundColor:
                    selectedItem === "/servicios/RealizarMantenimiento"
                      ? "#85929e  "
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <HomeRepairServiceIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Agregar Mantenimiento"
                  sx={{ display: open ? "block" : "none" }}
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/almacen/relacionEntradas"}
                onClick={() => handleNavigate("/almacen/relacionEntradas")}
                sx={{
                  backgroundColor:
                    selectedItem === "/almacen/relacionEntradas"
                      ? "#85929e   "
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <WarehouseIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Entradas/Salidas"
                  sx={{ display: open ? "block" : "none" }}
                />
              </ListItem>
            </List>
          </Collapse>

          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.7)", borderWidth: 1 }} />

          <ListItem button onClick={handleServicesClick}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Reportes"
              sx={{ display: open ? "block" : "none" }}
            />

            {open && (
              <ExpandMoreIcon
                sx={{
                  transition: "transform 0.3s",
                  transform: openServices ? "rotate(180deg)" : "rotate(0deg)",
                  marginLeft: "auto",
                }}
              />
            )}
          </ListItem>


          <Collapse in={openServices} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItem
                button
                selected={selectedItem === "/almacen/ProductoAlmacenTable"}
                onClick={() => handleNavigate("/almacen/ProductoAlmacenTable")}
                sx={{
                  backgroundColor:
                    selectedItem === "/almacen/ProductoAlmacenTable"
                      ? "#85929e  "
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <StorageIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Inventario"
                  sx={{ display: open ? "block" : "none" }}
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/servicios/ListaMantenimientos"}
                onClick={() => handleNavigate("/servicios/ListaMantenimientos")}
                sx={{
                  backgroundColor:
                    selectedItem === "/servicios/ListaMantenimientos"
                      ? "#85929e  "
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <HandymanIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Mantenimientos"
                  sx={{
                    fontSize: "0.875rem",
                    display: open ? "block" : "none",
                  }}
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/almacen/MovimientosAlmacenTable"}
                onClick={() =>
                  handleNavigate("/almacen/MovimientosAlmacenTable")
                }
                sx={{
                  backgroundColor:
                    selectedItem === "/almacen/MovimientosAlmacenTable"
                      ? "#85929e  "
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <MoveToInboxIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Movimientos almacen"
                  sx={{
                    fontSize: "0.875rem",
                    display: open ? "block" : "none",
                  }}
                />
              </ListItem>

              <ListItem
                button
                selected={selectedItem === "/almacen/MovXProductosTable"}
                onClick={() => handleNavigate("/almacen/MovXProductosTable")}
                sx={{
                  backgroundColor:
                    selectedItem === "/almacen/MovXProductosTable"
                      ? "#85929e  "
                      : "transparent",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CategoryIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Movimientos/Productos"
                  sx={{ display: open ? "block" : "none" }}
                />
              </ListItem>

            </List>
          </Collapse>

          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.7)", borderWidth: 1 }} />

          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <LogoutIcon sx={{ fontSize: 20, color: 'red' }} />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" sx={{ color: 'red', display: open ? "block" : "none" }} />
          </ListItem>

        </List>
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          paddingTop: "60px",
        }}
      ></Box>
    </Box>
  );
};
