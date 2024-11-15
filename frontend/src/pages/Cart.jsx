import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash } from "react-icons/fa"
import { addToCart, removeFromcart } from '../redux/features/cart/cartSlice';

const Cart = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    }

    const removeFromCartHandler = (id) => {
        dispatch(removeFromcart(id));
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    }

    return (
        <>
            <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
                {
                    cartItems.length === 0 ? (<div>
                        Your cart is empty <Link className="text-pink-600 hover:underline" to={'/shop'}>Go To Shop</Link>
                    </div>) : (
                        <>
                            <div className="flex flex-col justify-center w-[80%] mx-auto">
                                <h1 className="text-2xl font-semibold mb-4 p-4">Shopping Cart</h1>

                                {
                                    cartItems && cartItems.map(item => (
                                        <div key={item._id} className="flex items-center justify-center p-4 mb-[1rem] pb-2">
                                            <div className="w-[80px] shrink-0 sm:w-[5rem] sm:h-[5rem]">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                            </div>

                                            <div className="flex-1 shrink-0 ml-4">
                                                <Link to={`/product/${item._id}`} className="text-pink-500">{item.name}</Link>
                                                <div className="mt-2 text-white">{item.brand}</div>
                                                <div className="mt-2 text-white font-bold">{item.price} ₹</div>
                                            </div>

                                            <div className="w-24">
                                                <select className="w-[60px] sm:w-full p-1 border rounded text-black"
                                                    value={item.qty}
                                                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                                >
                                                    {
                                                        [...Array(item.countInStock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div>
                                                <button className="text-red-500 mr-[5rem]" onClick={() => removeFromCartHandler(item._id)}>
                                                    <FaTrash className="ml-[1rem]" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }

                                <div className="mt-8 w-[80%] md:w-[90%] lg:w-[95%]">
                                    <div className="p-4 rounded-lg">
                                        <h2 className="text-base sm:text-xl font-semibold">
                                            Items ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)})
                                        </h2>

                                        <div className=" text-base sm:text-2xl font-bold ">
                                            ₹ {
                                                cartItems.reduce((acc, item) => acc + Number(item.qty) * Number(item.price), 0).toFixed(2)
                                            }
                                        </div>

                                        <button
                                            disabled={cartItems.length === 0}
                                            className="bg-pink-500 mt-4 py-2 px-2 sm:px-4 rounded-full text-base sm:text-lg w-full disabled:cursor-not-allowed"
                                            onClick={checkoutHandler}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default Cart