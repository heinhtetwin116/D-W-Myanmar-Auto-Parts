import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full h-[400px] flex items-center justify-center bg-primary">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/auto_parts.png')",
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-primary-foreground px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          D&W Auto Parts
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 font-light">
          Quality Auto Parts for Your Vehicle
        </p>
      </div>
    </section>
  );
};

export default Hero;
