import { useEffect, useState } from 'react';
type Entrada = {
  nombre: string;
  ingredientes: string;
  precio: number;
  img: string;
};

type Props = {
  onAgregarPrecio: (precio: number) => void;
};
export default function EntradasCliente({ onAgregarPrecio }: Props) {
  const [entradas, setEntradas] = useState<Entrada[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/entradas')
      .then(res => res.json())
      .then(data => setEntradas(data));
  }, []);

  return (
    <div className="grid">
      {entradas.map((entrada) => (
        <div className="slider-plato">
          <div className="info-plato">
            <img src={entrada.img} alt={entrada.ingredientes} />
            <div className="info">
              <h3>{entrada.nombre}</h3>
              <p>{entrada.ingredientes}</p>
              <span>S/. {entrada.precio}</span>
            </div>
          </div>
          <div className="button-compra">
            <button onClick={() => onAgregarPrecio(entrada.precio)}>
              Ordena aquí
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}