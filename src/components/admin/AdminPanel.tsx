import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import GestionarPizzas from "./GestionarPizzas";
import GestionarEntradas from "./GestionarEntradas";
import GestionarBebidas from "./GestionarBebidas";
import GestionarClientes from "./GestionarClientes";
import GestionarPedidos from "./GestionarPedidos";

// Ajustado a la estructura real del DTO
interface Pedido {
  id: number;
  cliente: string; // era { nombre: string }
  total: number;
  fecha: string;
  estado: string;
  detalles: { producto: string; cantidad: number }[]; // era producto: { nombre: string }
}

export default function AdminPanel() {
  const { token, logout } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);

  useEffect(() => {
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    fetch("http://localhost:8080/api/pedidos/dto", { headers })
      .then((res) => res.json())
      .then(setPedidos)
      .catch((err) => console.error("Error cargando pedidos:", err));
  }, [token]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>La Panizzeria - Admin</h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      {!seccionActiva && (
        <section className="orders-section">
          <h2>Pedidos Recientes</h2>
          {pedidos.length === 0 ? (
            <p>No hay pedidos aún.</p>
          ) : (
            <div className="orders-list">
              {[...pedidos]
                .slice(-2)
                .reverse()
                .map((pedido) => (
                  <div className="order-card" key={pedido.id}>
                    <strong>Cliente:</strong> {pedido.cliente}
                    <br />
                    <strong>Estado:</strong> {pedido.estado}
                    <br />
                    <strong>Total:</strong> S/. {pedido.total.toFixed(2)}
                    <br />
                    <strong>Fecha:</strong> {pedido.fecha}
                    <br />
                    <strong>Productos:</strong>{" "}
                    {pedido.detalles
                      .map((d) => `${d.cantidad}x ${d.producto}`)
                      .join(", ")}
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      <section className="crud-section">
        <h2>Gestión del Sistema</h2>

        <div className="crud-cards">
          <div className="crud-card">
            <h3>📦 Pizzas</h3>
            <button onClick={() => setSeccionActiva("pizzas")}>
              Gestionar Pizzas
            </button>
          </div>
          <div className="crud-card">
            <h3>🥟 Entradas</h3>
            <button onClick={() => setSeccionActiva("entradas")}>
              Gestionar Entradas
            </button>
          </div>
          <div className="crud-card">
            <h3>🥤 Bebidas</h3>
            <button onClick={() => setSeccionActiva("bebidas")}>
              Gestionar Bebidas
            </button>
          </div>
          <div className="crud-card">
            <h3>👥 Clientes</h3>
            <button onClick={() => setSeccionActiva("clientes")}>
              Gestionar Clientes
            </button>
          </div>
          <div className="crud-card">
            <h3>🧾 Pedidos</h3>
            <button onClick={() => setSeccionActiva("pedidos")}>
              Gestionar Pedidos
            </button>
          </div>
        </div>
      </section>

      {seccionActiva === "pizzas" && <GestionarPizzas />}
      {seccionActiva === "entradas" && <GestionarEntradas />}
      {seccionActiva === "bebidas" && <GestionarBebidas />}
      {seccionActiva === "clientes" && <GestionarClientes />}
      {seccionActiva === "pedidos" && <GestionarPedidos />}

      <style>{`
        /* admin-panel.css */

:root {
  --color-red: #dc2626;
  --color-red-dark: #b91c1c;
  --color-orange: #f97316;
  --color-blue: #3b82f6;
  --color-green: #10b981;
  --color-purple: #8b5cf6;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background-color: var(--color-gray-100);
  margin: 0;
}

.admin-container {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  border: 1px solid var(--color-gray-200);
}

.admin-header h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-gray-900);
}

.admin-header button {
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, var(--color-red), var(--color-red-dark));
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.admin-header button:hover {
  background: linear-gradient(to right, var(--color-red-dark), #7f1d1d);
}

/* Pedidos Recientes */
.orders-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-gray-900);
}

.orders-list {
  display: grid;
  gap: 1rem;
}

.order-card {
  background-color: white;
  border: 1px solid var(--color-gray-200);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-card strong {
  font-weight: 600;
  color: var(--color-gray-700);
}

/* Gestión */
.crud-section {
  margin-top: 3rem;
}

.crud-section h2 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-gray-900);
  margin-bottom: 1.5rem;
}

.crud-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.crud-card {
  background-color: white;
  width: calc(33.333% - 1rem);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--color-gray-200);
  text-align: center;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.crud-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}

.crud-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-gray-900);
}

.crud-card button {
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, var(--color-red), var(--color-red-dark));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.crud-card button:hover {
  background: linear-gradient(to right, var(--color-red-dark), #7f1d1d);
}

      `}</style>
    </div>
  );
}
