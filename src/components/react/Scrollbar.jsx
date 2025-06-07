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
            <img src="/img/platos/Americana.jpg" class="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Burger.jpg" class="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Campesina.jpg" class="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Suprema.jpg" class="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Pepperoni.jpg" class="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Cuatro-quesos.jpg" class="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Especial.jpg" class="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Fourseasons.jpg" class="slider-plato"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/platos/Hawaiana.jpg" class="slider-plato"></img>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
