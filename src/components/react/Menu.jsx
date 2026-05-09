import { useState, useEffect, useRef, useMemo } from "react";
import "../../css/Menu.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { addProductToCart, $isCartOpen } from "../../store/cartStore";

// Import local data
import pizzasData from "../../data/pizzas.json";
import bebidasData from "../../data/bebidas.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Menu() {
  const [bebidas] = useState(bebidasData);
  const [pizzas] = useState(pizzasData);
  const [activeSection, setActiveSection] = useState("Personal");
  const menuRef = useRef(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [maxPrice, setMaxPrice] = useState(100);
  const [visibleItems, setVisibleItems] = useState(12);

  // Memoized Filtered Products
  const processedProducts = useMemo(() => {
    const rawPizzas = pizzas.filter((pizza) => {
      const valTamaño = (pizza.tamaño || pizza.tamano || "").toString().trim().toLowerCase();
      const sectionQuery = activeSection === "Personal" ? "Personal 30CM" : 
                           activeSection === "Grande" ? "Grande 35CM" : 
                           "Familiar 40CM";
      return valTamaño.includes(sectionQuery.toLowerCase());
    });

    let filtered = rawPizzas.filter(item => {
      const matchesSearch = (item.nombre + (item.ingredientes || "")).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = item.precio <= maxPrice;
      return matchesSearch && matchesPrice;
    });

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.precio - b.precio);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.precio - a.precio);
    }

    return filtered;
  }, [pizzas, activeSection, searchTerm, sortOrder, maxPrice]);

  // GSAP Animation Logic
  useEffect(() => {
    if (processedProducts.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".slider-plato");
      
      gsap.fromTo(
        cards,
        { 
          opacity: 0, 
          y: 40,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: {
            amount: 0.5,
            from: "start"
          },
          ease: "expo.out",
          scrollTrigger: {
            trigger: menuRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }, menuRef);

    return () => ctx.revert();
  }, [processedProducts, visibleItems]);

  const handleAddToOrder = (item, e) => {
    // Flying Pizza Animation
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const card = btn.closest('.slider-plato');
    const img = card.querySelector('img');
    const imgRect = img.getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.src = item.imagen;
    flyer.className = 'flying-pizza';
    flyer.style.left = `${imgRect.left}px`;
    flyer.style.top = `${imgRect.top}px`;
    flyer.style.width = `${imgRect.width}px`;
    flyer.style.height = `${imgRect.height}px`;
    document.body.appendChild(flyer);

    // Get cart icon position (fallback to top right if not found)
    const cartIcon = document.querySelector('.cart-trigger-icon') || { getBoundingClientRect: () => ({ right: window.innerWidth - 40, top: 40 }) };
    const cartRect = cartIcon.getBoundingClientRect();

    gsap.to(flyer, {
      x: cartRect.left - imgRect.left,
      y: cartRect.top - imgRect.top,
      width: 20,
      height: 20,
      opacity: 0.5,
      rotation: 720,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        flyer.remove();
        addProductToCart(item);
        // Optional: Open cart on first add
        $isCartOpen.set(true);
      }
    });
  };

  const renderProductos = () => {
    if (processedProducts.length === 0) {
      return <div className="no-results">No se encontraron pizzas con esos filtros.</div>;
    }

    const itemsToDisplay = processedProducts.slice(0, visibleItems);

    return (
      <>
        <div className="grid">
          {itemsToDisplay.map((item, index) => (
            <div className="slider-plato" key={`${item.nombre}-${item.tamaño || index}`}>
              <div className="plato-card-content">
                <div className="plato-image-container">
                  <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    loading="lazy" 
                    decoding="async"
                  />
                  {item.tipo && <span className="category-badge">{item.tipo}</span>}
                </div>
                <div className="info">
                  <div className="info-header">
                    <h3>{item.nombre}</h3>
                  </div>
                  <div className="info-details">
                    {item.tamaño && <p><span className="label">Tamaño:</span> {item.tamaño}</p>}
                    <div className="ingredients-container">
                      <span className="label">Ingredientes:</span>
                      <p className="ingredients">{item.ingredientes || item.descripcion}</p>
                    </div>
                  </div>
                  <div className="info-footer">
                    <span className="price">S/. {item.precio}</span>
                  </div>
                </div>
              </div>
              <div className="button-compra">
                <button onClick={(e) => handleAddToOrder(item, e)}>Agregar al Pedido</button>
              </div>
            </div>
          ))}
        </div>
        
        {visibleItems < processedProducts.length && (
          <div className="load-more-container">
            <button className="button-load-more" onClick={() => setVisibleItems(prev => prev + 12)}>
              Ver más pizzas
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="principal-container" ref={menuRef}>
      <div className="section-menu">
        <div className="menu-header">
          <div className="container-selects">
            {[
              { texto: "Pizza Personal", valor: "Personal" },
              { texto: "Pizza Grande", valor: "Grande" },
              { texto: "Pizza Familiar", valor: "Familiar" },
            ].map((btn) => (
                <div 
                  className={`button-tab ${activeSection === btn.valor ? 'active' : ''}`} 
                  key={btn.valor}
                  onClick={() => setActiveSection(btn.valor)}
                >
                <span>{btn.texto}</span>
              </div>
            ))}
          </div>

          <div className="filters-bar">
            <div className="filter-group search">
              <input 
                type="text" 
                placeholder="Buscar por ingrediente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className='bx bx-search'></i>
            </div>
            
            <div className="filter-group sort">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="default">Ordenar por...</option>
                <option value="asc">Precio: Menor a Mayor</option>
                <option value="desc">Precio: Mayor a Menor</option>
              </select>
            </div>

            <div className="filter-group price-range">
              <label>Precio máx: S/. {maxPrice}</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="menu-content-pizzas">
          <div className="subsection">
            <h2 className="subsection-title">
              {activeSection === "Personal" ? "Pizzas Personales" : 
               activeSection === "Grande" ? "Pizzas Grandes" : 
               "Pizzas Familiares"}
            </h2>
            {renderProductos()}
          </div>
        </div>
      </div>
    </section>
  );
}



