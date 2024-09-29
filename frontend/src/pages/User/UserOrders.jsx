import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { Link } from "react-router-dom"
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice"

const UserOrders = () => {

    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

            {
                isLoading ? (<Loader />) : error ? (
                    <Message variant={'danger'}>{error?.data?.error || error.message}</Message>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <td className="px-1 py-2 text-left">IMAGE</td>
                                <td className="px-1 py-2 text-left">ID</td>
                                <td className="px-1 py-2 text-left">DATE</td>
                                <td className="px-1 py-2 text-left">TOTAL</td>
                                <td className="px-1 py-2 text-left">PAID</td>
                                <td className="px-1 py-2 text-left">DELIVERED</td>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="py-2">
                                            <img className="w-16 h-16 object-cover" src={order.orderItems[0].image} alt={order.user} />
                                        </td>

                                        <td className="py-2">{order._id}</td>
                                        <td className="py-2">{order.createdAt.substring(0, 10)}</td>
                                        <td className="py-2">₹ {order.totalPrice}</td>

                                        <td className="py-2">
                                            {order.isPaid ? (
                                                <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">Completed</p>
                                            ) : (
                                                <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">Pending</p>
                                            )}
                                        </td>

                                        <td className="px-2 py-2">
                                            {
                                                order.isDelivered ? (
                                                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">Completed</p>
                                                ) : (
                                                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">Pending</p>
                                                )
                                            }
                                        </td>

                                        <td className="px-2 py-2">
                                            <Link to={`/order/${order._id}`}>
                                                <button className="bg-pink-400 text-black py-2 px-3 rounded">
                                                    View Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}

export default UserOrders