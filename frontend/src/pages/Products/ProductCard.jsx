import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice'
import { toast } from 'react-toastify';
import HeartIcon from './HeartIcon'

const ProductCard = ({ p }) => {

    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({...product, qty}));
        toast.success("Item added successfully to cart")
        // navigate('/cart')
    }

    return (
        <div className='relative w-[280px]  bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
            <section className='relative'>
                <Link to={`/product/${p._id}`}>
                    <span className='absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300'>
                        {p?.brand}
                    </span>

                    <img
                        style={{ height: "170px", width:'100%', objectFit: "fill" }}
                        className='cursor-pointer w-[16rem]'
                        src={p.image}
                        alt={p.name}
                    />

                </Link>
                <HeartIcon product={p} />
            </section>

            <div className="p-5 overflow-x-hidden">
                <div className="flex items-center justify-between">
                    <h5 className='mb-2 text-lg text-white dark:text-white'>{p?.name}</h5>
                    <p className='font-semibold text-pink-500'>{p?.price?.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: "INR"
                    })}</p>
                </div>

                <p className="mb-3 font-normal text-[#CFCFCF] w-[280px]">
                    {p.description.length >= 30 ? p?.description?.substring(0, 30) + "..." : p.description}
                </p>

                <section className='flex items-center justify-between'>
                    <Link to={`/product/${p._id}`}
                        className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800'
                    >
                        Read More
                        <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </Link>

                    <button className='p-2 rounded-full' onClick={()=>addToCartHandler(p, 1)}>
                        <AiOutlineShoppingCart size={26}/>
                    </button>
                </section>
            </div>
        </div>
    )
}

export default ProductCard