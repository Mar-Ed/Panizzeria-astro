import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Pedido {
  id: number;
  cliente: { nombre: string };
  total: number;
  estado: string;
  detalles: { producto: { nombre: string }, cantidad: number }[];
}

export default function AdminPanel() {
  const { token, logout } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8080/api/admin/pedidos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then(setPedidos)
        .catch((err) => console.error("Error cargando pedidos:", err));
    }
  }, [token]);

  // if (!token) {
  //   return (
  //     <div className="no-access">
  //       <p>No tienes acceso. Por favor, <a href="/login">inicia sesión</a>.</p>
  //       <style>{`
  //         .no-access {
  //           text-align: center;
  //           margin-top: 4rem;
  //           font-family: sans-serif;
  //           color: #333;
  //         }
  //         a {
  //           color: #d33;
  //           text-decoration: underline;
  //         }
  //       `}</style>
  //     </div>
  //   );
  // }
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>La Panizzeria</h1>
        <button onClick={logout}>Cerrar Sesión</button>
      </header>

      <section className="orders-section">
        <h2>Pedidos Recientes</h2>
        {pedidos.length === 0 ? (
          <p>No hay pedidos aún.</p>
        ) : (
          <div className="orders-list">
            {pedidos.map((pedido) => (
              <div className="order-card" key={pedido.id}>
                <strong>Cliente:</strong> {pedido.cliente.nombre}<br />
                <strong>Estado:</strong> {pedido.estado}<br />
                <strong>Total:</strong> S/. {pedido.total.toFixed(2)}<br />
                <strong>Productos:</strong> {pedido.detalles.map(d => `${d.cantidad}x ${d.producto.nombre}`).join(", ")}
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .admin-container {
          max-width: 800px;
          margin: 0 auto;
          font-family: sans-serif;
          padding: 2rem;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ccc;
          padding-bottom: 1rem;
        }
        .admin-header h1 {
          margin: 0;
          color: #d33;
        }
        .admin-header button {
          background-color: #d33;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
        }
        .orders-section {
          margin-top: 2rem;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .order-card {
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 6px;
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}
