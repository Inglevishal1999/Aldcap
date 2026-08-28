function Hero() {
  return (
    <section
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1512632578888-169bbbc64f33')",
      }}
    >
      <div className="text-center bg-black/50 p-8 rounded-lg">
        <h1 className="text-5xl text-white font-bold">
          Welcome to Temple
        </h1>

        <p className="text-white mt-4">
          Experience peace and spirituality.
        </p>

        <button className="mt-6 bg-orange-600 px-6 py-3 rounded text-white">
          Visit Now
        </button>
      </div>
    </section>
  );
}

export default Hero;