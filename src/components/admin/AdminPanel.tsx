import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import GestionarPizzas from "./GestionarPizzas";
import GestionarEntradas from "./GestionarEntradas";
import GestionarBebidas from "./GestionarBebidas";
import GestionarCocteles from "./GestionarCocteles";
import GestionarClientes from "./GestionarClientes";
import GestionarPedidos from "./GestionarPedidos";

// Ajustado a la estructura real del DTO
interface Pedido {
  id: number;
  cliente: string; // era { nombre: string }
  total: number;
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
              {pedidos.map((pedido) => (
                <div className="order-card" key={pedido.id}>
                  <strong>Cliente:</strong> {pedido.cliente}
                  <br />
                  <strong>Estado:</strong> {pedido.estado}
                  <br />
                  <strong>Total:</strong> S/. {pedido.total.toFixed(2)}
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
            <h3>🍹 Cocteles</h3>
            <button onClick={() => setSeccionActiva("cocteles")}>
              Gestionar Cocteles
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
      {seccionActiva === "cocteles" && <GestionarCocteles />}
      {seccionActiva === "clientes" && <GestionarClientes />}
      {seccionActiva === "pedidos" && <GestionarPedidos />}

      <style>{`
        .admin-container {
          max-width: 1024px;
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
        .crud-section {
          margin-top: 3rem;
        }
        .crud-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .crud-card {
          flex: 1 1 30%;
          border: 1px solid #ccc;
          padding: 1rem;
          border-radius: 6px;
          background-color: #fff8f8;
          text-align: center;
        }
        .crud-card h3 {
          margin-bottom: 0.5rem;
        }
        .crud-card button {
          padding: 0.5rem 1rem;
          border: none;
          background-color: #d33;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
