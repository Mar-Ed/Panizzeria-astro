import { useState } from "react";
import "./login.css"; // Asegúrate de que la ruta sea correcta
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

  //Register
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister=async (e:React.FormEvent)=>{
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
  }

  const handleSubmitLogin = async (e: React.FormEvent) => {
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

  return (
    <>
      <div className={`container ${isSignUpActive ? "right-panel-active" : ""}`} id="container">
	<div className="form-container sign-up-container">
		<form onSubmit={handleSubmitRegister}>
			<h1>Create Account</h1>
			<div className="social-container">
				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
			</div>
			<span>or use your email for registration</span>
			<input type="text" placeholder="Nombre" onChange={handleChange} value={form.nombre}/>
			<input type="email" placeholder="Email" onChange={handleChange} value={form.correo}/>
			<input type="password" placeholder="Password" onChange={handleChange} value={form.contraseña} />
			<button>Sign Up</button>
		</form>
	</div>
	<div className="form-container sign-in-container">
		<form onSubmit={handleSubmitLogin}>
			<h1>Sign in</h1>
			<div className="social-container">
				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
			</div>
			<span>or use your account</span>
			<input type="email" placeholder="Email" value={correo}/>
			<input type="password" placeholder="Password" value={contraseña}/>
			<a href="#">Forgot your password?</a>
			<button>Sign In</button>
		</form>
	</div>
	<div className="overlay-container">
		<div className="overlay">
			<div className="overlay-panel overlay-left">
				<h1>Welcome Back!</h1>
				<p>To keep connected with us please login with your personal info</p>
				<button className="ghost" onClick={() => setIsSignUpActive(false)} id="signIn">Sign In</button>
			</div>
			<div className="overlay-panel overlay-right">
				<h1>Hello, Friend!</h1>
				<p>Enter your personal details and start journey with us</p>
				<button className="ghost" onClick={() => setIsSignUpActive(true)}id="signUp">Sign Up</button>
			</div>
		</div>
	</div>
</div>
    </>
  );
}
