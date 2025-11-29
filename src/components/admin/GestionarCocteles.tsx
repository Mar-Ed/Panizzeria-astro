import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Coctel {
  id?: number;
  nombre: string;
  ingredientes: string;
  precio: number;
  imagen: string;
}

export default function GestionarCocteles() {
  const { token } = useAuth();
  const [cocteles, setCocteles] = useState<Coctel[]>([]);
  const [formCoctel, setFormCoctel] = useState<Coctel>({
    nombre: "",
    ingredientes: "",
    precio: 0,
    imagen: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://proactive-presence-production-6423.up.railway.app/api/cocteles")
      .then((res) => res.json())
      .then(setCocteles)
      .catch((err) => console.error("Error al cargar cocteles:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormCoctel({ ...formCoctel, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const url = editandoId
      ? `https://proactive-presence-production-6423.up.railway.app/api/cocteles/${editandoId}`
      : "https://proactive-presence-production-6423.up.railway.app/api/cocteles";
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formCoctel),
    });

    if (res.ok) {
      const nuevoCoctel = await res.json();
      if (editandoId) {
        setCocteles((prev) =>
          prev.map((c) => (c.id === editandoId ? nuevoCoctel : c))
        );
      } else {
        setCocteles((prev) => [...prev, nuevoCoctel]);
      }
      setFormCoctel({ nombre: "", ingredientes: "", precio: 0, imagen: "" });
      setEditandoId(null);
    } else {
      console.error("Error al guardar el coctel");
    }
  };

  const handleEditar = (coctel: Coctel) => {
    setFormCoctel(coctel);
    setEditandoId(coctel.id ?? null);
  };

  const handleEliminar = async (id?: number) => {
    if (!id) return;
    const res = await fetch(`https://proactive-presence-production-6423.up.railway.app/api/cocteles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setCocteles((prev) => prev.filter((c) => c.id !== id));
    } else {
      console.error("Error al eliminar coctel");
    }
  };

  return (
    <div className="gestion-container">
      <h2>Gestión de Cocteles</h2>

      <div className="formulario">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formCoctel.nombre}
          onChange={handleChange}
        />
        <textarea
          name="ingredientes"
          placeholder="Ingredientes"
          value={formCoctel.ingredientes}
          onChange={handleChange}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formCoctel.precio}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de Imagen"
          value={formCoctel.imagen}
          onChange={handleChange}
        />
        <button onClick={handleGuardar}>
          {editandoId ? "Actualizar" : "Agregar"}
        </button>
      </div>

      <div className="lista-productos">
        {cocteles.map((coctel) => (
          <div className="producto" key={coctel.id}>
            <img src={coctel.imagen} alt={coctel.nombre} />
            <div>
              <h4>{coctel.nombre}</h4>
              <p>{coctel.ingredientes}</p>
              <span>S/. {coctel.precio.toFixed(2)}</span>
            </div>
            <div className="acciones">
              <button onClick={() => handleEditar(coctel)}>✏️</button>
              <button onClick={() => handleEliminar(coctel.id)}>🗑️</button>
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
          background-color: #28a745;
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
          color: #28a745;
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
