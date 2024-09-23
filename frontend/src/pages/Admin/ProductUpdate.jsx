import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProductMutation, useDeleteProductMutation, useGetProductByIdQuery, useUploadProductImageMutation } from '../../redux/api/productApiSlice';
import { useFetchAllCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductUpdate = () => {

    const params = useParams();
    const { data: productData } = useGetProductByIdQuery(params._id);
    console.log(productData, 'productData');

    const [image, setImage] = useState(productData?.image || "");
    const [name, setName] = useState(productData?.name || "");
    const [description, setDescription] = useState(productData?.description || "");
    const [price, setPrice] = useState(productData?.price || "");
    const [category, setCategory] = useState(productData?.category || "");
    const [brand, setBrand] = useState(productData?.brand || "");
    const [stock, setStock] = useState(productData?.countInStock || "");
    const [quantity, setQuantity] = useState(productData?.quantity || "");

    const navigate = useNavigate();

    const { data: categories = [] } = useFetchAllCategoriesQuery();
    const [uploadProductImage] = useUploadProductImageMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    useEffect(() => {
        if (productData && productData._id) {
            setName(productData?.name);
            setDescription(productData?.description);
            setPrice(productData?.price);
            setCategory(productData?.category);
            setQuantity(productData?.quantity);
            setBrand(productData?.brand);
            setImage(productData?.image);
            setStock(productData?.countInStock);
        }
    }, [productData]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success("Items added successfully");
            setImage(res.image);
        } catch (error) {
            toast.error(error)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {

            const formData = new FormData();
            formData.append('name', name)
            formData.append('image', image)
            formData.append('description', description)
            formData.append('price', price)
            formData.append('category', category)
            formData.append('quantity', quantity)
            formData.append('brand', brand)
            formData.append('countInStock', stock)

            const {data} = await updateProduct({productId: params._id, formData});

            if(data.error) {
                toast.error(data.error);
            }else {
                toast.success(`Product successfully updated`);
                navigate('/admin/allproductslist')
            }
            
            
        } catch (error) {
            console.log(error);
            toast.error("Product update failed. Try again")
        }
    }

    const handleDelete = async () => {

        try {

            let answer = window.confirm("Are you sure you want to delete this product");
            if(!answer) {
                return;
            }

            const {product} = await deleteProduct(params._id).unwrap();
            toast.success(`${product.name} is deleted`);
            navigate('/admin/allproductslist')
            
        } catch (error) {
            console.log(error);
            toast.error("Delete failed, try again...")
        }
    }


    return (
        <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                {/* Admin Menu */}
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <div className="h-12">
                        Create Product
                    </div>

                    {
                        image && (
                            <div className="text-center">
                                <img src={image} alt="product" className="block mx-auto h-[200px]" />
                            </div>
                        )
                    }

                    <div className="mb-3">
                        <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                            {image ? image.name : "Upload Image"}
                            <input type="file" name="image" accept="image/*"
                                onChange={uploadFileHandler} 
                                className={!image ? 'hidden' : 'text-white'}
                            />
                        </label>
                    </div>

                    <div className="p-3">

                        <div className="flex flex-wrap">
                            <div className="one">
                                <label htmlFor="name">Name</label> <br />
                                <input type="text" id="name" className="px-4 py-2 mb-3 w-[30rem] rounded-lg border bg-[#101011] text-white" value={name} onChange={e => setName(e.target.value)} />
                            </div>

                            <div className="two ml-10">
                                <label htmlFor="name block">Price</label> <br />
                                <input type="number" id="name block" className="px-4 py-2 mb-3 w-[30rem] rounded-lg border bg-[#101011] text-white" value={price} onChange={e => setPrice(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex flex-wrap">
                            <div className="one">
                                <label htmlFor="name block">Quantity</label> <br />
                                <input type="number" id="name block" className="px-4 py-2 mb-3 w-[30rem] rounded-lg border bg-[#101011] text-white" value={quantity} onChange={e => setQuantity(e.target.value)} />
                            </div>

                            <div className="two ml-10">
                                <label htmlFor="name block">Brand</label> <br />
                                <input type="text" id="name block" className="px-4 py-2 mb-3 w-[30rem] rounded-lg border bg-[#101011] text-white" value={brand} onChange={e => setBrand(e.target.value)} />
                            </div>
                        </div>

                        <label htmlFor="" className="my-5">Description</label>
                        <textarea type='text' className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        ></textarea>

                        <div className="flex justify-between">
                            <div>
                                <label htmlFor="name block">Count In Stock</label> <br />
                                <input type="text" className="px-4 py-2 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                    value={stock} onChange={e => setStock(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="">Category</label> <br />
                                <select placeholder="Choose Category" className="px-4 py-2 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white" onChange={e => setCategory(e.target.value)}>
                                    {
                                        categories?.map((category) => {
                                            console.log(category, 'category')
                                            return (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleUpdate} 
                                className="py-2 px-10 rounded-lg text-lg font-bold bg-green-600 mr-6"
                            >
                                Update
                            </button>

                            <button
                                onClick={handleDelete} 
                                className="py-2 px-10 rounded-lg text-lg font-bold bg-pink-600"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate