import React, { useState } from 'react'
import { Button } from '@mui/material';
import { NavBar } from '../NavBar'
import Select from "react-select";
import { useNavigate } from 'react-router';

export const RealizarMantenimiento = () => {

    const handleNavigate = (path) => navigate(path);
    const navigate = useNavigate();

    return (
        <>
            <NavBar />
            <div
                className="container-fluid p-4"
                style={{
                    maxWidth: "1850px",
                    backgroundColor: "#f4f6f7",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                    margin: "1px auto",
                    borderRadius: "8px",
                }}
            >
                <form>
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className="form-label small">Fecha de inicio</label>
                            <input type="date" name="fecha_inicio" className="form-control form-control-sm" />
                        </div>

                        <div className="col-md-4 mb-2">
                            <label className="form-label small">Vehículo</label>
                            <select name="vehiculo" className="form-control form-control-sm">
                                <option value="" disabled>SELECCIONA</option>
                                <option>FRENOS</option>
                                <option>LLANTAS</option>
                                <option>ACEITE</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label small">Odómetro/Horómetro</label>
                            <input type="text" name="odometro" className="form-control form-control-sm" />
                        </div>
                    </div>

                    {/* Segunda fila */}
                    <div className="row">
                        <div className="col-md-10 mb-2">
                            <label className="form-label small">Servicio(s)</label>
                            <select name="servicio" className="form-control form-control-sm">
                                <option value="" disabled>SELECCIONA</option>
                                <option>FRENOS</option>
                                <option>LLANTAS</option>
                                <option>ACEITE</option>
                            </select>
                        </div>
                    </div>

                    {/* Línea divisoria */}
                    <hr />

                    <h6 className="mb-2">Desglose de Partes/Refacciones de Almacén</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="bg-light">
                                <tr>
                                    <th>Cantidad</th>
                                    <th>Artículo</th>
                                    <th>Costo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2</td>
                                    <td>BUJÍAS TIPO ESTÁNDAR</td>
                                    <td>$50.00</td>
                                    <td>
                                        <Button variant="contained" color="error" size="small">X</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>FILTRO DE ACEITE</td>
                                    <td>$30.00</td>
                                    <td>
                                        <Button variant="contained" color="error" size="small">X</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Botón para agregar refacciones */}
                    <div className="d-flex justify-content-start mb-3">
                        <Button variant="contained" color="primary" size="small">
                            Agregar Refacción
                        </Button>
                    </div>

                    {/* Totales */}
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <label className="form-label small">Costo Partes/Refacciones</label>
                            <input type="text" name="costo_partes" className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-6 mb-2">
                            <label className="form-label small">Costo Total</label>
                            <input type="text" name="costo_total" className="form-control form-control-sm" />
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div className="col-md-12 mb-2">
                        <label className="form-label small">Comentario</label>
                        <textarea name="comentario" className="form-control form-control-sm" />
                    </div>

                    {/* Botones de acción */}
                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="contained" color="secondary" size="small" style={{ marginRight: "10px" }} onClick={() => handleNavigate("/servicios/ListaMantenimientos")}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" size="small">
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};