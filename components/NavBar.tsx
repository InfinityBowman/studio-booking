'use client';
import { useState } from 'react';
import Image from 'next/image';
import logo from '~/assets/smblackandred.png';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, error, isLoading } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const roles: string[] = (user?.['https://studentmedia.com/roles'] as string[]) || [];

  return (
    <nav className="bg-gray-800 p-2 flex">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={logo}
              alt="Logo"
              width={200}
              height={200}
            />
          </Link>
          <span className="text-white text-xl ml-2">Studio Booking</span>
        </div>
        <div className="flex flex-row-reverse">
          <div className="block lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
          <div className={`${isOpen ? 'block' : 'hidden'} w-full lg:flex lg:items-center lg:w-auto`}>
            <ul className="lg:flex lg:space-x-4">
              <li>
                <a
                  href="#"
                  className="block text-white py-2 px-4 hover:bg-gray-700 rounded"
                >
                  Home
                </a>
              </li>
              {user ? (
                <>
                  {roles.includes('admin') && (
                    <li>
                      <a
                        href="/admin"
                        className="block text-white py-2 px-4 hover:bg-gray-700 rounded"
                      >
                        Admin
                      </a>
                    </li>
                  )}
                  <li>
                    <a
                      href="/api/auth/logout"
                      className="block text-white py-2 px-4 hover:bg-gray-700 rounded"
                    >
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="/api/auth/login"
                      className="block text-white py-2 px-4 hover:bg-gray-700 rounded"
                    >
                      Login
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
