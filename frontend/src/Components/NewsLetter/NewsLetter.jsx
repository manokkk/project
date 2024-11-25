import React, { useEffect, useRef } from 'react';
import './NewsLetter.css';

const NewsLetter = () => {
  const newsletterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          newsletterRef.current.classList.add('visible');
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (newsletterRef.current) {
      observer.observe(newsletterRef.current);
    }

    return () => {
      if (newsletterRef.current) {
        observer.unobserve(newsletterRef.current);
      }
    };
  }, []);

  return (
    <div className="newsletter" ref={newsletterRef}>
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input type="email" placeholder="Your Email Address" />
        <button>Subscribe</button>
      </div>
    </div>
  );
};

export default NewsLetter;
