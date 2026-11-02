import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/auto_parts(2).jpg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Extra darkening around the center for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/45 to-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-lg">
          D&W Auto Parts
        </h1>

        <p className="text-lg md:text-xl text-white font-light drop-shadow-md">
          Quality Auto Parts for Your Vehicle
        </p>
      </div>
    </section>
  );
};

export default Hero;
