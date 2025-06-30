import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rol: "ROLE_ADMIN",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Usuario registrado correctamente");
      window.location.href = "/login";
    } else {
      alert("Error al registrar");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Registrarse</h2>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo"
        />
        <input
          name="contraseña"
          type="password"
          value={form.contraseña}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">Registrarse</button>
        <style>{`
          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 400px;
            margin: auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: white;
          }
          h2 {
            text-align: center;
          }
          input {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          button {
            padding: 0.5rem;
            background-color: hsl(353, 93%, 46%);
            color: white;
            border: none;
            border-radius: 4px;
          }
        `}</style>
      </form>
    </>
  );
}
