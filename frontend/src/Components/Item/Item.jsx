import React from 'react';
import './Item.css'; // Assuming you have styling here

const Item = ({ id, name, image, new_price, old_price, description, category }) => {
  return (
    <div className="item" style={{ padding: '15px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      {/* Product Image */}
      <img src={image} alt={name} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
      
      {/* Product Name */}
      <h3 style={{ fontSize: '16px', color: '#333', marginTop: '10px' }}>{name}</h3>

      {/* Price */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
        {old_price && <span style={{ textDecoration: 'line-through', color: '#888' }}>₱{old_price}</span>}
        <span style={{ fontWeight: 'bold', color: '#000' }}>₱{new_price}</span>
      </div>

      {/* Product Description */}
      <p style={{ fontSize: '14px', color: '#555', marginTop: '10px', height: '50px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {description}
      </p>

      {/* Category */}
      <p style={{ fontSize: '14px', color: '#777', marginTop: '5px' }}>{category}</p>
    </div>
  );
};

export default Item;
