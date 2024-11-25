import React, { useEffect, useRef } from 'react';
import './Offers.css';
import exlusive_image from '../Assets/exclusive_image.png';

const Offers = () => {
  const offersRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          offersRef.current.classList.add('visible');
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (offersRef.current) {
      observer.observe(offersRef.current);
    }

    return () => {
      if (offersRef.current) {
        observer.unobserve(offersRef.current);
      }
    };
  }, []);

  return (
    <div className="offers" ref={offersRef}>
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button>Check Now</button>
      </div>
      <div className="offers-right">
        <img src={exlusive_image} alt="Exclusive Offer" />
      </div>
    </div>
  );
};

export default Offers;
