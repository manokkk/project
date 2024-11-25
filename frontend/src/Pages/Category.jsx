import React, { useContext, useState } from 'react';
import './CSS/Category.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const Category = (props) => {
  const { all_product } = useContext(ShopContext);
  const [visibleProducts, setVisibleProducts] = useState(4); // Initially show 4 products
  const [sortBy, setSortBy] = useState('low-to-high'); // State to track sorting option

  const handleExploreMore = () => {
    setVisibleProducts(prev => prev + 4); // Show 4 more products when the button is clicked
  };

  const handleSortChange = () => {
    // Toggle between low-to-high and high-to-low price sorting
    setSortBy(prevSort => (prevSort === 'low-to-high' ? 'high-to-low' : 'low-to-high'));
  };

  const filteredProducts = all_product.filter(item => item.category === props.category);

  // Sort products based on price, from low to high or high to low
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortBy === 'low-to-high') {
      return a.new_price - b.new_price;
    } else {
      return b.new_price - a.new_price;
    }
  });

  return (
    <div className='category'>
      <Navbar />
      <img className='category-banner' src={props.banner} alt="" />
      <div className="category-indexSort">
        <p>
          <span>Showing 1-{Math.min(visibleProducts, sortedProducts.length)}</span> out of {sortedProducts.length} products
        </p>
        <div className="category-sort" onClick={handleSortChange}>
          Sort by price {sortBy === 'low-to-high' ? 'Lowest to Highest' : 'Highest to Lowest'} <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className="category-products">
        {sortedProducts.slice(0, visibleProducts).map((item, i) => (
          <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        ))}
      </div>

      {visibleProducts < sortedProducts.length && (
        <div className="category-loadmore" onClick={handleExploreMore}>
          Explore More
        </div>
      )}
    </div>
  );
}

export default Category;
