import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./login.css"; // Asegúrate de que la ruta sea correcta
export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contraseña }),
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/admin";
    } else {
      alert("Credenciales inválidas");
    }
  };
  //muestrame el token por consola

  return (
    <>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Admin - Iniciar Sesion</h2>
        <input
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo"
          required
        />
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Entrar</button>
        <h2>¿Estás Registrado?</h2>
        <a href="/registro" className="register-link">
          Registrate aquí
        </a>
      </form>
    </>
  );
}
