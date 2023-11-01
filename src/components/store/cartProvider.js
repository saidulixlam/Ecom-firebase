import { useState, useEffect, useContext } from "react";
import CartContext from "./cart-context";
import AuthContext from "../../authCtx/auth-context";
import axios from "axios";

const CartProvider = (props) => {
  const [items, setItems] = useState([]);
  const authCtx = useContext(AuthContext);
  const useremail = authCtx.email;
  const isLoggedIn = authCtx.isLoggedIn;
  const baseURL = 'https://ecommercereact-c3165-default-rtdb.firebaseio.com';

  const getItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/expenses/${useremail}.json`);
      const fetchedItems = response.data ? Object.entries(response.data).map(([id, item]) => ({ id, ...item })) : [];
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error retrieving cart items:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getItems(); // Initial fetch on login
      const fetchDataRealTime = async () => {
        const dataRef = `${baseURL}/expenses/${useremail}.json`;
        const eventSource = new EventSource(dataRef);
        eventSource.onmessage = async (event) => {
          if (event.data === 'null') {
            setItems([]);
          } else {
            const fetchedItems = JSON.parse(event.data);
            setItems(Object.values(fetchedItems));
          }
        };
      };
      fetchDataRealTime();
    }
  }, [isLoggedIn]);

  const addItemHandler = async (item) => {
    try {
      const existingItem = items.find(existingItem => existingItem.title === item.title);

      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity
        };

        await axios.put(`${baseURL}/expenses/${useremail}/${existingItem.id}.json`, updatedItem);

        const updatedItems = items.map(dataItem => {
          if (dataItem.id === existingItem.id) {
            return updatedItem;
          }
          return dataItem;
        });

        setItems(updatedItems);
      } else {
        const res = await axios.post(`${baseURL}/expenses/${useremail}.json`, item);

        if (res.status === 200) {
          getItems(); // Refresh the items from the database
        }
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItemHandler = async (id) => {
    try {
      await axios.delete(`${baseURL}/expenses/${useremail}/${id}.json`);
      const updatedItemsArray = items.filter(item => item.id !== id);
      setItems(updatedItemsArray);
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const cartContext = {
    items: items,
    addItem: addItemHandler,
    removeItem: removeItemHandler
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
