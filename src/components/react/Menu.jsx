import { useState } from "react";
import OrderModal from "./OrderModal";
import "../../css/Menu.css";

// Import local data
import pizzasData from "../../data/pizzas.json";
import bebidasData from "../../data/bebidas.json";

export default function Menu() {
  const [bebidas] = useState(bebidasData);
  const [pizzas] = useState(pizzasData);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSection, setActiveSection] = useState("Personal");

  const handleAddToOrder = (item) => {
    setSelectedProduct(item);
    setModalOpen(true);
  };

  const renderProductos = (productos) =>
    productos.map((item, index) => (
      <div className="slider-plato" key={`${item.nombre}-${item.tamaño || index}`}>
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
          <a onClick={() => handleAddToOrder(item)}>Agregar al Pedido</a>
        </div>
      </div>
    ));

  const renderSeccion = (titulo, productos) => (
    <div className="subsection">
      <h2 className="subsection-title">{titulo}</h2>
      <div className="grid">{renderProductos(productos)}</div>
    </div>
  );

  const pizzasPorTamaño = (tamañoBusca) => {
    return pizzas.filter((pizza) => {
      const valTamaño = (pizza.tamaño || pizza.tamano || "").toString().trim().toLowerCase();
      return valTamaño.includes(tamañoBusca.trim().toLowerCase());
    });
  };

  return (
    <section className="principal-container">
      <div className="section-menu">
        <div className="container-selects">
          {[
            { texto: "Pizza Personal", valor: "Personal" },
            { texto: "Pizza Grande", valor: "Grande" },
            { texto: "Pizza Familiar", valor: "Familiar" },
          ].map((btn) => (
              <div 
                className={`button ${activeSection === btn.valor ? 'active' : ''}`} 
                key={btn.valor}
              >
              <a onClick={() => setActiveSection(btn.valor)}>{btn.texto}</a>
            </div>
          ))}
        </div>

        <div className="menu-content-pizzas">
          {activeSection === "Personal" &&
            renderSeccion("Pizzas Personales", pizzasPorTamaño("Personal 30CM"))}
          {activeSection === "Grande" &&
            renderSeccion("Pizzas Grandes", pizzasPorTamaño("Grande 35CM"))}
          {activeSection === "Familiar" &&
            renderSeccion("Pizzas Familiares", pizzasPorTamaño("Familiar 40CM"))}
        </div>
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        bebidas={bebidas}
      />
    </section>
  );
}
