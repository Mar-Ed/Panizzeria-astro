import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface DetalleDTO {
  producto: string;
  cantidad: number;
  precio?: number; 
}

interface PedidoDTO {
  id: number;
  estado: string;
  cliente: string;
  total: number;
  fecha: string; 
  detalles: DetalleDTO[];
}


export default function GestionarPedidos() {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [nuevoEstado, setNuevoEstado] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    fetch("http://localhost:8080/api/pedidos/dto", { headers })
      .then((res) => res.json())
      .then(setPedidos)
      .catch((err) => console.error("Error cargando pedidos:", err));
  }, [token]);

  const actualizarEstado = (id: number) => {
    const estado = nuevoEstado[id];
    if (!estado) return;

    fetch(`http://localhost:8080/api/pedidos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    })
      .then(() => {
        setPedidos((prev) =>
          prev.map((pedido) =>
            pedido.id === id ? { ...pedido, estado } : pedido,
          ),
        );
        setNuevoEstado((prev) => ({ ...prev, [id]: "" }));
      })
      .catch((err) => console.error("Error al actualizar estado:", err));
  };

  return (
    <div className="gestion-container">
      <h2>📦 Gestión de Pedidos</h2>

      {pedidos.length === 0 ? (
        <p>No hay pedidos disponibles.</p>
      ) : (
        <div className="lista-pedidos">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido.id}>
              <div><strong>ID:</strong> {pedido.id}</div>
              <div><strong>Cliente:</strong> {pedido.cliente}</div>
              <div><strong>Estado actual:</strong> {pedido.estado}</div>
              <div className="estado-actualizacion">
                <select
                  value={nuevoEstado[pedido.id] || ""}
                  onChange={(e) =>
                    setNuevoEstado({ ...nuevoEstado, [pedido.id]: e.target.value })
                  }
                >
                  <option value="">-- Cambiar estado --</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En preparación">En preparación</option>
                  <option value="En camino">En camino</option>
                  <option value="Enviado">Enviado</option>
                </select>
                <button onClick={() => actualizarEstado(pedido.id)}>
                  Guardar
                </button>
              </div>

              <div><strong>Total:</strong> S/. {pedido.total.toFixed(2)}</div>

              <div className="pedido-detalles">
                <strong>Detalles:</strong>
                <ul>
                  {pedido.detalles.map((detalle, i) => (
                    <li key={i} className="detalle-item">
                      <span>{detalle.cantidad}x {detalle.producto}</span>
                      {detalle.precio && (
                        <span className="precio-derecha">
                          S/. {(detalle.precio).toFixed(2)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .gestion-container {
          margin-top: 2rem;
        }
        .lista-pedidos {
          display: grid;
          gap: 1rem;
        }
        .pedido-card {
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 1rem;
          background-color: #f8f8f8;
        }
        .estado-actualizacion {
          margin: 0.5rem 0;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .estado-actualizacion select {
          flex: 1;
          padding: 0.4rem;
        }
        .estado-actualizacion button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .pedido-detalles ul {
          margin-top: 0.5rem;
          padding-left: 1rem;
          list-style: none;
        }
        .detalle-item {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #ddd;
          padding: 0.3rem 0;
        }
        .precio-derecha {
          color: #444;
        }
      `}</style>
    </div>
  );
}
