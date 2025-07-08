import { useState } from "react";
import "./login.css";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rol: "ROLE_ADMIN",
  });

  // Registrar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { nombre, correo, contraseña } = form;

    if (!nombre || !correo || !contraseña) {
      alert("Por favor, complete todos los campos para registrarse.");
      return;
    }

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

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !contraseña) {
      alert("Por favor, ingrese su correo y contraseña.");
      return;
    }

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

  return (
    <>
      <div
        className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmitRegister}>
            <h1>Crear Cuenta</h1>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="password"
              name="contraseña"
              value={form.contraseña}
              onChange={handleChange}
              placeholder="Password"
            />

            <button>Registrarte</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmitLogin}>
            <h1>Iniciar sesión</h1>
          
            <input
              type="email"
              name="correo"
              placeholder="Email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <input
              type="password"
              name="contraseña"
              placeholder="Password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />

            <a href="#">¿Olvidaste tu contraseña?</a>
            <button>Iniciar sesión</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Bienvenido de vuelta!</h1>
              <p>
                Inicia sesión con tus datos personales
              </p>
              <button
                className="ghost"
                onClick={() => setIsSignUpActive(false)}
                id="signIn"
              >
                Inicia sesión
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hola, usuario!</h1>
              <p>Registrate para poder tener acceso al Panel Admin</p>
              <button
                className="ghost"
                onClick={() => setIsSignUpActive(true)}
                id="signUp"
              >
                Registrate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
