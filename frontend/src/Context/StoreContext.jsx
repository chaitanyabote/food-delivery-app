import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { food_list as staticFoodList, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currency = "$";
    const deliveryCharge = 10;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            try {
                await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
            } catch (err) {
                console.error("Error adding to cart:", err);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            try {
                await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
            } catch (err) {
                console.error("Error removing from cart:", err);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
            return true;
        } catch (err) {
            console.error("Error fetching food list:", err);
            setError(err);
            // Fallback to static data if API fails
            setFoodList(staticFoodList);
            return false;
        }
    };

    const loadCartData = async (userToken) => {
        try {
            const response = await axios.post(
                `${url}/api/cart/get`,
                {},
                { headers: { token: userToken } }
            );
            setCartItems(response.data.cartData || {});
        } catch (err) {
            console.error("Error loading cart data:", err);
        }
    };

    useEffect(() => {
        async function loadData() {
            try {
                const foodLoaded = await fetchFoodList();
                
                if (localStorage.getItem("token")) {
                    const storedToken = localStorage.getItem("token");
                    setToken(storedToken);
                    if (foodLoaded) { // Only load cart if food data loaded successfully
                        await loadCartData(storedToken);
                    }
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list: food_list.length > 0 ? food_list : staticFoodList, // Fallback to static data
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        loading,
        error
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

StoreContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default StoreContextProvider;