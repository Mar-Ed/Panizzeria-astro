import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "../../css/styleSwiper.css";
import "../../css/base.css";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";

export default function ScrollBar() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.from(".slider-title-main", {
        scrollTrigger: {
          trigger: ".slider-title-main",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(".mySwiper", {
        scrollTrigger: {
          trigger: ".mySwiper",
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pizzas = [
    { name: "Americana", desc: "Salsa de tomate, mozzarella y jamón.", img: "/img/platos/Americana.png" },
    { name: "Pizza Burger", desc: "Carne de res, queso cheddar y tocino.", img: "/img/platos/Burger.png" },
    { name: "Pizza Campesina", desc: "Pimientos, champiñones y aceitunas.", img: "/img/platos/Campesina.png" },
    { name: "Pizza Suprema", desc: "Pepperoni, carne, pimientos y champiñones.", img: "/img/platos/Suprema.png" },
    { name: "Pizza Pepperoni", desc: "Doble pepperoni y extra mozzarella.", img: "/img/platos/Pepperoni.png" },
    { name: "Pizza Cuatro Quesos", desc: "Mozzarella, parmesano, provolone y azul.", img: "/img/platos/Cuatro-quesos.png" },
    { name: "Pizza Especial", desc: "Jamón, tocino, duraznos y cerezas.", img: "/img/platos/Especial.png" },
    { name: "Pizza Fourseasons", desc: "Jamón, pepperoni y champiñones.", img: "/img/platos/Fourseasons.png" },
    { name: "Pizza Hawaiana", desc: "Jamón y piña seleccionada.", img: "/img/platos/Hawaiana.png" },
  ];

  return (
    <div className="prin-container swiper-container-wrapper" ref={sectionRef} style={{ flexDirection: "column", padding: "4rem 0" }}>
      <div className="wrapper">
        <div className="title-container slider-title-main" style={{ textAlign: "center", padding: "0 1rem", marginBottom: "3rem" }}>
          <h1 className="title premium-title">
            <span className="block" style={{ color: "var(--first-color)" }}>Descubre</span>
            <span className="block">Nuestros Platos</span>
          </h1>
          <div className="text-container" style={{ width: "100%", maxWidth: "600px", margin: "1rem auto" }}>
            <p className="subtitle" style={{ fontSize: "1.1rem" }}>
              Selecciona los sabores más deliciosos y mejor preparados. Hemos
              recopilado nuestras recetas más aclamadas para ti.
            </p>
          </div>
        </div>
      </div>
      
      <div className="swiper-section" style={{ width: "100%" }}>
        <Swiper
          slidesPerView={1.2}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 30,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
              centeredSlides: false,
            },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="mySwiper"
        >
          {pizzas.map((pizza, index) => (
            <SwiperSlide key={index}>
              <div className="slider-card-premium">
                <div className="image-wrapper">
                  <img src={pizza.img} className="slider-plato" alt={pizza.name} />
                </div>
                <div className="card-info">
                  <h2 className="slider-title">{pizza.name}</h2>
                  <p className="slider-desc">{pizza.desc}</p>
                  <a href="/Menu">
                    <button className="order-btn-mini">Ver Más</button>
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .premium-title {
          font-size: 3rem;
          line-height: 1.2;
          color: var(--first-color-dark);
        }
        .slider-card-premium {
          background: var(--container-color);
          border-radius: 2rem;
          padding: 2.5rem 1.5rem;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          box-shadow: 0 10px 30px rgba(184, 115, 51, 0.1);
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1rem 0;
          position: relative;
          overflow: hidden;
        }
        .slider-card-premium:hover {
          transform: translateY(-15px);
          background: var(--white-color);
          box-shadow: 0 20px 40px rgba(184, 115, 51, 0.2);
          border-color: var(--first-color);
        }
        .image-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .slider-card-premium:hover .image-wrapper {
          transform: scale(1.15) rotate(5deg);
        }
        .slider-plato {
          width: 90%;
          height: auto;
          filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15));
        }
        .card-info .slider-title {
          font-family: 'Carter One', sans-serif;
          font-size: 1.6rem;
          color: var(--first-color-dark);
          margin-bottom: 0.5rem;
        }
        .slider-desc {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          max-width: 200px;
        }
        .card-info a {
          text-decoration: none;
        }
        .order-btn-mini {
          margin-top: 1.5rem;
          padding: 0.8rem 1.8rem;
          background: var(--first-color);
          color: white;
          border: none;
          border-radius: 3rem;
          font-weight: 700;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s ease;
          box-shadow: 0 5px 15px hsla(353, 100%, 50%, 0.3);
        }
        .slider-card-premium:hover .order-btn-mini {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Swiper Pagination Overrides */
        .swiper-pagination-bullet {
          background: var(--first-color-dark) !important;
          opacity: 0.2;
        }
        .swiper-pagination-bullet-active {
          background: var(--first-color) !important;
          opacity: 1;
          width: 25px !important;
          border-radius: 5px !important;
        }

        @media (max-width: 768px) {
          .premium-title {
            font-size: 2.2rem;
          }
          .slider-card-premium {
            padding: 2rem 1rem;
          }
        }
      `}} />
    </div>
  );
}
