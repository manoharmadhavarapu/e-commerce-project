import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // createOrder
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: "POST",
                body: order,
            })
        }),

        // findOrderById
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
            })
        }),

        // markOrderAsPaid
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: "PUT",
                body: details,
            })
        }),

        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            })
        }),

        // getUserOrders
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`
            }),
            keepUnusedDataFor: 5
        }),

        // getAllOrders
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
            })
        }),

        // markOrderAsDelivered
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: "PUT",
            })
        }),

        // countTotalOrders
        getTotalOrders: builder.query({
            query: () => `${ORDERS_URL}/total-orders`
        }),

        // calculateTotalSales
        getTotalSales: builder.query({
            query: () => `${ORDERS_URL}/total-sales`
        }),

        // calculateTotalSalesByDate
        getTotalSalesByDate: builder.query({
            query: () => `${ORDERS_URL}/total-sales-by-date`
        })
    })
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useGetMyOrdersQuery,
    useDeliverOrderMutation,
    useGetOrdersQuery,
    // ----------------------->
    useGetTotalOrdersQuery,
    useGetTotalSalesQuery,
    useGetTotalSalesByDateQuery,
} = orderApiSlice;