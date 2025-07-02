import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface PedidoDetalle {
  id: number;
  producto: string;
  tipo: string;
  cantidad: number;
  precio: number;
}

interface Pedido {
  id: number;
  estado: string;
  fecha: string;
  cliente: {
    id: number;
    nombre: string;
  };
  detalles: PedidoDetalle[];
}

export default function GestionarPedidos() {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [nuevoEstado, setNuevoEstado] = useState<{ [id: number]: string }>({});

  // Cargar pedidos al montar el componente
  useEffect(() => {
    if (token) {
      fetch("http://localhost:8080/api/pedidos/dto", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setPedidos)
        .catch((err) => console.error("Error al cargar pedidos:", err));
    }
  }, [token]);

  const actualizarEstado = (id: number) => {
    const estado = nuevoEstado[id];
    if (!estado) return;

    fetch(`http://localhost:8080/api/pedidos/dto/${id}`, {
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
            pedido.id === id ? { ...pedido, estado } : pedido
          )
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
              <strong>ID:</strong> {pedido.id}<br />
              <strong>Cliente:</strong> {pedido.cliente.nombre}<br />
              <strong>Fecha:</strong>{" "}
              {new Date(pedido.fecha).toLocaleString()}<br />
              <strong>Estado:</strong> {pedido.estado}

              <div className="estado-actualizacion">
                <input
                  type="text"
                  placeholder="Nuevo estado"
                  value={nuevoEstado[pedido.id] || ""}
                  onChange={(e) =>
                    setNuevoEstado({ ...nuevoEstado, [pedido.id]: e.target.value })
                  }
                />
                <button onClick={() => actualizarEstado(pedido.id)}>
                  Guardar
                </button>
              </div>

              <div className="pedido-detalles">
                <strong>Detalles:</strong>
                <ul>
                  {pedido.detalles.map((detalle) => (
                    <li key={detalle.id}>
                      {detalle.cantidad}x {detalle.producto} ({detalle.tipo}) — S/.{" "}
                      {(detalle.precio * detalle.cantidad).toFixed(2)}
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
          margin-top: 0.5rem;
          display: flex;
          gap: 0.5rem;
        }
        .estado-actualizacion input {
          flex: 1;
          padding: 0.4rem;
        }
        .estado-actualizacion button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .pedido-detalles ul {
          margin-top: 0.5rem;
          padding-left: 1rem;
          list-style: disc;
        }
      `}</style>
    </div>
  );
}
