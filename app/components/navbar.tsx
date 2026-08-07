import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 top-5 z-10 mx-auto flex w-full max-w-[1100px] flex-wrap justify-center gap-4 rounded-full bg-black px-4 py-3 shadow-lg border border-blue-950 backdrop-blur-md bg-opacity-60 text-white sm:px-6">
        <button className='bg-gradient-to-r from-blue-500 to-green-400 py-1 px-6 rounded-3xl shadow-2xl text-white text-lg font-semibold hover:from-blue-600 hover:to-green-500 hover:shadow-green-500 shadow-blue-500'>REST <span>Explorer</span></button>
        <nav className ='flex flex-wrap justify-center gap-4 text-xl'>
          <NavLink className={({isActive}) => isActive ? "text-white border-b-2 border-blue-400 no-underline" : "text-white no-underline"} to="/">Home</NavLink>
          <NavLink className={({isActive}) => isActive ? "text-white border-b-2 border-blue-400 no-underline" : "text-white no-underline"} to="/countries">Countries</NavLink>
          <NavLink className={({isActive}) => isActive ? "text-white border-b-2 border-blue-400 no-underline" : "text-white no-underline"} to="/About">About</NavLink>
        </nav>
    </div>
    // <div>
    //     <div>
    //         <div>
    //             <NavLink to="/">
    //             <span>
    //                 {" "}
    //                 REST <span>Explorer</span>
    //             </span>
    //             </NavLink>
    //             <nav>
    //                 <NavLink to="/">Home</NavLink>
    //                 <NavLink to="/countries">Countries</NavLink>
    //                 <NavLink to="/About">About</NavLink>
    //             </nav>
    //         </div>
    //     </div>
    // </div>
  )
}

export default Navbar