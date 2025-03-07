import React, { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import CategoryIcon from '@mui/icons-material/Category';
import { useLocation, useNavigate } from 'react-router-dom';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WarehouseIcon from "@mui/icons-material/Warehouse";

export const HomeScreen = () => {

    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(location.pathname);
    const handleNavigate = (path) => navigate(path); // Navega a la ruta correspondiente

    useEffect(() => {
        setSelectedItem(location.pathname); // Actualiza el ítem seleccionado cuando cambie la ruta
    }, [location.pathname]);

    return (
        <>
            <NavBar />
            <div className="container mt-4">
                <div className="row justify-content-center">

                    <div className="col-md-3">
                        <div
                            className="card shadow text-center d-flex flex-column align-items-center justify-content-center btn-card"
                            onClick={() => handleNavigate('/motos')}>
                            <TwoWheelerIcon className="icon-large" />
                            <h6 className="mt-2">Administrar Motos</h6>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div
                            className="card shadow text-center d-flex flex-column align-items-center justify-content-center btn-card"
                            onClick={() => handleNavigate('/Productos')}>
                            <ProductionQuantityLimitsIcon className="icon-large" />
                            <h6 className="mt-2">Productos</h6>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div
                            className="card shadow text-center d-flex flex-column align-items-center justify-content-center btn-card"
                            onClick={() => handleNavigate('/Proveedores')}>
                            <ConnectWithoutContactIcon className="icon-large" />
                            <h6 className="mt-2">Proveedores</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div
                            className="card shadow text-center d-flex flex-column align-items-center justify-content-center btn-card"
                            onClick={() => handleNavigate('/servicios/CatalogoServicios')}>
                            <MiscellaneousServicesIcon className="icon-large" />
                            <h6 className="mt-2">Servicios</h6>
                        </div>
                    </div>
                    <div className="col-md-3 m-3">
                        <div
                            className="card shadow text-center d-flex flex-column align-items-center justify-content-center btn-card"
                            onClick={() => handleNavigate('/servicios/ListaMantenimientos')}>
                            <EngineeringIcon className="icon-large" />
                            <h6 className="mt-2">Mantenimientos</h6>
                        </div>
                    </div>

                    <div className="col-md-3 m-3">
                        <div
                            className="card shadow text-center d-flex flex-column align-items-center justify-content-center btn-card"
                            onClick={() => handleNavigate('/almacen/ProductoAlmacenTable')}>
                            <WarehouseIcon className="icon-large" />
                            <h6 className="mt-2">Almacen</h6>
                        </div>
                    </div>

                </div>
            </div>

            <style>
                {`
                    .btn-card {
                        cursor: pointer;
                        transition: transform 0.3s, box-shadow 0.3s;
                        background-color: #f2f3f4 ;
                        border-radius: 10px;
                    }

                    .btn-card:hover {
                        transform: scale(1.10);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    }

                    .icon-large {
                        font-size: 3rem;
                        color: #000000;
                        
                    }
                `}
            </style>
        </>
    );

};