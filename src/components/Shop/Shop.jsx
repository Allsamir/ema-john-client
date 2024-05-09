import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const savedCart = useLoaderData();
  const [cart, setCart] = useState(savedCart);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const numberOfPages = Math.ceil(totalProducts / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()];
  //   useEffect(() => {
  //     fetch("http://localhost:5000/products")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const { result, totalProducts } = data;
  //         setProducts(result);
  //         setTotalProducts(totalProducts);
  //       });
  //   }, []);

  // useEffect(() => {
  //   const storedCart = getShoppingCart();
  //   const savedCart = [];
  //   // step 1: get id of the addedProduct
  //   for (const id in storedCart) {
  //     // step 2: get product from products state by using id
  //     const addedProduct = products.find((product) => product._id === id);
  //     if (addedProduct) {
  //       // step 3: add quantity
  //       const quantity = storedCart[id];
  //       addedProduct.quantity = quantity;
  //       // step 4: add the added product to the saved cart
  //       savedCart.push(addedProduct);
  //     }
  //     // console.log('added Product', addedProduct)
  //   }
  //   // step 5: set the cart
  //   setCart(savedCart);
  // }, [products]);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${pageNumber}&itemsPerPage=${itemsPerPage}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const { result, totalProducts } = data;
        setProducts(result);
        setTotalProducts(totalProducts);
      })
      .catch((err) => console.error(err));
  }, [pageNumber, itemsPerPage]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handlePageNumber = (currentPageNumber) => {
    setPageNumber(currentPageNumber);
  };

  const handleItemsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPageNumber(1);
  };
  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <button
          onClick={() => {
            if (pageNumber > 1) {
              setPageNumber(pageNumber - 1);
            }
          }}
        >
          «
        </button>
        {pages.map((button, index) => (
          <button
            key={index}
            style={{
              margin: "0 10px 0 10px",
              backgroundColor: `${
                pageNumber === index + 1 ? "black" : "white"
              }`,
              color: `${pageNumber === index + 1 ? "white" : "black"}`,
            }}
            onClick={() => {
              handlePageNumber(index + 1);
            }}
          >
            {button + 1}
          </button>
        ))}
        <select
          name="itemsPerPage"
          id=""
          style={{ width: "80px", height: "40px", margin: "0 10px 0 10px" }}
          onChange={handleItemsPerPage}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <button
          onClick={() => {
            if (pageNumber < numberOfPages) setPageNumber(pageNumber + 1);
          }}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Shop;
