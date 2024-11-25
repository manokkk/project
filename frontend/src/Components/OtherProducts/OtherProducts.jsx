import React from 'react';
import './OtherProducts.css';
import all_product from '../Assets/all_product';
import Item from '../Item/Item';

// Helper function to shuffle the array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
};

const OtherProducts = () => {
  // Shuffle the array and select the first 4 items
  const randomProducts = shuffleArray(all_product).slice(0, 4);

  return (
    <div className='otherproducts'>
      <h1>Other products</h1>
      <hr />
      <div className="otherproducts-item">
        {randomProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OtherProducts;
