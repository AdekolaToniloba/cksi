export function TrustedBy() {
  const logos = Array.from({ length: 6 });

  return (
    <section className="bg-white py-12 border-y border-gray-100">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          <div className="shrink-0">
            <span className="font-sans font-bold text-[10px] text-gray-400 tracking-[0.2em] uppercase">
              TRUSTED BY
            </span>
          </div>

          <div className="w-full grid grid-cols-3 md:grid-cols-6 gap-4">
            {logos.map((_, index) => (
              <div 
                key={index} 
                className="bg-[#EAEFF8] h-12 md:h-14 rounded flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
              >
                <span className="font-sans font-bold text-xs text-gray-400">LOGO</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
