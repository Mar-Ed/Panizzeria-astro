import { useEffect, useState } from "react";
import OrderModal from "./OrderModal";
import "../../css/Menu.css";

export default function Menu() {
  const [bebidas, setBebidas] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSection, setActiveSection] = useState("Personal");

  useEffect(() => {
    const fetchData = async (endpoint, setState, nombre) => {
      try {
        const res = await fetch(`https://proactive-presence-production-6423.up.railway.app/api/${endpoint}`);
        const data = await res.json();
        setState(data);
      } catch (err) {
        console.error(`Error al cargar ${nombre}:`, err);
      }
    };

    fetchData("bebidas", setBebidas, "bebidas");
    fetchData("pizzas", setPizzas, "pizzas");
  }, []);

  const handleAddToOrder = (item) => {
    setSelectedProduct(item);
    setModalOpen(true);
  };

  const renderProductos = (productos) =>
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
          <a onClick={() => handleAddToOrder(item)}>Agregar al Pedido</a>
        </div>
      </div>
    ));

  const renderSeccion = (titulo, productos) => (
    <div className="subsection">
      <h2>{titulo}</h2>
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
            { texto: "Pizza Personal", valor: "Personal" },
            { texto: "Pizza Grande", valor: "Grande" },
            { texto: "Pizza Familiar", valor: "Familiar" },
          ].map((btn) => (
              <div className="button" key={btn.href}>
              <a onClick={() => setActiveSection(btn.valor)} href={btn.href}>{btn.texto}</a>
            </div>
          ))}
        </div>

        {activeSection === "Personal" &&
          renderSeccion("Pizzas Personales", pizzasPorTamaño("Personal 30CM"))}
        {activeSection === "Grande" &&
          renderSeccion("Pizzas Grandes", pizzasPorTamaño("Grande 35CM"))}
        {activeSection === "Familiar" &&
          renderSeccion("Pizzas Familiares", pizzasPorTamaño("Familiar 40CM"))}
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
