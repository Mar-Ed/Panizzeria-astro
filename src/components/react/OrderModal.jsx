import { useEffect, useState } from "react";
import { X, ShoppingBag, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useStore } from "@nanostores/react";
import { $cart, clearCart } from "../../store/cartStore";
import "../../css/OrderModal.css";

// Import local data
import bebidasData from "../../data/bebidas.json";
import entradasData from "../../data/entradas.json";

export default function OrderModal({ isOpen, onClose }) {
  const cart = useStore($cart);
  const [customerData, setCustomerData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bebidas] = useState(bebidasData);
  const [entradas] = useState(entradasData);
  const [selectedBebida, setSelectedBebida] = useState(null);
  const [selectedEntrada, setSelectedEntrada] = useState(null);

  const [cantidadBebida, setCantidadBebida] = useState(1);
  const [cantidadEntrada, setCantidadEntrada] = useState(1);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [resumenPedido, setResumenPedido] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCantidadBebida(1);
      setCantidadEntrada(1);
      setSelectedBebida(null);
      setSelectedEntrada(null);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const total =
    cartTotal + 
    ((selectedBebida?.precios || selectedBebida?.precio || 0) * cantidadBebida) + 
    ((selectedEntrada?.precio || 0) * cantidadEntrada);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulating API call delay for a professional feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const detalles = [];
      
      // Add cart items
      cart.forEach(item => {
        detalles.push({
          producto: item.nombre,
          tipo: item.tamaño || "Plato",
          cantidad: item.cantidad,
          precio: item.precio * item.cantidad,
        });
      });

      if (selectedBebida) {
        detalles.push({
          producto: selectedBebida.nombre,
          tipo: "Bebida",
          cantidad: cantidadBebida,
          precio: (selectedBebida.precios || selectedBebida.precio || 0) * cantidadBebida,
        });
      }

      if (selectedEntrada) {
        detalles.push({
          producto: selectedEntrada.nombre,
          tipo: "Entrada",
          cantidad: cantidadEntrada,
          precio: selectedEntrada.precio * cantidadEntrada,
        });
      }

      const totalPedido = total.toFixed(2);

      // --- WhatsApp Message Construction ---
      const phoneNumber = "51970338010"; // User's number
      let message = `*🍕 NUEVO PEDIDO - LA PANIZZERIA*%0A%0A`;
      message += `*Cliente:* ${customerData.nombre}%0A`;
      message += `*Dirección:* ${customerData.direccion}%0A`;
      message += `*Teléfono:* ${customerData.telefono}%0A`;
      message += `*Email:* ${customerData.correo}%0A%0A`;
      message += `*🛒 PRODUCTOS:*%0A`;
      
      detalles.forEach(d => {
        message += `• ${d.producto} (${d.tipo}) x${d.cantidad} - S/. ${d.precio.toFixed(2)}%0A`;
      });

      message += `%0A*TOTAL A PAGAR: S/. ${totalPedido}*%0A%0A`;
      message += `_Pedido realizado el ${fechaFormateada}_`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      setResumenPedido({
        cliente: customerData,
        productos: detalles,
        total: totalPedido,
        estado: "Enviado a WhatsApp",
        fecha: fechaFormateada,
      });

      // Opening WhatsApp
      window.open(whatsappUrl, '_blank');
      
      setShowSummaryModal(true);
      clearCart(); // Clear cart after success
    } catch (err) {
      console.error("Error simulation:", err);
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box" data-lenis-prevent>
        <div className="modal-header">
          <div className="modal-title">
            <ShoppingBag />
            <h2>Finalizar Compra</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        <div className="modal-items-summary" style={{ padding: '0 2.5rem' }}>
          <h3 style={{ margin: '1.5rem 0 1rem', fontFamily: 'var(--second-font)' }}>Tus Productos:</h3>
          {cart.map((item, idx) => (
            <div key={idx} className="modal-product" style={{ margin: '0.5rem 0', padding: '1.5rem' }}>
                <img src={item.imagen} alt={item.nombre} style={{ width: '80px', height: '80px' }} />
                <div className="modal-product-info">
                    <h3>{item.nombre}</h3>
                    <p>{item.tamaño}</p>
                    <div className="precio-cantidad">
                        <span className="precio">S/. {(item.precio * item.cantidad).toFixed(2)}</span>
                        <span>x{item.cantidad}</span>
                    </div>
                </div>
            </div>
          ))}
        </div>

        {bebidas && bebidas.length > 0 && (
          <div className="modal-bebidas">
            <label htmlFor="bebida-select">Acompaña con una bebida:</label>
            <select
              id="bebida-select"
              onChange={(e) => {
                const bebidaSeleccionada = bebidas.find(
                  (b) => `${b.nombre}-${b.tipo}` === e.target.value,
                );
                setSelectedBebida(bebidaSeleccionada || null);
              }}
              value={selectedBebida ? `${selectedBebida.nombre}-${selectedBebida.tipo}` : ""}
            >
              <option value="">-- Sin bebida --</option>
              {bebidas.map((b, idx) => (
                <option key={`${b.nombre}-${idx}`} value={`${b.nombre}-${b.tipo}`}>
                  {b.nombre} ({b.tipo}) - S/. {(b.precios || b.precio || 0).toFixed(2)}
                </option>
              ))}
            </select>

            {selectedBebida && (
              <div className="bebida-detalle">
                <img src={selectedBebida.imagen} alt={selectedBebida.nombre} />
                <div>
                  <strong>{selectedBebida.nombre} ({selectedBebida.tipo})</strong>
                  <div className="precio-cantidad">
                    <span className="precio">
                      S/. {(selectedBebida.precios || selectedBebida.precio || 0).toFixed(2)}
                    </span>
                    <div className="cantidad-control">
                      <button
                        onClick={() =>
                          setCantidadBebida((c) => Math.max(1, c - 1))
                        }
                        type="button"
                      >
                        −
                      </button>
                      <span>{cantidadBebida}</span>
                      <button onClick={() => setCantidadBebida((c) => c + 1)} type="button">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {entradas && entradas.length > 0 && (
          <div className="modal-bebidas">
            <label htmlFor="entrada-select">Entrada adicional (opcional)</label>
            <select
              id="entrada-select"
              onChange={(e) => {
                const entradaSeleccionada = entradas.find(
                  (b) => b.nombre === e.target.value,
                );
                setSelectedEntrada(entradaSeleccionada || null);
              }}
              value={selectedEntrada?.nombre || ""}
            >
              <option value="">-- Selecciona una entrada --</option>
              {entradas.map((entrada, idx) => (
                <option key={`${entrada.nombre}-${idx}`} value={entrada.nombre}>
                  🍽️ {entrada.nombre} - S/. {entrada.precio}
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
                  <p>{selectedEntrada.ingredientes}</p>
                  <div className="precio-cantidad">
                    <span className="precio">
                      S/. {selectedEntrada.precio.toFixed(2)}
                    </span>
                    <div className="cantidad-control">
                      <button
                        onClick={() =>
                          setCantidadEntrada((c) => Math.max(1, c - 1))
                        }
                        type="button"
                      >
                        −
                      </button>
                      <span>{cantidadEntrada}</span>
                      <button onClick={() => setCantidadEntrada((c) => c + 1)} type="button">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <h3 className="form-titulo">
            <User /> Datos del Cliente
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
              <span>Subtotal Productos:</span>
              <span>S/. {cartTotal.toFixed(2)}</span>
            </div>
            {selectedBebida && (
              <div className="resumen-item">
                <span>Bebida ({selectedBebida.nombre}):</span>
                <span>S/. {((selectedBebida.precios || selectedBebida.precio || 0) * cantidadBebida).toFixed(2)}</span>
              </div>
            )}
            {selectedEntrada && (
              <div className="resumen-item">
                <span>Entrada ({selectedEntrada.nombre}):</span>
                <span>S/. {(selectedEntrada.precio * cantidadEntrada).toFixed(2)}</span>
              </div>
            )}
            <div className="resumen-item">
              <span>Delivery:</span>
              <span>Gratis</span>
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
          <div className="modal-box" data-lenis-prevent>
            <div className="modal-header">
              <div className="modal-title">
                <CheckCircle2 style={{ color: 'var(--first-color)' }} />
                <h2>Pedido Confirmado</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setShowSummaryModal(false);
                  onClose(); 
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

