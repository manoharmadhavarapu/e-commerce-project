import { useGetTopProductsQuery } from "../../redux/api/productApiSlice"
import Message from "../../components/Message"
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";


const ProductCarousel = () => {

    const { data: products , isLoading, error} = useGetTopProductsQuery();

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
    }
  return (
    <div className="mb-4 xl:block lg:block md:block">
        {
            isLoading ? null : error ? (
                <Message variant={'danger'}>
                    {error?.data?.message || error.message}
                </Message>
            ) : (
                <Slider {...settings} className=" hidden xl:w-[45rem] lg:w-[43rem] md:w-[40rem] sm:w-[37rem]">
                    {
                        products.map(({image, _id, name, price, description, brand, createdAt, numReviews, rating, quantity, countInStock}) => (
                            <div key={_id}>
                                <img src={image} alt={name} className="w-full rounded-lg object-fill h-[28rem]" />

                                <div className="flex justify-between w-[20rem]">
                                    <div className="one">
                                        <h2>{name}</h2>
                                        <p>₹ {price}</p> <br />
                                        <p className="w-[25rem]">{description.substring(0,170)}...</p>
                                    </div>
                                </div>

                                <div className="flex justify-between w-[20rem]">
                                    <div className="one">
                                        <h1 className="flex items-center mb-6 w-[8rem]">
                                            <FaStore className="mr-2 text-white"/> Brand: {brand}
                                        </h1>
                                        <h1 className="flex items-center mb-6 w-[8rem]">
                                            <FaClock className="mr-2 text-white"/> Added: {moment(createdAt).fromNow()}
                                        </h1>
                                        <h1 className="flex items-center mb-6 w-[8rem]">
                                            <FaStar className="mr-2 text-white"/> Reviews: {numReviews}
                                        </h1>
                                    </div>

                                    <div className="two">
                                        <h1 className="flex items-center mb-6  w-[8rem]">
                                            <FaStar className="mr-2 text-white"/> Ratings: {' '} {Math.round(rating)}
                                        </h1>
                                        <h1 className="flex items-center mb-6  w-[8rem]">
                                            <FaShoppingCart className="mr-2 text-white"/> Quantity: {quantity}
                                        </h1>
                                        <h1 className="flex items-center mb-6  w-[8rem]">
                                            <FaBox className="mr-2 text-white"/> In Stock : {countInStock}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </Slider>
            )
        }
    </div>
  )
}

export default ProductCarousel