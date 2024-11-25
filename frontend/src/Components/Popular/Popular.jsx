import React, { useEffect, useRef } from 'react';
import './Popular.css';
import data_product from '../Assets/data';
import Item from '../Item/Item';

const Popular = () => {
  const popularRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          popularRef.current.classList.add('visible');
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (popularRef.current) {
      observer.observe(popularRef.current);
    }

    return () => {
      if (popularRef.current) {
        observer.unobserve(popularRef.current);
      }
    };
  }, []);

  return (
    <div className="popular" ref={popularRef}>
      <h1>POPULAR SMARTPHONES</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
