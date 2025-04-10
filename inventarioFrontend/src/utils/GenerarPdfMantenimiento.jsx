import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export const generarPDFMantenimiento = (mantenimiento, formatearDinero) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text("Detalle de Mantenimiento", 14, 20);

    // Información en columnas
    doc.setFontSize(12);
    const startX = 14;
    const colWidth = 90;

    doc.text(`- Vehículo (Inciso): ${mantenimiento.moto_inciso}`, startX, 30);
    doc.text(`- Fecha Inicio: ${new Date(mantenimiento.fecha_inicio).toLocaleDateString("es-MX")}`, startX + colWidth, 30);

    doc.text(`- Odómetro: ${mantenimiento.odometro} km`, startX, 40);
    doc.text(`- Estatus: ${mantenimiento.status === 1 ? "Activo" : "Cancelado"}`, startX + colWidth, 40);

    doc.text(`- Autorizó: ${mantenimiento.nombre_autorizacion || "N/A"}`, startX, 50);
    doc.text(`- Comentario: ${mantenimiento.comentario || "N/A"}`, startX, 60);

    // Solo mostrar fecha de cancelación si el mantenimiento está cancelado
    if (mantenimiento.status === 0 && mantenimiento.fecha_cancelacion) {
        doc.text(`- Fecha Cancelación: ${new Date(mantenimiento.fecha_cancelacion).toLocaleDateString("es-MX")}`, startX + colWidth, 50);
    }

    // Tabla de Servicios
    autoTable(doc, {
        startY: 70,
        head: [["Servicios"]],
        body: mantenimiento.servicios.length > 0
            ? mantenimiento.servicios.map(s => [s.nombre])
            : [["N/A"]],
        theme: "striped"
    });

    // Tabla de Productos con alineación
    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Producto", "Cantidad", "Costo Unitario", "Subtotal"]],
        body: mantenimiento.productos.length > 0
            ? mantenimiento.productos.map(p => [
                p.nombre,
                p.cantidad,
                formatearDinero(p.costo),
                formatearDinero(p.costo * p.cantidad)
            ])
            : [["N/A", "", "", ""]],
        theme: "striped",
        styles: {
            halign: "left"
        },
        columnStyles: {
            1: { halign: "right" }, // Cantidad
            2: { halign: "right" }, // Costo Unitario
            3: { halign: "right" }  // Subtotal
        }
    });

    // Costo total alineado a la derecha
    doc.setFontSize(12);
    const pageWidth = doc.internal.pageSize.getWidth();
    const text = `Costo Total: ${formatearDinero(mantenimiento.costo_total)}`;
    const textWidth = doc.getTextWidth(text);
    doc.text(text, pageWidth - textWidth - 14, doc.lastAutoTable.finalY + 10);

    doc.save(`Mantenimiento-${mantenimiento.id}.pdf`);
};
