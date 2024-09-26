import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useGetFilteredProductsQuery } from '../redux/api/productApiSlice'
import { setCategories, setProducts, setChecked } from '../redux/features/shop/shopSlice'
import Loader from "../components/Loader";
import { useFetchAllCategoriesQuery } from "../redux/api/categoryApiSlice";
import ProductCard from "./Products/ProductCard";

const Shop = () => {

    const dispatch = useDispatch();
    const { categories, products, checked, radio } = useSelector(state => state.shop);

    const categoriesQuery = useFetchAllCategoriesQuery();

    const [priceFilter, setPriceFilter] = useState('');

    const filteredProductsQuery = useGetFilteredProductsQuery({
        checked, radio
    })
    console.log('filteredProductsQuery', filteredProductsQuery)

    useEffect(() => {
        if (!categoriesQuery.isLoading) {
            dispatch(setCategories(categoriesQuery.data))
        }
    }, [categoriesQuery.data, dispatch]);

    useEffect(() => {
        if (!checked.length || !radio.length) {
            if (!filteredProductsQuery.isLoading) {
                // Filter products based on both checked categories and price filter
                const filteredProducts = filteredProductsQuery.data.filter((product) => {
                    // check if the product price includes the entered price filter value
                    return (product.price.toString().includes(priceFilter) || product.price === parseInt(priceFilter, 10));
                });

                dispatch(setProducts(filteredProducts));
            }
        }
    }, [filteredProductsQuery.data, priceFilter, dispatch, checked, radio]);

    const handleBrandClick = (brand) => {
        const productsByBrand = filteredProductsQuery.data?.filter((product) => product.brand === brand);
        dispatch(setProducts(productsByBrand));
    };

    const handleCheck = (value, id) => {
        const updatedChecked = value ? [...checked, id] : checked.filter(c => c !== id);
        dispatch(setChecked(updatedChecked));
    };

    // add "All Brands" option to uniqueBrands
    const uniqueBrands = [
        ...Array.from(
            new Set(
                filteredProductsQuery.data?.map(
                    (product) => product.brand
                ).filter(
                    (brand) => brand !== undefined
                )
            )
        )
    ];
    // console.log('unique', uniqueBrands)

    const handlePriceChange = (e) => {
        // update the price filter state when the user types in the input field
        setPriceFilter(e.target.value);
    }

    return (
        <>
            <div className="container mx-auto ml-12">
                <div className="flex md:flex-row">
                    <div className="bg-[#151515] p-3 mt-2 mb-2">

                        <h2 className="h-4 text-center py-2 bg-black rounded-full mb-2">Filter by Categories</h2>
                        <div className="p-5 w-[15rem]">
                            {
                                categories?.map((c) => (
                                    <div key={c._id} className="mb-2">
                                        <div className="flex items-center mr-4">
                                            <input
                                                type="checkbox"
                                                id="red-checkbox"
                                                onChange={(e) => handleCheck(e.target.checked, c._id)}
                                                className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label
                                                htmlFor="pink-checkbox"
                                                className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                                            >
                                                {c.name}
                                            </label>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <h2 className="h-4 text-center py-2 bg-black rounded-full mb-2">Filter by Brands</h2>
                        <div className="p-5 w-[15rem">
                            {
                                uniqueBrands?.map((brand) => (
                                    <>
                                        <div className="flex items-center mr-4 mb5">
                                            <input
                                                type="radio"
                                                id={brand}
                                                name="brand"
                                                onChange={() => handleBrandClick(brand)}
                                                className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label htmlFor="pink-radio"
                                                className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                                            >{brand}</label>
                                        </div>
                                    </>
                                ))
                            }
                        </div>

                        <h2 className="h-4 text-center py-2 bg-black rounded-full mb-2">Filter by Price</h2>
                        <div className="p-5 w-[15rem]">
                            <input 
                                type="text" 
                                placeholder="Enter Price" 
                                value={priceFilter} 
                                onChange={handlePriceChange}
                                className="w-full px-3 py-2 placeholder:placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
                            />
                        </div>
                        <div className="p-5 pt-0">
                            <button onClick={()=>window.location.reload()} className="w-full border my-4">
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="p-3">
                        <h2 className="h-4 text-center mb-2">{products.length} Products</h2>
                        <div className="flex flex-wrap">
                            {
                                products.length === 0 ? (
                                    <Loader/>
                                ) : (
                                    products.map((p) => (
                                        <div className="p-3" key={p._id}>
                                            <ProductCard p={p}/>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Shop