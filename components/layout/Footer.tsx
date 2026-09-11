import React from "react";
import { PhoneCall, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#A81C24]">
            D&W AUTO PARTS
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Your trusted partner for automotive inventory management and
            high-quality replacement parts.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Track Order
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Returns & Warranty
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Engine Parts
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Brake Systems
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Suspension
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Oils & Fluids
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              123 Warehouse Ave,
              <br />
              Detroit, MI 48201
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall size={16} className="text-[#A81C24]" /> +95 9765006774
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#A81C24]" />{" "}
              support@dwautoparts.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} D&W Auto Parts Inventory Management.
        All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
