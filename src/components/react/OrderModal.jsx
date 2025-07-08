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

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8080/api/bebidas")
        .then((res) => res.json())
        .then((data) => setBebidas(data))
        .catch((err) => console.error("Error cargando bebidas:", err));

      fetch("http://localhost:8080/api/entradas")
        .then((res) => res.json())
        .then((data) => setEntradas(data))
        .catch((err) => console.error("Error cargando entradas:", err));
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBebidaChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const bebida = bebidas.find((b) => b.id === selectedId);
    //entradas api
    // Set the selected bebida or null if not found
    const entrada = entradas.find((e) => e.id === selectedId);
    setSelectedBebida(bebida || null);
    setSelectedEntrada(entrada || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Registrar cliente
      const clienteRes = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      if (!clienteRes.ok) throw new Error("Error al registrar cliente");
      const cliente = await clienteRes.json();

      // 2. Registrar pedido
      const pedidoRes = await fetch("http://localhost:8080/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: "pendiente",
          cliente: { id: cliente.id },
        }),
      });

      if (!pedidoRes.ok) throw new Error("Error al registrar pedido");
      const pedido = await pedidoRes.json();

      // 3. Crear detalles
      const detalles = [];

      detalles.push({
        producto: product.nombre,
        tipo: "Plato",
        cantidad: 1,
        precio: product.precio,
        pedido: { id: pedido.id },
      });

      if (selectedBebida) {
        detalles.push({
          producto: selectedBebida.nombre,
          tipo: "Bebida",
          cantidad: 1,
          precio: selectedBebida.precio,
          pedido: { id: pedido.id },
        });
      }

      if (selectedEntrada) {
        detalles.push({
          producto: selectedEntrada.nombre,
          tipo: "Entrada",
          cantidad: 1,
          precio: selectedEntrada.precio,
          pedido: { id: pedido.id },
        });
      }

      // POST de todos los detalles en paralelo
      await Promise.all(
        detalles.map((detalle) =>
          fetch("http://localhost:8080/api/pedido-detalles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detalle),
          }),
        ),
      );

      alert("✅ Pedido enviado con éxito.");
      onClose();
    } catch (err) {
      console.error("Error al enviar el pedido:", err);
      alert("❌ Error al enviar el pedido. Inténtalo de nuevo.");
    }

    setIsSubmitting(false);
  };

  if (!isOpen || !product) return null;

  const precioBebida = selectedBebida?.precio || 0;
  const precioEntrada = selectedEntrada?.precio || 0;
  const total = product.precio + precioBebida + precioEntrada;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* Encabezado */}
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

        {/* Producto */}
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
              <span className="cantidad">Cantidad: 1</span>
            </div>
          </div>
        </div>

        {/* Bebidas opcionales */}
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
                </div>
              </div>
            )}
          </div>
        )}
        {/* Selector de entrada */}
        {entradas.length > 0 && (
          <div className="modal-bebidas">
            <label htmlFor="entrada-select">
              Entrada adicional (opcional)
              <select
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
            </label>
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
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-form">
          <h3 className="form-titulo">
            <User className="icon orange" />
            Datos del Cliente
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

          {/* Resumen */}
          <div className="modal-resumen">
            <h4>Resumen del Pedido</h4>
            <div className="resumen-item">
              <span>Subtotal:</span>
              <span>S/. {product.precio.toFixed(2)}</span>
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

          {/* Botones */}
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
    </div>
  );
}
