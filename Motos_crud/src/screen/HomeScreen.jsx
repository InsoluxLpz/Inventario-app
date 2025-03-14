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
        </>
    );

};