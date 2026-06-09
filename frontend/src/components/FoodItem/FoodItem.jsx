import { useContext } from 'react';
import PropTypes from 'prop-types';
import './FoodItem.css';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ id, name, price, desc, image }) => {
  const { cartItems, addToCart, removeFromCart, currency } = useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img 
          className='food-item-image' 
          src={image} // Use the image directly as it's already imported
          alt={name}
          onError={(e) => {
            console.error('Image failed to load:', e.target.src);
            e.target.onError = null; // Prevent infinite loop
            e.target.src = '/src/assets/food_1.png'; // Fallback image path
          }}
        />
        {!cartItems[id] ? (
          <img
            className='add'
            onClick={() => addToCart(id)}
            src="/src/assets/add_icon_white.png"
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img
              src="/src/assets/remove_icon_red.png"
              onClick={() => removeFromCart(id)}
              alt="Remove item"
            />
            <p>{cartItems[id]}</p>
            <img
              src="/src/assets/add_icon_green.png"
              onClick={() => addToCart(id)}
              alt="Add more"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src="/src/assets/rating_starts.png" alt="Rating stars" />
        </div>
        <p className="food-item-desc">{desc}</p>
        <p className="food-item-price">{currency}{price}</p>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  desc: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object // For imported images
  ]).isRequired,
};

export default FoodItem;