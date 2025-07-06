import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

type Entrada = {
  nombre: string;
  ingredientes: string;
  precio: number;
  img: string;
};

export default function EntradasCliente() {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:8080/api/entradas")
      .then((res) => res.json())
      .then((data) => setEntradas(data));
  }, []);

  return (
    <div className="grid">
      {entradas.map((entrada, index) => (
        <div className="slider-plato" key={index}>
          <div className="info-plato">
            <img src={entrada.img} alt={entrada.ingredientes} />
            <div className="info">
              <h3>{entrada.nombre}</h3>
              <p>{entrada.ingredientes}</p>
              <span>S/. {entrada.precio.toFixed(2)}</span>
            </div>
          </div>
          <div className="button-compra">
            <button onClick={() => addToCart(entrada.precio)}>
              Ordena aquí
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
