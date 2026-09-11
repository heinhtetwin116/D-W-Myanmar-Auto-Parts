"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Menu,
  ChevronDown,
  Settings,
  Disc,
  Activity,
  Filter,
  Zap,
  Snowflake,
  RefreshCw,
  Car,
  Droplet,
  Wrench,
  FileText, // Added for the quote button
} from "lucide-react";

const categories = [
  { name: "Engine", icon: Settings },
  { name: "Brakes", icon: Disc },
  { name: "Suspension", icon: Activity },
  { name: "Filtration", icon: Filter },
  { name: "Electrical", icon: Zap },
  { name: "Cooling", icon: Snowflake },
  { name: "Transmission", icon: RefreshCw },
  { name: "Body / Exterior", icon: Car },
  { name: "Oils / Fluids", icon: Droplet },
  { name: "Tools / Accessories", icon: Wrench },
];

const Header = () => {
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm relative">
      {/* TOP BAR */}
      <div className="bg-[#F4F6F8] border-b border-gray-200 text-xs font-medium text-gray-600 relative overflow-hidden hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-8 px-6 relative z-10">
          
          {/* Left Red Banner */}
          <div className="bg-[#A81C24] text-white flex items-center gap-6 px-6 h-full font-semibold relative before:absolute before:right-[-10px] before:top-0 before:border-l-[10px] before:border-l-[#A81C24] before:border-b-[32px] before:border-b-transparent">
            <Link href="#" className="hover:text-gray-200 transition-colors">About Us</Link>
            <Link href="#" className="hover:text-gray-200 transition-colors">Contacts</Link>
            <Link href="#" className="hover:text-gray-200 transition-colors">Track Order</Link>
          </div>

          {/* Center Tagline */}
          <div className="absolute left-1/2 -translate-x-1/2 text-[#0F172A] tracking-wider uppercase text-[10px] font-bold whitespace-nowrap">
            Auto Parts for Cars
          </div>

          {/* Right Dark Navy Banner */}
          <div className="bg-[#0F172A] text-white flex items-center gap-4 px-6 h-full relative before:absolute before:left-[-10px] before:top-0 before:border-r-[10px] before:border-r-[#0F172A] before:border-b-[32px] before:border-b-transparent">
            <span>Currency: <strong className="text-gray-300">MMK</strong></span>
            <span>Language: <strong className="text-gray-300">EN</strong></span>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4 relative">
        
        {/* Left Side Navigation */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-[#0F172A] flex-1">
          <Link href="#" className="hover:text-[#A81C24] transition-colors">
            Home
          </Link>
          <Link href="#" className="hover:text-[#A81C24] transition-colors">
            Catalog
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryHovered(true)}
            onMouseLeave={() => setIsCategoryHovered(false)}
          >
            <button className={`flex items-center gap-1 transition-colors py-4 cursor-pointer ${isCategoryHovered ? 'text-[#A81C24]' : 'hover:text-[#A81C24]'}`}>
              Categories 
              <ChevronDown size={15} className={`transition-transform duration-200 ${isCategoryHovered ? 'rotate-180' : ''}`} />
            </button>
            {isCategoryHovered && (
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl border border-gray-100 rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="bg-[#F4F6F8] px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Shop by Category</span>
                  <Link href="#" className="text-xs font-semibold text-[#A81C24] hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-2 gap-1 p-2">
                  {categories.map((cat, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="group flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-[#F4F6F8] hover:text-[#0F172A] transition-all duration-200"
                    >
                      <div className="bg-white p-2 rounded-md border border-gray-100 shadow-sm group-hover:border-[#A81C24]/30 group-hover:bg-[#A81C24]/5 transition-colors">
                        <cat.icon size={16} className="text-gray-400 group-hover:text-[#A81C24] transition-colors" />
                      </div>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Link href="#" className="hover:text-[#A81C24] transition-colors">
            Inventory
          </Link>
          <Link href="#" className="hover:text-[#A81C24] transition-colors">
            Blogs
          </Link>
        </nav>

        {/* Center Logo Slot */}
        <div className="flex-shrink-0 flex items-center justify-center relative z-30">
        <Link href="/" aria-label="D and W Auto Parts Home" className="relative group">
            {imgError ? (
            <span className="text-2xl font-black tracking-tight text-[#0F172A]">
                D&W<span className="text-[#A81C24]">PARTS</span>
            </span>
            ) : (
            <div className="relative w-36 h-28 -my-6 flex items-center justify-center transition-transform hover:scale-105">
                <Image
                src="/DW_FullLogo.png"
                alt="D&W Auto Parts Logo"
                fill
                className="object-contain drop-shadow-md"
                priority
                onError={() => setImgError(true)}
                />
            </div>
            )}
        </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center justify-end gap-5 flex-1">
          {/* My Account Link */}
          <Link
            href="#"
            className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] hover:text-[#A81C24] transition-colors"
          >
            <Menu size={18} />
            <span className="hidden sm:inline">My Account</span>
          </Link>

          {/* Request a Quote Button (Added) */}
          <Link
            href="#"
            className="flex items-center gap-2 bg-[#A81C24] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#8a161d] transition-colors shadow-sm hover:shadow-md"
          >
            <FileText size={16} />
            <span className="hidden lg:inline">Request a Quote</span>
            <span className="lg:hidden">Quote</span>
          </Link>
        </div>
      </div>

      {/* ANGLED BOTTOM SEARCH TAB */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-20 hidden md:block">
        <div
          className="bg-white px-8 py-1.5 shadow-md flex items-center justify-center border-b border-x border-gray-200"
          style={{
            clipPath: "polygon(0 0, 100% 0, 86% 100%, 14% 100%)",
            width: "440px",
          }}
        >
          <div className="relative w-full max-w-xs flex items-center">
            <Car size={16} className="text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by OEM No, Brand, Category"
              className="w-full bg-transparent border-b border-gray-300 text-xs py-0.5 pr-6 focus:outline-none focus:border-[#A81C24] transition-colors text-gray-800 placeholder-gray-400"
            />
            <Search size={14} className="absolute right-0 text-gray-400 cursor-pointer hover:text-[#A81C24] transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;