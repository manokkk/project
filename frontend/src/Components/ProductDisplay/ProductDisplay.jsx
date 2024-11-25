import React, { useState, useContext } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);

  // State for snackbar and quantity
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Handle Snackbar open/close
  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Handle quantity change
  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Snackbar Alert component
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <img className="productdisplay-main-img" src={product.image} alt="" />
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" style={{ filter: 'invert(1)' }} />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">₱{product.old_price}</div>
          <div className="productdisplay-right-price-new">₱{product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          <p>
            asdasvda sdjshbjasj hvasjhdvhjdbvcahs dvkaskdjgaksdv ckashvd dca.
          </p>
        </div>

        {/* Quantity section */}
        <div className="productdisplay-quantity">
          <button className="quantity-button" onClick={decreaseQuantity}>-</button>
          <span className="quantity-display">{quantity}</span>
          <button className="quantity-button" onClick={increaseQuantity}>+</button>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            addToCart(product.id, quantity); // Pass quantity here
            handleSnackbarOpen();
          }}
        >
          ADD TO CART
        </Button>
        <p className="productdisplay-right-category">
          <span>Category :</span> Smartphone
        </p>
      </div>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {`${product.name} has been added to your cart!`}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductDisplay;
