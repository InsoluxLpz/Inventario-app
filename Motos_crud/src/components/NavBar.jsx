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
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useLocation } from "react-router-dom";
import { Collapse, InputBase, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import CategoryIcon from "@mui/icons-material/Category";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LogoutIcon from "@mui/icons-material/Logout";
import InboxIcon from '@mui/icons-material/Inbox';

const drawerWidth = 240;

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
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
);

export const NavBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const [openProducts, setOpenProducts] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openAlmacen, setOpenAlmacen] = useState(false);

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

  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };

  const handleServicesClick = () => {
    setOpenServices(!openServices);
  };

  const handleAlmacenClick = () => {
    setOpenAlmacen(!openAlmacen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const routeTitles = {
    "/inicio": "Inicio",
    "/motos": "Administración de Motos",
    "/productos": "Productos",
    "/servicios/RealizarServicio": "Servicios",
    "/servicios/ListaServicios": "Servicios",
    "/almacen/ProductoAlmacenTable": "Almacén de productos",
  };

  const currentTitle = routeTitles[location.pathname] || "Inicio";

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar position="fixed" open={open} style={{ backgroundColor: "#34495e  " }}>
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

      {/* Drawer */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        {/* List of items */}
        <List>
          <ListItem button selected={selectedItem === "/inicio"} onClick={() => handleNavigate("/inicio")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem button selected={selectedItem === "/Proveedores"} onClick={() => handleNavigate("/Proveedores")}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Proveedores" />
          </ListItem>
          <ListItem button selected={selectedItem === "/motos"} onClick={() => handleNavigate("/motos")}>
            <ListItemIcon>
              <TwoWheelerIcon />
            </ListItemIcon>
            <ListItemText primary="Motos" />
          </ListItem>

          <ListItem button onClick={handleProductsClick}>
            <ListItemIcon>{openProducts ? <ArrowDropDownIcon /> : <ArrowRightIcon />}</ListItemIcon>
            <ListItemText primary="Productos" />
          </ListItem>
          <Collapse in={openProducts} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate("/productos")}>
                <ListItemIcon>
                  <InventoryTwoToneIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary="Lista de Productos" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleServicesClick}>
            <ListItemIcon>{openServices ? <ArrowDropDownIcon /> : <ArrowRightIcon />}</ListItemIcon>
            <ListItemText primary="Servicios" />
          </ListItem>
          <Collapse in={openServices} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate("/servicios/ListaMantenimientos")}>
                <ListItemIcon>
                  <CategoryIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary="Lista de Mantenimientos" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate("/servicios/CatalogoServicios")}>
                <ListItemIcon>
                  <InventoryTwoToneIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary="Catalogo Servicios" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleAlmacenClick}>
            <ListItemIcon>{openAlmacen ? <ArrowDropDownIcon /> : <ArrowRightIcon />}</ListItemIcon>
            <ListItemText primary="Almacen" />
          </ListItem>
          <Collapse in={openAlmacen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate("/almacen/Entradas")}>
                <ListItemIcon>
                  <WarehouseIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary="Entradas" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate("/almacen/ProductoAlmacenTable")}>
                <ListItemIcon>
                  <CategoryIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary="Productos en Almacén" />
              </ListItem>
            </List>
          </Collapse>

          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ fontSize: 18, color: 'red' }} />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" sx={{ color: 'red' }} />
          </ListItem>
        </List>
      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          paddingTop: "60px", // Ajusta la altura para el AppBar
          // padding: 4,
        }}
      >
        {/* Aquí irían los componentes de cada página */}
      </Box>
    </Box>
  );
};
