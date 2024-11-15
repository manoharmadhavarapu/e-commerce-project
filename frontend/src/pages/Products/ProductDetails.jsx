import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../../redux/api/productApiSlice';
import Loader from "../../components/Loader";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Message from "../../components/Message";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
    console.log('first',product)

    const { userInfo } = useSelector(state => state.auth);

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            
            await createReview({
                productId, rating, comment
            }).unwrap();

            refetch();
            toast.success("Review Successfully Added")
        } catch (error) {
            toast.error(error?.data || error.message)
        }
    }

    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty}));
        navigate('/cart')
    }

    return (
        <>
            <div>
                <Link to={`/`} className="text-white font-semibold hover:underline ml-[10rem]">
                    Go Back
                </Link>
            </div>

            {
                isLoading ? (<Loader />) : error ? (<Message variant={'danger'}>
                    {error?.data?.message || error.message}
                </Message>) : (
                    <>
                        <div className="flex flex-col justify-center items-center relative mt-[2rem]">
                            <div>
                                <img src={product.image} alt={product.name} className="w-[90%] mx-auto xl:w-[45rem] lg:w-[40rem] md:w-[30rem] sm:w-[20rem]" />
                                <HeartIcon product={product} />
                            </div>

                            <div className="flex flex-col justify-between ">
                                <h2 className="mt-3 text-base sm:text-2xl font-semibold">{product.name}</h2>
                                <p className="my-2 sm:my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0] ">{product.description}</p>
                                <p className="text-base sm:text-3xl my-2 sm:my-4 font-extrabold ">₹ {product.price}</p>
                                <div className="flex items-center justify-between w-[20rem]">
                                    <div className="one">
                                        <h1 className="flex items-center mb-3 sm:mb-6">
                                            <FaStore className="mr-2 text-white" /> Brand: {" "} {product.brand}
                                        </h1>
                                        <h1 className="flex items-center mb-3 sm:mb-6">
                                            <FaClock className="mr-2 text-white" /> Added: {" "} {moment(product.createdAt).fromNow()}
                                        </h1>
                                        <h1 className="flex items-center mb-3 sm:mb-6">
                                            <FaStar className="mr-2 text-white" /> Reviews: {" "} {product.numReviews}
                                        </h1>
                                    </div>

                                    <div className="two">
                                        <h1 className="flex items-center mb-3 sm:mb-6">
                                            <FaStar className="mr-2 text-white" /> Ratings: {" "} {product.rating}
                                        </h1>
                                        <h1 className="flex items-center mb-3 sm:mb-6">
                                            <FaShoppingCart className="mr-2 text-white" /> Quantity: {" "} {product.quantity}
                                        </h1>
                                        <h1 className="flex items-center mb-3 sm:mb-6">
                                            <FaBox className="mr-2 text-white" /> In Stock: {" "} {product.countInStock}
                                        </h1>
                                    </div>
                                </div>

                                <div className="flex justify-between flex-wrap">
                                    {/* Ratings */}
                                    <Ratings value={product.rating} text={`${product.numReviews} reviews`}/>

                                    {
                                        product.countInStock > 0 && (
                                            <div>
                                                <select value={qty} onChange={e=>setQty(e.target.value)} className="p-1 sm:p-2 w-[6rem] rounded-lg text-black">
                                                    {
                                                        [...Array(product.countInStock).keys()].map((num)=>(
                                                            <option key={num+1} value={num + 1}>
                                                                {num+1}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="btn-container">
                                    <button 
                                        onClick={addToCartHandler} 
                                        disabled={product.countInStock === 0}
                                        className="bg-pink-600 text-white disabled:cursor-not-allowed py-1 px-2 sm:py-2 sm:px-4 rounded-lg mt-4 md:mt-0 cursor-pointer"
                                    > Add To Cart</button>
                                </div>
                            </div>

                            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
                                {/* ProductTabs */}
                                <ProductTabs 
                                    loadingProductReview={loadingProductReview} 
                                    userInfo={userInfo}
                                    submitHandler={submitHandler}
                                    rating={rating}
                                    setRating={setRating}
                                    comment={comment}
                                    setComment={setComment}
                                    product={product}
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </>

    )
}

export default ProductDetails