import { useEffect, useState } from 'react';
import pizzasInfo from '../../data/pizzas.json';
import coctelesInfo from '../../data/cocteles.json';
import bebidasInfo from '../../data/bebidas.json';
import '../../css/Menu.css';
export default function Menu() {
  const [entradas, setEntradas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/entradas')
      .then(res => res.json())
      .then(data => setEntradas(data))
      .catch(err => console.error("Error al cargar entradas:", err));
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
            {pizzasInfo.map((pizza) =>
              pizza.tamaño === 'Personal 30CM' && (
                <div className="slider-plato" key={pizza.nombre}>
                  <div className="info-plato">
                    <img src={pizza.img} alt={pizza.tipo} />
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
            {pizzasInfo.map((pizza) =>
              pizza.tamaño === 'Grande 35CM' && (
                <div className="slider-plato" key={pizza.nombre}>
                  <div className="info-plato">
                    <img src={pizza.img} alt={pizza.tipo} />
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
            {pizzasInfo.map((pizza) =>
              pizza.tamaño === 'Familiar 40CM' && (
                <div className="slider-plato" key={pizza.nombre}>
                  <div className="info-plato">
                    <img src={pizza.img} alt={pizza.tipo} />
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
            {bebidasInfo.map((bebida) => (
              <div className="slider-plato" key={bebida.nombre}>
                <div className="info-plato">
                  <img src={bebida.img} alt={bebida.tipo} />
                  <div className="info">
                    <h3>{bebida.nombre}</h3>
                    <p>{bebida.tipo}</p>
                    <span>S/. {bebida.precios}</span>
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
            {coctelesInfo.map((coctel) => (
              <div className="slider-plato" key={coctel.nombre}>
                <div className="info-plato">
                  <img src={coctel.img} alt={coctel.tipo} />
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


