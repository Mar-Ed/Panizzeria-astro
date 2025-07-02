import { useEffect, useState } from "react";
import "../../css/Menu.css";

export default function Menu() {
  const [entradas, setEntradas] = useState([]);
  const [cocteles, setCocteles] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    const fetchData = async (endpoint, setState, nombre) => {
      try {
        const res = await fetch(`http://localhost:8080/api/${endpoint}`);
        const data = await res.json();
        setState(data);
      } catch (err) {
        console.error(`Error al cargar ${nombre}:`, err);
      }
    };

    fetchData("entradas", setEntradas, "entradas");
    fetchData("cocteles", setCocteles, "cocteles");
    fetchData("bebidas", setBebidas, "bebidas");
    fetchData("pizzas", setPizzas, "pizzas");
  }, []);

  const renderProductos = (productos, tipoExtra = null) =>
    productos.map((item) => (
      <div className="slider-plato" key={item.id || item.nombre}>
        <div className="info-plato">
          <img src={item.imagen} alt={item.nombre} />
          <div className="info">
            <h3>{item.nombre}</h3>
            {item.tamaño && <p>Tamaño: {item.tamaño}</p>}
            <p>{item.ingredientes || item.descripcion}</p>
            <span>S/. {item.precio}</span>
          </div>
        </div>
        <div className="button-compra">
          <a href="">Agregar al Pedido</a>
        </div>
      </div>
    ));

  const renderSeccion = (titulo, productos, id = null) => (
    <div className="subsection">
      <h2 id={id || titulo.toLowerCase()}>{titulo}</h2>
      <div className="grid">{renderProductos(productos)}</div>
    </div>
  );

  const pizzasPorTamaño = (tamaño) =>
    pizzas.filter((pizza) => pizza.tamaño === tamaño);

  return (
    <section className="principal-container">
      <div className="section-menu">
        <div className="container-selects">
          {[
            { texto: "Pizza Personal", href: "#pizzasPersonales" },
            { texto: "Pizza Grande", href: "#pizzasGrandes" },
            { texto: "Pizza Familiar", href: "#pizzasFamiliar" },
            { texto: "Entradas", href: "#entradas" },
            { texto: "Bebidas", href: "#bebidas" },
            { texto: "Cocteles", href: "#cocteles" },
          ].map((btn) => (
            <div className="button" key={btn.href}>
              <a href={btn.href}>{btn.texto}</a>
            </div>
          ))}
        </div>
        
        {renderSeccion(
          "Pizzas personales",
          pizzasPorTamaño("Personal 30CM"),
          "pizzasPersonales",
        )}
        {renderSeccion(
          "Pizzas Grandes",
          pizzasPorTamaño("Grande 35CM"),
          "pizzasGrandes",
        )}
        {renderSeccion(
          "Pizzas Familiares",
          pizzasPorTamaño("Familiar 40CM"),
          "pizzasFamiliar",
        )}
        {renderSeccion("Bebidas", bebidas, "bebidas")}
        {renderSeccion("Cocteles", cocteles, "cocteles")}
        {renderSeccion("Entradas", entradas, "entradas")}
      </div>
    </section>
  );
}
