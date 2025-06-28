import { useEffect, useState } from 'react';

export default function EntradasCliente() {
  const [entradas, setEntradas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/entradas')
      .then(res => res.json())
      .then(data => setEntradas(data));
  }, []);

  return (
    <div class="grid">
      {entradas.map((entrada) => (
        <div class="slider-plato">
          <div class="info-plato">
            <img src={entrada.img} alt={entrada.ingredientes} />
            <div class="info">
              <h3>{entrada.nombre}</h3>
              <p>{entrada.ingredientes}</p>
              <span>S/. {entrada.precio}</span>
            </div>
          </div>
          <div class="button-compra">
            <a href="">Ordena aqui</a>
          </div>
        </div>
      ))}
    </div>
  );
}