import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "../../css/styleSwiper.css";
import "../../css/base.css";
// import required modules
import { FreeMode, Pagination } from "swiper/modules";

export default function App() {
  return (
    <>
      <div className="prin-container">
      <div className="wrapper">
        <div className="title-container">
          <h1 className="title">
            <span className="block">Descubre</span>
            <span className="block">Nuestros Platos</span>
          </h1>
          <div className="text-container">
            <p>
              Selecciona los sabores más deliciosos y mejor preparados. Hemos
              recopilado algunas recetas populares de todo el mundo para que
              elijas tu favorita.
            </p>
          </div>
        </div>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          modules={[FreeMode, Pagination]}
          className="mySwiper"
          class="wrapper"
        >
          <SwiperSlide>
            <div className="slider-container">
              <img
                src="/img/platos/Americana.png"
                className="slider-plato"
              ></img>
              <h2 className="slider-title">Americana</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slider-container">
              <img src="/img/platos/Burger.png" className="slider-plato"></img>
              <h2 className="slider-title">Pizza Burger</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slider-container">
              <img
                src="/img/platos/Campesina.png"
                className="slider-plato"
              ></img>
              <h2 className="slider-title">Pizza Campesina</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slider-container">
              <img src="/img/platos/Suprema.png" className="slider-plato"></img>
              <h2 className="slider-title">Pizza Suprema</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slider-container">
              <img
                src="/img/platos/Pepperoni.png"
                className="slider-plato"
              ></img>
              <h2 className="slider-title">Pizza Pepperoni</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slider-container">
              <img
                src="/img/platos/Cuatro-quesos.png"
                className="slider-plato"
              ></img>
              <h2 className="slider-title">Pizza Cuatro Quesos</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slider-container">
              <img
                src="/img/platos/Especial.png"
                className="slider-plato"
              ></img>
              <h2 className="slider-title">Pizza Especial</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slider-container">
              <img
                src="/img/platos/Fourseasons.png"
                className="slider-plato"
              ></img>
              <h2 className="slider-title">Pizza Fourseasons</h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slider-container">
              <img
                src="/img/platos/Hawaiana.png"
                className="slider-plato"
              ></img>
              <h2 className="slider-title">Pizza Hawaiana</h2>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      </div>
    </>
  );
}
