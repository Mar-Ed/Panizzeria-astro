import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Pizza {
  id?: number;
  nombre: string;
  tipo: string;
  ingredientes: string;
  tamano: string;
  precio: number;
  imagen: string;
}

export default function GestionarPizzas() {
  const { token } = useAuth();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [form, setForm] = useState<Pizza>({
    nombre: "",
    tipo: "",
    ingredientes: "",
    tamano: "",
    precio: 0,
    imagen: ""
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  const fetchPizzas = () => {
    fetch("http://localhost:8080/api/pizzas")
      .then(res => res.json())
      .then(setPizzas);
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = modoEdicion
      ? `http://localhost:8080/api/pizzas/${form.id}`
      : "http://localhost:8080/api/pizzas";
    const method = modoEdicion ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
      .then(() => {
        fetchPizzas();
        setForm({ nombre: "", tipo: "", ingredientes: "", tamano: "", precio: 0, imagen: "" });
        setModoEdicion(false);
      });
  };

  const handleEdit = (pizza: Pizza) => {
    setForm({ ...pizza });
    setModoEdicion(true);
  };

  const handleDelete = (id: number | undefined) => {
    if (!id) return;
    if (!confirm("¿Seguro que quieres eliminar esta pizza?")) return;
    fetch(`http://localhost:8080/api/pizzas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(fetchPizzas);
  };

  return (
    <div className="crud-pizzas">
      <h2>{modoEdicion ? "Editar Pizza" : "Agregar Nueva Pizza"}</h2>
      <form onSubmit={handleSubmit} className="pizza-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="tipo" placeholder="Tipo" value={form.tipo} onChange={handleChange} required />
        <input name="ingredientes" placeholder="Ingredientes" value={form.ingredientes} onChange={handleChange} required />
        <input name="tamano" placeholder="Tamaño (ej. Personal 30CM)" value={form.tamano} onChange={handleChange} required />
        <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} required />
        <input name="imagen" placeholder="URL de Imagen" value={form.imagen} onChange={handleChange} required />
        <button type="submit">{modoEdicion ? "Actualizar" : "Agregar"}</button>
      </form>

      <h2>Listado de Pizzas</h2>
      <div className="pizza-list">
        {pizzas.map((pizza) => (
          <div className="pizza-card" key={pizza.id}>
            <img src={pizza.imagen} alt={pizza.nombre} />
            <div>
              <h4>{pizza.nombre}</h4>
              <p>{pizza.tipo}</p>
              <p>{pizza.ingredientes}</p>
              <p><strong>Tamaño:</strong> {pizza.tamano}</p>
              <p><strong>S/.</strong> {pizza.precio}</p>
              <button onClick={() => handleEdit(pizza)}>Editar</button>
              <button onClick={() => handleDelete(pizza.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .crud-pizzas {
          margin-top: 2rem;
        }
        .pizza-form {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
          max-width: 500px;
        }
        .pizza-form input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .pizza-form button {
          background-color: #d33;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .pizza-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .pizza-card {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 1rem;
          background: #fff8f8;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }
        .pizza-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 6px;
        }
        .pizza-card button {
          margin-top: 0.5rem;
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 4px;
          background-color: #d33;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
