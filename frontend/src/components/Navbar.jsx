import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative h-12 w-12 flex items-center justify-center mr-4">
                {/* Stunning Solid Hexagonal Z Logo */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-xl shadow-blue-500/20"></div>
                <svg viewBox="0 0 100 100" className="relative h-7 w-7 transform group-hover:scale-110 transition-transform duration-300">
                  <path 
                    d="M20,25 L80,25 L30,75 L80,75" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="18" 
                    strokeLinecap="square" 
                    strokeLinejoin="miter"
                  />
                </svg>
              </div>
              <div className="flex flex-col leading-none mt-1">
                <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                  ZORO<span className="text-blue-600">COM</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-1 group-hover:text-blue-400 transition-colors">
                  Review Platform
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/add-company"
              className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Company
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
