import { Outlet } from 'react-router-dom';
import Navigation from './pages/Auth/Navigation';
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <>
      <ToastContainer />
      <div className='flex w-full'>
        <Navigation />
        <main className='py-3 ml-[10%] w-[90%] sm:ml-[5%] sm:w-[95%]'>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App


