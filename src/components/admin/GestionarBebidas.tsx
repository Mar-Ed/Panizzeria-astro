import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Bebida {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export default function GestionarBebidas() {
  const { token } = useAuth();
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [formBebida, setFormBebida] = useState<Bebida>({
    nombre: "",
    descripcion: "",
    precio: 0,
    imagen: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://proactive-presence-production-6423.up.railway.app/api/bebidas")
      .then((res) => res.json())
      .then(setBebidas)
      .catch((err) => console.error("Error al cargar bebidas:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormBebida({ ...formBebida, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const url = editandoId
      ? `https://proactive-presence-production-6423.up.railway.app/api/bebidas/${editandoId}`
      : "https://proactive-presence-production-6423.up.railway.app/api/bebidas";
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formBebida),
    });

    if (res.ok) {
      const nuevaBebida = await res.json();
      if (editandoId) {
        setBebidas((prev) =>
          prev.map((b) => (b.id === editandoId ? nuevaBebida : b))
        );
      } else {
        setBebidas((prev) => [...prev, nuevaBebida]);
      }
      setFormBebida({ nombre: "", descripcion: "", precio: 0, imagen: "" });
      setEditandoId(null);
    } else {
      console.error("Error al guardar la bebida");
    }
  };

  const handleEditar = (bebida: Bebida) => {
    setFormBebida(bebida);
    setEditandoId(bebida.id ?? null);
    setTimeout(() => {
    document.querySelector(".gestion-container")?.scrollIntoView({ behavior: "smooth" });
  }, 100);
  };

  const handleEliminar = async (id?: number) => {
    if (!id) return;
    const res = await fetch(`http://localhost:8080/api/bebidas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setBebidas((prev) => prev.filter((b) => b.id !== id));
    } else {
      console.error("Error al eliminar bebida");
    }
  };

  return (
    <div className="gestion-container">
      <h2>Gestión de Bebidas</h2>

      <div className="formulario">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formBebida.nombre}
          onChange={handleChange}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formBebida.descripcion}
          onChange={handleChange}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formBebida.precio}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de Imagen"
          value={formBebida.imagen}
          onChange={handleChange}
        />
        <button onClick={handleGuardar}>
          {editandoId ? "Actualizar" : "Agregar"}
        </button>
      </div>

      <div className="lista-productos">
        {bebidas.map((bebida) => (
          <div className="producto" key={bebida.id}>
            <img src={bebida.imagen} alt={bebida.nombre} />
            <div>
              <h4>{bebida.nombre}</h4>
              <p>{bebida.descripcion}</p>
              <span>S/. {bebida.precio.toFixed(2)}</span>
            </div>
            <div className="acciones">
              <button onClick={() => handleEditar(bebida)}>✏️</button>
              <button onClick={() => handleEliminar(bebida.id)}>🗑️</button>
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
          gap: 0.8rem;
          margin-bottom: 2rem;
        }
        .formulario input, .formulario textarea {
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .formulario button {
          background-color: #d33;
          color: white;
          padding: 0.6rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .lista-productos {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .producto {
          display: flex;
          gap: 1rem;
          align-items: center;
          border: 1px solid #eee;
          padding: 1rem;
          border-radius: 6px;
          background: #fdfdfd;
        }
        .producto img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 6px;
        }
        .producto h4 {
          margin: 0;
          color: #007bff;
        }
        .producto span {
          font-weight: bold;
        }
        .acciones {
          margin-left: auto;
          display: flex;
          gap: 0.5rem;
        }
        .acciones button {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
