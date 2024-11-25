import React from 'react';
import './AboutUs.css'; 
import aboutus from '../Assets/aboutUS.jpg'

const AboutUs = () => {
  return (
    <div className="container">
      <div className="image-container">
        <img
          src={aboutus}
          alt="GadgetGalaxy"
          className="image"
        />
      </div>
      <div className="text-container">
        <h2>Our Story</h2>
        <p>
          In 2015, GadgetGalaxy began as a simple idea born from a passion for technology and a desire to make cutting-edge gadgets accessible to everyone. Its founders, a small group of tech enthusiasts, shared a common dream: to create a place where people could explore, discover, and get excited about the latest innovations in tech.
        </p>
        <p>
          What started as a modest online store quickly grew into a trusted source for not only gadgets but also expert reviews, insightful content, and a thriving community of tech lovers. Every product on GadgetGalaxy was carefully selected for its quality, functionality, and potential to improve the everyday lives of its customers.
        </p>
        <p>
          Over the years, GadgetGalaxy has expanded its offerings, from smart home devices to wearable tech, always striving to stay ahead of the curve. With a focus on customer satisfaction and a passion for bringing the future to life today, GadgetGalaxy is more than just a store—it's a hub for gadget enthusiasts, innovators, and dreamers.
        </p>
        <p>
          As we continue to grow, our mission remains clear: to provide the tools and knowledge that empower you to embrace the tech of tomorrow. Welcome to GadgetGalaxy—where the future is always at your fingertips.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
