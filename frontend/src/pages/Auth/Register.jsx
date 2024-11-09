import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector(state => state.auth);

    const { search } = useLocation();
    console.log('useLocation', useLocation())
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
    console.log(sp, redirect)

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        }
        else {
            try {
                const res = await register({ username, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
                toast.success('User successfully registered');
            } catch (error) {
                console.log(error);
                toast.error(error.data.message);
            }
        }
    }

    return (
        <section className="lg:pl-[10rem] flex flex-wrap justify-center items-center">
            <div className="mr-[4rem] mt-[5rem]">
                <h1 className="text-2xl font-semibold mb-4">Register</h1>

                <form onSubmit={submitHandler} className="container w-[14rem] sm:w-[32rem] md:w-[36rem] lg:w-[40rem]">
                    <div className="my-[2rem]">
                        <label htmlFor="name" className="block text-sm font-medium">Name</label>
                        <input type="text" id="name" className="mt-1 p-2 border rounded w-full" placeholder="Enter name" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className="my-[2rem]">
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input type="email" id="email" className="mt-1 p-2 border rounded w-full" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="my-[2rem]">
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input type="password" id="password" className="mt-1 p-2 border rounded w-full" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="my-[2rem]">
                        <label htmlFor="cPassword" className="block text-sm font-medium">Confirm Password</label>
                        <input type="password" id="cPassword" className="mt-1 p-2 border rounded w-full" placeholder="Enter Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <button disabled={isLoading} type="submit" className="bg-pink-500 px-4 py-2 rounded cursor-ponter my-[1rem]">
                        {isLoading ? "Registering..." : "Register"}
                    </button>

                    {isLoading && <Loader />}
                </form>

                <div className="mt-4">
                    <p>
                        Already have an account? {""}
                        <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-pink-500 hover:underline">Login</Link>
                    </p>
                </div>
            </div>

            {/* <img
                src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
                alt=""
                className="h-[40rem] w-[40%] xl:block md:hidden sm:hidden rounded-lg"
            /> */}
        </section>
    )
}

export default Register