import { Button } from '@mui/material';
import React from 'react'
import { NavBar } from '../NavBar';

export const EntradasAlmacenModal = () => {
    return (
        <>
            <NavBar />
            {/* Contenedor Principal del Formulario */}
            <div style={{ width: "100vw", height: "75vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", }}>

                <div
                    style={{ backgroundColor: "#eaeded", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", maxWidth: "3000px", width: "90%", }}>

                    <div
                        style={{ backgroundColor: "#1f618d", padding: "15px", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft: "20px" }}>

                        <h5 style={{ color: "white", margin: 0, fontSize: 24 }}>REGISTRAR PRODUCTO</h5>
                    </div>

                    <form style={{ padding: "20px", maxHeight: "300vh" }}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Producto</label>
                                <select
                                    name="producto"
                                    className={`form-control `}
                                >
                                    <option value="" disabled>Selecciona</option>
                                    <option value="0">Inactiva</option>
                                    <option value="1">Activa</option>
                                    <option value="2">Taller</option>
                                    <option value="3">Accidente o Tránsito</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fecha</label>
                                <input type="date" name="fecha" className={`form-control`} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Cantidad</label>
                                <input type="number" name="Cantidad" className={`form-control `} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Costo Unitario</label>
                                <input type="number" name="costo_unitario" className={`form-control `} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Tipo</label>
                                <select
                                    name="tipo"
                                    className={`form-control `}
                                >
                                    <option value="" disabled>Selecciona</option>
                                    <option value="0">Compra</option>
                                    <option value="1">Ajuste</option>
                                    <option value="2">Traspaso</option>
                                    <option value="3">Devolución</option>
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Autorizo</label>
                                <select
                                    name="autorizo"
                                    className={`form-control `}
                                >
                                    <option value="" disabled>Selecciona</option>
                                    <option value="0">Guillermo Humberto Alonso Estrada</option>
                                    <option value="1">Giovanni Ortega</option>
                                    <option value="2">Carlos Eduardo Leal Perez</option>
                                    <option value="3">Accidente o Tránsito</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Proveedor</label>
                                <select
                                    name="proveedor"
                                    className={`form-control `}
                                >
                                    <option value="" disabled>Selecciona</option>
                                    <option value="0">Inactiva</option>
                                    <option value="1">Activa</option>
                                    <option value="2">Taller</option>
                                    <option value="3">Accidente o Tránsito</option>
                                </select>
                            </div>

                        </div>

                        {/* Botones */}
                        <div className="modal-footer ">
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: "#0091ea",
                                    color: "white",
                                    padding: "10px 20px",
                                }}
                            >
                                Guardar
                            </Button>

                            <Button
                                type="button"
                                style={{
                                    backgroundColor: "#85929e",
                                    color: "white",
                                    padding: "10px 20px",
                                    margin: 20
                                }}

                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
