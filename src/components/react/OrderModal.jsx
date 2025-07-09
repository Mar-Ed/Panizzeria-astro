import { useEffect, useState } from "react";
import { X, ShoppingBag, User, Phone, Mail } from "lucide-react";
import "../../css/OrderModal.css";

export default function OrderModal({ isOpen, onClose, product }) {
  const [customerData, setCustomerData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bebidas, setBebidas] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [selectedBebida, setSelectedBebida] = useState(null);
  const [selectedEntrada, setSelectedEntrada] = useState(null);

  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [cantidadBebida, setCantidadBebida] = useState(1);
  const [cantidadEntrada, setCantidadEntrada] = useState(1);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [resumenPedido, setResumenPedido] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCantidadProducto(1);
      setCantidadBebida(1);
      setCantidadEntrada(1);
      fetch("http://localhost:8080/api/bebidas")
        .then((res) => res.json())
        .then(setBebidas)
        .catch((err) => console.error("Error cargando bebidas:", err));

      fetch("http://localhost:8080/api/entradas")
        .then((res) => res.json())
        .then(setEntradas)
        .catch((err) => console.error("Error cargando entradas:", err));
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const clienteRes = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      if (!clienteRes.ok) throw new Error("Error al registrar cliente");
      const cliente = await clienteRes.json();
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const pedidoRes = await fetch("http://localhost:8080/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: "pendiente",
          fecha: fechaFormateada,
          cliente: { id: cliente.id },
        }),
      });

      if (!pedidoRes.ok) throw new Error("Error al registrar pedido");
      const pedido = await pedidoRes.json();

      const detalles = [];

      detalles.push({
        producto: product.nombre,
        tipo: "Plato",
        cantidad: cantidadProducto,
        precio: product.precio * cantidadProducto,
        pedido: { id: pedido.id },
      });

      if (selectedBebida) {
        detalles.push({
          producto: selectedBebida.nombre,
          tipo: "Bebida",
          cantidad: cantidadBebida,
          precio: selectedBebida.precio * cantidadBebida,
          pedido: { id: pedido.id },
        });
      }

      if (selectedEntrada) {
        detalles.push({
          producto: selectedEntrada.nombre,
          tipo: "Entrada",
          cantidad: cantidadEntrada,
          precio: selectedEntrada.precio * cantidadEntrada,
          pedido: { id: pedido.id },
        });
      }

      await Promise.all(
        detalles.map((detalle) =>
          fetch("http://localhost:8080/api/pedido-detalles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detalle),
          }),
        ),
      );

      setResumenPedido({
        cliente: customerData,
        productos: detalles,
        total: total.toFixed(2),
        estado: "pendiente",
        fecha: fechaFormateada,
      });
      setShowSummaryModal(true);
    } catch (err) {
      console.error("Error al enviar el pedido:", err);
      alert("❌ Error al enviar el pedido. Inténtalo de nuevo.");
    }

    setIsSubmitting(false);
  };

  if (!isOpen || !product) return null;

  const precioBebida = (selectedBebida?.precio || 0) * cantidadBebida;
  const precioEntrada = (selectedEntrada?.precio || 0) * cantidadEntrada;
  const total =
    product.precio * cantidadProducto + precioBebida + precioEntrada;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Resumen del Pedido
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        <div className="modal-product">
          <img src={product.imagen} alt={product.nombre} />
          <div className="modal-product-info">
            <h3>{product.nombre}</h3>
            {product.tamaño && (
              <p>
                <strong>Tamaño:</strong> {product.tamaño}
              </p>
            )}
            <p>{product.ingredientes || product.descripcion}</p>
            <div className="precio-cantidad">
              <span className="precio">S/. {product.precio}</span>
              <div className="cantidad-control">
                <span>Cantidad:</span>
                <button
                  onClick={() => setCantidadProducto((c) => Math.max(1, c - 1))}
                >
                  −
                </button>
                <span>{cantidadProducto}</span>
                <button onClick={() => setCantidadProducto((c) => c + 1)}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {bebidas.length > 0 && (
          <div className="modal-bebidas">
            <label htmlFor="bebida-select">Acompaña con una bebida:</label>
            <select
              id="bebida-select"
              onChange={(e) => {
                const bebidaSeleccionada = bebidas.find(
                  (b) => b.id === parseInt(e.target.value),
                );
                setSelectedBebida(bebidaSeleccionada || null);
              }}
              value={selectedBebida?.id || ""}
            >
              <option value="">-- Sin bebida --</option>
              {bebidas.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre} - S/. {b.precio.toFixed(2)}
                </option>
              ))}
            </select>

            {selectedBebida && (
              <div className="bebida-detalle">
                <img src={selectedBebida.imagen} alt={selectedBebida.nombre} />
                <div>
                  <strong>{selectedBebida.nombre}</strong>
                  <p>{selectedBebida.descripcion}</p>
                  <span className="precio">
                    S/. {selectedBebida.precio.toFixed(2)}
                  </span>
                  <div className="cantidad-control">
                    <span>Cantidad:</span>
                    <button
                      onClick={() =>
                        setCantidadBebida((c) => Math.max(1, c - 1))
                      }
                    >
                      −
                    </button>
                    <span>{cantidadBebida}</span>
                    <button onClick={() => setCantidadBebida((c) => c + 1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {entradas.length > 0 && (
          <div className="modal-bebidas">
            <label htmlFor="entrada-select">Entrada adicional (opcional)</label>
            <select
              id="entrada-select"
              onChange={(e) => {
                const entradaSeleccionada = entradas.find(
                  (b) => b.id === parseInt(e.target.value),
                );
                setSelectedEntrada(entradaSeleccionada || null);
              }}
              value={selectedEntrada?.id || ""}
            >
              <option value="">-- Selecciona una entrada --</option>
              {entradas.map((entrada) => (
                <option key={entrada.id} value={entrada.id}>
                  🍽️ {entrada.nombre} - {entrada.descripcion} - S/.{" "}
                  {entrada.precio}
                </option>
              ))}
            </select>

            {selectedEntrada && (
              <div className="bebida-detalle">
                <img
                  src={selectedEntrada.imagen}
                  alt={selectedEntrada.nombre}
                />
                <div>
                  <strong>{selectedEntrada.nombre}</strong>
                  <p>{selectedEntrada.descripcion}</p>
                  <span className="precio">
                    S/. {selectedEntrada.precio.toFixed(2)}
                  </span>
                  <div className="cantidad-control">
                    <span>Cantidad:</span>
                    <button
                      onClick={() =>
                        setCantidadEntrada((c) => Math.max(1, c - 1))
                      }
                    >
                      −
                    </button>
                    <span>{cantidadEntrada}</span>
                    <button onClick={() => setCantidadEntrada((c) => c + 1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <h3 className="form-titulo">
            <User className="icon orange" /> Datos del Cliente
          </h3>

          <label>
            Nombre completo
            <input
              type="text"
              name="nombre"
              value={customerData.nombre}
              onChange={handleInputChange}
              required
              placeholder="Tu nombre completo"
            />
          </label>

          <label>
            Dirección de entrega
            <textarea
              name="direccion"
              value={customerData.direccion}
              onChange={handleInputChange}
              required
              placeholder="Av. Principal 123, referencia..."
            />
          </label>

          <div className="grid-dos">
            <label>
              <Phone className="icon-left" />
              <input
                type="tel"
                name="telefono"
                value={customerData.telefono}
                onChange={handleInputChange}
                required
                placeholder="999 123 456"
              />
            </label>
            <label>
              <Mail className="icon-left" />
              <input
                type="email"
                name="correo"
                value={customerData.correo}
                onChange={handleInputChange}
                required
                placeholder="correo@ejemplo.com"
              />
            </label>
          </div>

          <div className="modal-resumen">
            <h4>Resumen del Pedido</h4>
            <div className="resumen-item">
              <span>Subtotal:</span>
              <span>S/. {(product.precio * cantidadProducto).toFixed(2)}</span>
            </div>
            {selectedBebida && (
              <div className="resumen-item">
                <span>Bebida:</span>
                <span>S/. {precioBebida.toFixed(2)}</span>
              </div>
            )}
            {selectedEntrada && (
              <div className="resumen-item">
                <span>Entrada:</span>
                <span>S/. {precioEntrada.toFixed(2)}</span>
              </div>
            )}
            <div className="resumen-item">
              <span>Delivery:</span>
              <span>Free</span>
            </div>
            <div className="resumen-total">
              <strong>Total:</strong>
              <strong>S/. {total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="form-buttons">
            <button type="button" className="cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="confirmar" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
            </button>
          </div>
        </form>
      </div>
      {showSummaryModal && resumenPedido && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="text-2xl font-bold text-gray-800">
                Pedido Confirmado
              </h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowSummaryModal(false);
                  onClose(); // cerrar todo
                }}
              >
                <X className="icon" />
              </button>
            </div>

            <div className="modal-form">
              <p className="resumen-subtitulo">
                📱 Nos comunicaremos a tu WSP para la entrega de tu pedido!
              </p>
              <h3>📄 Detalles del Pedido</h3>
              <p>
                <strong>Estado:</strong> {resumenPedido.estado}
              </p>
              <p>
                <strong>Fecha:</strong> {resumenPedido.fecha}
              </p>

              <h4 style={{ marginTop: "1rem" }}>🧍 Cliente</h4>
              <p>
                <strong>Nombre:</strong> {resumenPedido.cliente.nombre}
              </p>
              <p>
                <strong>Dirección:</strong> {resumenPedido.cliente.direccion}
              </p>
              <p>
                <strong>Teléfono:</strong> {resumenPedido.cliente.telefono}
              </p>
              <p>
                <strong>Email:</strong> {resumenPedido.cliente.correo}
              </p>

              <h4 style={{ marginTop: "1rem" }}>🍽️ Productos</h4>
              <ul style={{ paddingLeft: "1rem" }}>
                {resumenPedido.productos.map((p, idx) => (
                  <li key={idx} style={{ marginBottom: "0.5rem" }}>
                    <strong>{p.tipo}</strong>: {p.producto} x {p.cantidad} - S/.{" "}
                    {p.precio.toFixed(2)}
                  </li>
                ))}
              </ul>

              <div className="resumen-total" style={{ marginTop: "1rem" }}>
                <strong>Total pagado:</strong>
                <strong>S/. {resumenPedido.total}</strong>
              </div>

              <button
                className="confirmar"
                style={{ marginTop: "1.5rem" }}
                onClick={() => {
                  setShowSummaryModal(false);
                  onClose();
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
