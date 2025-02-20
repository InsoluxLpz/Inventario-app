


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginScreen } from '../screen/LoginScreen';
import { MotosScreen } from '../screen/MotosScreen';
import { AgregarProductosScreen } from '../screen/AgregarProductosScreen';
import { HomeScreen } from '../screen/HomeScreen';
import PrivateRoutes from '../routes/PrivateRoutes';
import { ProductoTable } from '../components/relacionProductos/ProductoTable';
import { EntradasAlmacenModal } from '../components/entradas/EntradasAlmacenModal';
import { CatalogoServicios } from '../components/Servicios/CatalogoServicios';
import { AgregarServicios } from '../components/Servicios/AgregarServicios';
import { ListaMantenimientos } from '../components/Servicios/ListaMantenimientos';
import { RealizarMantenimiento } from '../components/Servicios/RealizarMantenimiento';
import { ProveedoresTable } from '../components/relacionProveedores/ProveedoresTable';




export const AppRoutes = () => {
    return (

        <Routes>
            {/* Rutas públicas */}
            <Route >
                <Route path="/" element={<LoginScreen />} />
            </Route>

            {/* Rutas privadas */}
            <Route element={<PrivateRoutes />}>
                <Route path="/Inicio" element={<HomeScreen />} />
                <Route path="/Motos" element={<MotosScreen />} />
                <Route path="/AgregarProductos" element={<AgregarProductosScreen />} />
                <Route path="/Productos" element={<ProductoTable />} />
                <Route path="/servicios/ListaMantenimientos" element={<ListaMantenimientos />} />
                <Route path="/servicios/RealizarMantenimiento" element={<RealizarMantenimiento />} />
                <Route path="/servicios/CatalogoServicios" element={<CatalogoServicios />} />
                <Route path="/servicios/AgregarServicios" element={<AgregarServicios />} />
                <Route path="/almacen/Entradas" element={<EntradasAlmacenModal />} />
                <Route path="/Proveedores" element={<ProveedoresTable />} />
            </Route>
        </Routes>

    );
};
