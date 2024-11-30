import React from 'react'
import logo from '../assets//images/Logo.png'

const NavLinks = [
    { id: 1, name: "Home", link: "/#" },
    { id: 2, name: "About", link: "/#" },
    { id: 3, name: "Contact", link: "/#" },
  ];

const Navbar = () => {
  return (
    <div className='bg-white shadow-md'>
        <div className="container flex justify-between py-4 sm:py-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-10" />
                <div className="font-bold text-2xl">Lizaso Laundry Hub</div>
            </div>
            {/* Navlinks Section*/}
            <div>
                <ul className='flex item-center gap-10'>
                    { 
                        NavLinks.map(({id, name, link}) => (
                            <li key={id}>
                                <a href={link} className='inline-block hover:text-primary text-xl font-semibold'>{name}</a>
                            </li>
                        ))
                    }
                    {/* Login Button */}
                    <li>
                        <button className='flex justify-center items-center gap-2'>
                            My Account
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Navbar