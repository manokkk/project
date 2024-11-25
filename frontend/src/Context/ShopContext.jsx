import React, { createContext, useState, useEffect } from "react";
import all_product from "../Components/Assets/all_product";

// Create context
export const ShopContext = createContext(null);

// Get the default cart state from localStorage or initialize a new cart
const getDefaultCart = () => {
    // Check if there's existing cart data in localStorage
    const savedCart = localStorage.getItem("cart");
    console.log(savedCart)
    if (savedCart) {
        return JSON.parse(savedCart);  // Return the saved cart if available
    } else {
        // Initialize a new cart where the keys are product _id's and values are quantities
        let cart = {};
        all_product.forEach(product => {
            cart[product._id] = 0; // Initialize cart item quantity to 0 for each product
        });
        return cart;
    }
};

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart);

    // Save cart items to localStorage whenever cartItems change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);  // Only run when cartItems changes

    // Add a product to the cart with the specified quantity
    const addToCart = (itemId, quantity) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: prev[itemId] + quantity };
            return updatedCart;
        });
    };

    // Remove one unit of the product from the cart
    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: Math.max(prev[itemId] - 1, 0) };
            return updatedCart;
        });
    };

    // Update the quantity of a specific item in the cart
    const updateCartItemQuantity = (itemId, newQuantity) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: Math.max(newQuantity, 0) }; // Ensure quantity does not go below 0
            return updatedCart;
        });
    };

    // Calculate the total amount in the cart based on quantity and item price
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                // Find the corresponding product by _id
                const itemInfo = all_product.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // Get the total number of items in the cart
    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    // Context value to provide the necessary functions and data
    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity, // Include the update function in the context
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
