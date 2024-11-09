import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useLoginMutation } from "../../redux/api/usersApiSlice"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import Loader from "../../components/Loader"


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector(state => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const res = await login({ email, password }).unwrap();
            console.log(res);
            dispatch(setCredentials({ ...res }))
        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    }


    return (
        <div>
            <section className="lg:pl-[10rem] flex flex-wrap justify-center items-center">
                <div className="mr-[4rem] mt-[5rem]">
                    <h1 className="text-2xl font-semibold mb-4">SIgn In</h1>

                    <form onSubmit={submitHandler} className="container w-[14rem] sm:w-[32rem] md:w-[36rem] lg:w-[40rem]">
                        <div className="my-[2rem]">
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email Address
                            </label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 border rounded w-full" />
                        </div>

                        <div className="my-[2rem]">
                            <label htmlFor="email" className="block text-sm font-medium">
                                Password
                            </label>
                            <input type="password" id="passwotd" value={password} onChange={(e) => setpassword(e.target.value)} className="mt-1 p-2 border rounded w-full" />
                        </div>

                        <button disabled={isLoading} type="submit" className="bg-pink-500 px-4 py-2 rounded cursor-pointer my-[1rem]">
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>

                        {
                            isLoading && <Loader />
                        }
                    </form>

                    <div className="mt-4">
                        <p>
                            New Customer ? {" "}
                            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-pink-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default Login