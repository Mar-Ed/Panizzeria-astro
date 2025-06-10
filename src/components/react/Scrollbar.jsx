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
      <div className="wrapper">
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
            <img src="/img/platos/Americana.png" className="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Burger.png" className="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Campesina.png" className="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Suprema.png" className="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Pepperoni.png" className="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Cuatro-quesos.png" className="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Especial.png" className="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Fourseasons.png" className="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Hawaiana.png" className="slider-plato"></img>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
