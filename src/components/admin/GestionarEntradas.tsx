import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Entrada {
  id?: number;
  nombre: string;
  ingredientes: string;
  precio: number;
  imagen: string;
}

export default function GestionarEntradas() {
  const { token } = useAuth();
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [formEntrada, setFormEntrada] = useState<Entrada>({
    nombre: "",
    ingredientes: "",
    precio: 0,
    imagen: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/entradas")
      .then((res) => res.json())
      .then(setEntradas)
      .catch((err) => console.error("Error cargando entradas:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormEntrada({ ...formEntrada, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const url = editandoId
      ? `http://localhost:8080/api/entradas/${editandoId}`
      : "http://localhost:8080/api/entradas";
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formEntrada),
    });

    if (res.ok) {
      const nuevaEntrada = await res.json();
      if (editandoId) {
        setEntradas((prev) =>
          prev.map((p) => (p.id === editandoId ? nuevaEntrada : p))
        );
      } else {
        setEntradas((prev) => [...prev, nuevaEntrada]);
      }
      setFormEntrada({ nombre: "", ingredientes: "", precio: 0, imagen: "" });
      setEditandoId(null);
    } else {
      console.error("Error al guardar la entrada");
    }
  };

  const handleEditar = (entrada: Entrada) => {
    setFormEntrada(entrada);
    setEditandoId(entrada.id ?? null);
  };

  const handleEliminar = async (id: number | undefined) => {
    if (!id) return;
    const res = await fetch(`http://localhost:8080/api/entradas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setEntradas((prev) => prev.filter((p) => p.id !== id));
    } else {
      console.error("Error al eliminar la entrada");
    }
  };

  return (
    <div className="gestion-container">
      <h2>Gestión de Entradas</h2>

      <div className="formulario">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formEntrada.nombre}
          onChange={handleChange}
        />
        <textarea
          name="ingredientes"
          placeholder="Ingredientes"
          value={formEntrada.ingredientes}
          onChange={handleChange}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formEntrada.precio}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de Imagen"
          value={formEntrada.imagen}
          onChange={handleChange}
        />
        <button onClick={handleGuardar}>
          {editandoId ? "Actualizar" : "Agregar"}
        </button>
      </div>

      <div className="lista-productos">
        {entradas.map((entrada) => (
          <div className="producto" key={entrada.id}>
            <img src={entrada.imagen} alt={entrada.nombre} />
            <div>
              <h4>{entrada.nombre}</h4>
              <p>{entrada.ingredientes}</p>
              <span>S/. {entrada.precio.toFixed(2)}</span>
            </div>
            <div className="acciones">
              <button onClick={() => handleEditar(entrada)}>✏️</button>
              <button onClick={() => handleEliminar(entrada.id)}>🗑️</button>
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
          color: #d33;
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
