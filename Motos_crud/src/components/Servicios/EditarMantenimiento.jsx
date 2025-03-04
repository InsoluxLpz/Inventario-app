import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '@mui/material';
import { obtenerMotos } from '../../api/motosApi';
import { ActualizarMantenimiento, ObtenerServicios } from '../../api/ServiciosApi';


export const EditarMantenimiento = ({ modalOpen, onClose, mantenimiento }) => {
    if (!modalOpen || !mantenimiento) return null;



    return (
        <>
            <div className="modal-backdrop">
                <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document" style={{ maxWidth: "60vw", marginTop: 90 }}>
                        <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
                            <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
                                <h5 className="modal-title" style={{ color: 'white' }}>Actualizar Servicio</h5>
                            </div>

                            {/* Formulario */}
                            <form style={{ marginTop: 3 }}>
                                <div className="row">
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label">Fecha de inicio</label>
                                        <input name="fecha_inicio" type='date' className={`form-control form-control-sm `} />
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label className="form-label">Vehiculo</label>
                                        <Select
                                            name="vehiculo"
                                            placeholder="SELECCIONA"
                                        />

                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label className="form-label">Odómetro/Horómetro</label>
                                        <input type="text" name="odometro" className={`form-control form-control-sm`} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-10 mb-2">
                                        <label className="form-label">Servicio(s)</label>
                                        <Select
                                            name="servicio"
                                            isMulti
                                            placeholder="SELECCIONA"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "45px",
                                                    height: "45px",
                                                }),
                                                menuList: (provided) => ({
                                                    ...provided,
                                                    maxHeight: "200px",
                                                    overflowY: "auto",
                                                }),
                                            }}
                                        />

                                    </div>
                                </div>

                                <hr />
                                {/* Botón para agregar refacciones */}
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="contained" color="primary" size="small" >
                                        Agregar Refacción
                                    </Button>
                                </div>

                                <h6 className="mb-2">Desglose de Partes/Refacciones de Almacén</h6>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Costo Unitario</th>
                                                <th>Cantidad</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr >
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Costo Total</label>
                                        <input type="number" name="costo_refacciones" className={`form-control form-control-sm`} readOnly />
                                    </div>
                                </div>

                                <div className="col-md-12 mb-2">
                                    <label className="form-label">Comentario</label>
                                    <textarea name="comentario" className={`form-control form-control-sm`} />
                                </div>

                                <div className="modal-footer">
                                    <Button type="submit" style={{ backgroundColor: "#f1c40f", color: "white" }}>
                                        Guardar
                                    </Button>

                                    <Button type="button" style={{ backgroundColor: "#7f8c8d", color: "white", marginLeft: 7 }} >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
