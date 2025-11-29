import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

export default function GestionarClientes() {
  const { token } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formCliente, setFormCliente] = useState<Omit<Cliente, "id">>({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // 🔁 Siempre cargar clientes al montar el componente
  useEffect(() => {
    console.log("Token:", token);
    fetch("https://proactive-presence-production-6423.up.railway.app/api/clientes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setClientes)
      .catch((err) => console.error("Error cargando clientes:", err));
  }, []); // Sin dependencias

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormCliente({ ...formCliente, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    const method = editandoId ? "PUT" : "POST";
    const url = editandoId
      ? `https://proactive-presence-production-6423.up.railway.app/api/clientes/${editandoId}`
      : "https://proactive-presence-production-6423.up.railway.app/api/clientes";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formCliente),
    })
      .then((res) => res.json())
      .then((nuevoCliente) => {
        if (editandoId) {
          setClientes((prev) =>
            prev.map((c) => (c.id === editandoId ? nuevoCliente : c))
          );
        } else {
          setClientes((prev) => [...prev, nuevoCliente]);
        }
        setFormCliente({ nombre: "", correo: "", telefono: "", direccion: "" });
        setEditandoId(null);
      })
      .catch((err) => console.error("Error guardando cliente:", err));
  };

  const handleEditar = (cliente: Cliente) => {
    setFormCliente({
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    setEditandoId(cliente.id);
    setTimeout(() => {
    document.querySelector(".gestion-container")?.scrollIntoView({ behavior: "smooth" });
  }, 100);
  };

  const handleEliminar = (id: number) => {
    if (!confirm("¿Eliminar cliente permanentemente?")) return;
    fetch(`http://localhost:8080/api/clientes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => setClientes(clientes.filter((c) => c.id !== id)))
      .catch((err) => console.error("Error eliminando cliente:", err));
  };

  return (
    <div className="gestion-container">
      <h2>Gestión de Clientes</h2>

      <div className="formulario">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formCliente.nombre}
          onChange={handleChange}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formCliente.correo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formCliente.telefono}
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formCliente.direccion}
          onChange={handleChange}
        />
        <button onClick={handleGuardar}>
          {editandoId ? "Actualizar" : "Agregar"} Cliente
        </button>
      </div>

      <div className="lista-clientes">
        {clientes.map((cliente) => (
          <div className="cliente-card" key={cliente.id}>
            <strong>{cliente.nombre}</strong> ({cliente.correo})<br />
            📞 {cliente.telefono} | 📍 {cliente.direccion}
            <div className="acciones">
              <button onClick={() => handleEditar(cliente)}>✏️</button>
              <button onClick={() => handleEliminar(cliente.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .gestion-container {
          margin-top: 2rem;
        }
        .formulario {
        display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .formulario input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .formulario button {
          grid-column: span 2;
          background-color: #d33;
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .lista-clientes {
          display: grid;
          gap: 1rem;
        }
        .cliente-card {
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 1rem;
          background-color: #f8f8f8;
        }
        .acciones {
          margin-top: 0.5rem;
        }
        .acciones button {
          margin-right: 0.5rem;
          background-color: #d33;
          color: white;
          border: none;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
