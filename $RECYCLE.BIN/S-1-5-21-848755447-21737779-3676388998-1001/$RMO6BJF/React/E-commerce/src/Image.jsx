import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const images = [
   "/ele.png",
   "/shoes.jpg",
  "/cloths.jpg", 
  "public/toy.png",
  "public/dis.jpg"
];

const GalleryCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    adaptiveHeight: false
  };

  return (
    <div style={{
      width: '100%',
      height: '130vh', // ✅ taller than full screen
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: '#fff'
    }}>
      <Slider {...settings}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {images.map((src, i) => (
          <div key={i}
            style={{
              width: '100%',
              height: '130vh', // ✅ same as container height
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff'
            }}
          >
            <img
              src={src}
              alt={`gallery-${i}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // keeps proportion but fills the space
                borderRadius: '0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default GalleryCarousel;
