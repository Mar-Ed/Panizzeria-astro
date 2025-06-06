import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import React from 'react';

const SwiperDemo: React.FC = () => {
  return (
    <div style={styles.container}>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        freeMode={true}
        pagination={{ clickable: true }}
        modules={[Pagination, FreeMode]}
        className="mySwiper"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <SwiperSlide key={i}>Slide {i + 1}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    background: '#000',
    color: '#fff',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: '14px',
  } as React.CSSProperties,
};

export default SwiperDemo;
