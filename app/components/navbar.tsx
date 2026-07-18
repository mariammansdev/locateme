import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <div className="fixed w-[80%] bg-black flex justify-center items-center gap-16 py-3 px-10  top-[20px] rounded-full backdrop-blur-md bg-opacity-60 text-white shadow-lg border border-blue-950 z-10">
        <button className='bg-gradient-to-r from-blue-500 to-green-400 py-1 px-6 rounded-3xl shadow-2xl text-wite text-lg font-semibold hover:from-blue-600 hover:to-green-500 hover:shadow-green-500 shadow-blue-500'>REST <span>Explorer</span></button>
        <div>
            <nav className ='flex gap-8 text-xl '>
              <NavLink className={({isActive}) => isActive ? "text-white border-b-2 border-blue-400 no-underline" : "text-white no-underline"} to="/">Home</NavLink>
              <NavLink className={({isActive}) => isActive ? "text-white border-b-2 border-blue-400 no-underline" : "text-white no-underline"} to="/countries">Countries</NavLink>
              <NavLink className={({isActive}) => isActive ? "text-white border-b-2 border-blue-400 no-underline" : "text-white no-underline"} to="/About">About</NavLink>
            </nav>
        </div>
        

    </ div>
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