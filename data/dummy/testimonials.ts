import type { Testimonial } from "@/types/index.type";

export const testimonials: Testimonial[] = [
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
