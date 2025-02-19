import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginScreen } from '../screen/LoginScreen';
import { MotosScreen } from '../screen/MotosScreen';
import { AgregarProductosScreen } from '../screen/AgregarProductosScreen';
import { HomeScreen } from '../screen/HomeScreen';
import PrivateRoutes from '../routes/PrivateRoutes';
import { ProductoTable } from '../components/relacionProductos/ProductoTable';
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
                <Route path="/Proveedores" element={<ProveedoresTable />} />
            </Route>
        </Routes>

    );
};
