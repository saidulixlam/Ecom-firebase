import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import CartProvider from './components/store/cartProvider';
import Home from './components/Pages/Home';
import Login from './components/Pages/Login';
// import { Container } from 'react-bootstrap';

// Lazy load these components
const LazyProductList = lazy(() => import('./components/products/ProductList'));
const LazyAbout = lazy(() => import('./components/Pages/About'));
const LazyContactUs = lazy(() => import('./components/Pages/ContactForm'));
const LazyProductDetails = lazy(() => import('./components/products/PoductDetails'));
const LazyCart = lazy(() => import('./components/Cart/Cart'));

const App = () => {
  const [showCart, setShowCart] = useState(false);

  const cartHandler = () => {
    setShowCart(!showCart);
  };

  const closeCart = () => {
    setShowCart(false);
  };

  const cartStyle = {
    position: 'fixed',
    top: '6rem',
    right: showCart ? '0' : '-400px',
    height: '100%',
    width: '400px',
    backgroundColor: 'white',
    zIndex: '999',
    transition: 'right 0.3s ease-in-out',
  };

  const backdropStyle = {
    display: showCart ? 'block' : 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '998',
  };

  async function adduserHandler(user) {
    const res = await fetch('https://ecommerce-react-2638b-default-rtdb.firebaseio.com/users.json', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log(data);
  }

  return (
    <Router>
      <CartProvider>
        <NavBar onClick={cartHandler} />
        <Header />
        <Suspense
          fallback={
            <div className="d-flex justify-content-center align-items-center h-100 my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
        >
          <Switch>
            <Route path="/about">
              <LazyAbout />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/products">
              <LazyProductList />
            </Route>
            <Route path="/contact">
              <LazyContactUs onAddUser={adduserHandler} />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/product/:productId">
              <LazyProductDetails />
            </Route>
            <Route path="/cart">
              <LazyCart />
            </Route>
          </Switch>
        </Suspense>
        <div style={backdropStyle} onClick={closeCart}></div>
        <div style={cartStyle}>
          <LazyCart />
        </div>
      </CartProvider>
    </Router>
  );
};

export default App;
