import React from "react";
import { PhoneCall, ShieldCheck, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* TOP SECTION: Brand Info + Link Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Info (Takes up 1 column on large screens) */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-accent">
              D&W AUTO PARTS
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Your trusted partner for automotive inventory management and
              high-quality replacement parts.
            </p>
          </div>

          {/* Link Lists (Takes up 2 columns on large screens, split into 3 sub-columns) */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-primary-foreground">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Track Order
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Returns & Warranty
                  </a>
                </li>
              </ul>
            </div>

            {/* Catalog */}
            <div>
              <h4 className="font-bold mb-4 text-primary-foreground">
                Catalog
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Clearance Sale
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Full Parts Index
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold mb-4 text-primary-foreground">
                Categories
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Engine Parts
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Brake Systems
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Suspension
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Oils & Fluids
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Contact Info (Moved to its own row for better spacing) */}
        <div className="border-t border-primary-foreground/10 pt-8 pb-10">
          <h4 className="font-bold mb-4 text-primary-foreground">
            Contact Info
          </h4>
          <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-12 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
              <span>
                123 Warehouse Ave,
                <br />
                Detroit, MI 48201
              </span>
            </div>

            <div className="flex items-start gap-3">
              <PhoneCall
                size={18}
                className="text-accent flex-shrink-0 mt-0.5"
              />
              <span>
                +95 9 765006774
                <br />
                +95 9 455096809
              </span>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="text-accent flex-shrink-0 mt-0.5"
              />
              <span>support@dwautoparts.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} D&W Auto Parts Inventory Management.
        All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
