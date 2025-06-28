import { useEffect, useState } from 'react';
import '../../css/Menu.css';
export default function Menu() {
  const [entradas, setEntradas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/entradas')
      .then(res => res.json())
      .then(data => setEntradas(data))
      .catch(err => console.error("Error al cargar entradas:", err));
  }, []);

  const [cocteles, setCocteles] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/api/cocteles')
      .then(res => res.json())
      .then(data => setCocteles(data))
      .catch(err => console.error("Error al cargar cocteles:", err));
  }, []);
  const [bebidas, setBebidas] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/api/bebidas')
      .then(res => res.json())
      .then(data => setBebidas(data))
      .catch(err => console.error("Error al cargar bebidas:", err));
  }, []);

  const [pizzas, setPizzas] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/api/pizzas')
      .then(res => res.json())
      .then(data => setPizzas(data))
      .catch(err => console.error("Error al cargar pizzas:", err));
  }, []);
  
  
  return (
    <section className="principal-container">
      <div className="select-menus">
        <div className="container-selects">
          <div className="button-select">
            <a href="#pizzasPersonales">Pizzas</a>
          </div>
          <div className="button-select">
            <a href="#cocteles">Cocteles</a>
          </div>
        </div>
      </div>

      <div className="section-menu">

        {/* Pizzas personales */}
        <div className="subsection">
          <h2 id="pizzasPersonales">Pizzas personales</h2>
          <div className="grid">
            {pizzas.map((pizza) =>
              pizza.tamaño === 'Personal 30CM' && (
                <div className="slider-plato" key={pizza.nombre}>
                  <div className="info-plato">
                    <img src={pizza.imagen} alt={pizza.tipo} />
                    <div className="info">
                      <h3>{pizza.nombre}</h3>
                      <p>Tamaño: {pizza.tamaño}</p>
                      <p>{pizza.ingredientes}</p>
                      <span>S/. {pizza.precio}</span>
                    </div>
                  </div>
                  <div className="button-compra">
                    <a href="">Ordena aqui</a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Pizzas grandes */}
        <div className="subsection">
          <h2 id="pizzasGrandes">Pizzas Grandes</h2>
          <div className="grid">
            {pizzas.map((pizza) =>
              pizza.tamaño === 'Grande 35CM' && (
                <div className="slider-plato" key={pizza.nombre}>
                  <div className="info-plato">
                    <img src={pizza.imagen} alt={pizza.tipo} />
                    <div className="info">
                      <h3>{pizza.nombre}</h3>
                      <p>Tamaño: {pizza.tamaño}</p>
                      <p>{pizza.ingredientes}</p>
                      <span>S/. {pizza.precio}</span>
                    </div>
                  </div>
                  <div className="button-compra">
                    <a href="">Ordena aqui</a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Pizzas familiares */}
        <div className="subsection">
          <h2 id="pizzasFamiliar">Pizzas Familiares</h2>
          <div className="grid">
            {pizzas.map((pizza) =>
              pizza.tamaño === 'Familiar 40CM' && (
                <div className="slider-plato" key={pizza.nombre}>
                  <div className="info-plato">
                    <img src={pizza.imagen} alt={pizza.tipo} />
                    <div className="info">
                      <h3>{pizza.nombre}</h3>
                      <p>Tamaño: {pizza.tamaño}</p>
                      <p>{pizza.ingredientes}</p>
                      <span>S/. {pizza.precio}</span>
                    </div>
                  </div>
                  <div className="button-compra">
                    <a href="">Ordena aqui</a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bebidas */}
        <div className="subsection">
          <h2>Bebidas</h2>
          <div className="grid">
            {bebidas.map((bebida) => (
              <div className="slider-plato" key={bebida.nombre}>
                <div className="info-plato">
                  <img src={bebida.imagen} alt={bebida.descripcion} />
                  <div className="info">
                    <h3>{bebida.nombre}</h3>
                    <p>{bebida.descripcion}</p>
                    <span>S/. {bebida.precio}</span>
                  </div>
                </div>
                <div className="button-compra">
                  <a href="">Ordena aqui</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cocteles */}
        <div className="subsection">
          <h2 id="cocteles">Cocteles</h2>
          <div className="grid">
            {cocteles.map((coctel) => (
              <div className="slider-plato" key={coctel.nombre}>
                <div className="info-plato">
                  <img src={coctel.imagen} alt="cocteles" />
                  <div className="info">
                    <h3>{coctel.nombre}</h3>
                    <p>{coctel.ingredientes}</p>
                    <span>S/. {coctel.precio}</span>
                  </div>
                </div>
                <div className="button-compra">
                  <a href="">Ordena aqui</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entradas desde API */}
        <div className="subsection">
          <h2>Entradas</h2>
          <div className="grid">
            {entradas.map((entrada) => (
              <div className="slider-plato" key={entrada.id || entrada.nombre}>
                <div className="info-plato">
                  <img src={entrada.imagen} />
                  <div className="info">
                    <h3>{entrada.nombre}</h3>
                    <p>{entrada.ingredientes}</p>
                    <span>S/. {entrada.precio}</span>
                  </div>
                </div>
                <div className="button-compra">
                  <a href="">Ordena aqui</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


