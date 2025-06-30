import { useAuth } from '../../context/AuthContext';

export default function AdminPanel() {
  const { token, logout } = useAuth();

  if (!token) {
    return <p>No tienes acceso. Por favor, <a href="/login">inicia sesión</a>.</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel de Administración</h1>
      <button onClick={logout} style={{ marginBottom: '1rem' }}>Cerrar sesión</button>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <a href="/admin/entradas">Gestionar Entradas</a>
        <a href="/admin/pizzas">Gestionar Pizzas</a>
        <a href="/admin/cocteles">Gestionar Cocteles</a>
        <a href="/admin/bebidas">Gestionar Bebidas</a>
        <a href="/admin/pedidos">Ver Pedidos</a>
      </nav>

      <p style={{ marginTop: '2rem' }}>Aquí puedes administrar los productos y pedidos de la Panizzería.</p>
    </div>
  );
}
