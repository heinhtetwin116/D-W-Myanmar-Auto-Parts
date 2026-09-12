"use client";

import React from "react";
import { Star, Quote, BadgeCheck } from "lucide-react";

// Dummy Testimonial Data
const testimonials = [
  {
    id: 1,
    name: "Michael Rodriguez",
    role: "Shop Owner, Detroit",
    content:
      "The inventory management system from D&W has completely streamlined our workflow. We used to spend hours tracking down parts, now it takes seconds. Their catalog is incredibly accurate.",
    rating: 5,
    initials: "MR",
    color: "bg-accent/10 text-accent",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Auto Mechanic",
    content:
      "I've been sourcing parts from D&W for over 5 years. The quality is always OEM-grade, and the delivery is consistently within 1-2 days. They are my go-to for critical engine components.",
    rating: 5,
    initials: "SJ",
    color: "bg-success/10 text-success",
  },
  {
    id: 3,
    name: "David Chen",
    role: "Car Enthusiast",
    content:
      "Finding the exact part for my classic restoration project was a nightmare until I found this catalog. The search filters by OEM number are a lifesaver. Highly recommended for hard-to-find parts.",
    rating: 4,
    initials: "DC",
    color: "bg-warning/10 text-warning",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-background py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
            Trusted by Professionals &amp; Enthusiasts
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Don&apos;t just take our word for it. See what our customers have to
            say about their experience with D&amp;W Auto Parts.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-card rounded-2xl p-8 shadow-default border border-border hover:shadow-hover hover:border-accent/30 transition-all duration-300 relative group flex flex-col h-full"
            >
              {/* Background Quote Icon */}
              <Quote
                size={80}
                className="absolute top-6 right-6 text-background group-hover:text-accent/5 transition-colors duration-300 -z-0 pointer-events-none"
              />

              {/* Rating Stars */}
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < t.rating
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    }
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow relative z-10">
                &quot;{t.content}&quot;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border relative z-10">
                {/* Avatar Fallback */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${t.color}`}
                >
                  {t.initials}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1">
                    {t.name}
                    <BadgeCheck size={14} className="text-accent" />
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Indicator */}
        <div className="mt-16 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Join <span className="font-bold text-foreground">2,000+</span> happy
            customers who trust D&amp;W Auto Parts.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
