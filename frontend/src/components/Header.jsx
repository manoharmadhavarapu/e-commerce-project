import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProduct";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice"
import Loader from "./Loader";

const Header = () => {
    const { data, isLoading, error } = useGetTopProductsQuery();
    console.log(data)

    if(isLoading) {
        return <Loader/>
    }

    if(error) {
        return <h1>ERROR</h1>
    }

  return (
    <>
        <div className="hidden sm:flex sm:justify-around">
            <div className="xl:block hidden">
                <div className="grid grid-cols-2">
                    {
                        data.map((product)=>(
                            <div key={product._id}>
                                <SmallProduct product={product}/>
                            </div>
                        ))
                    }
                </div>
            </div>
            <ProductCarousel/>
        </div>
    </>
  )
}

export default Header