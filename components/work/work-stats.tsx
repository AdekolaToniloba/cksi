export function WorkStats() {
  const stats = [
    {
      value: "15,000+",
      label: "LIVES IMPACTED",
    },
    {
      value: "3,000+",
      label: "GENOTYPE TESTS",
    },
    {
      value: "500+",
      label: "COUNSELING SESSIONS",
    },
    {
      value: "10+",
      label: "COMMUNITIES REACHED",
    },
  ];

  return (
    <section className="bg-[#F0F3FF] py-20 border-y border-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200/60 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-3 pt-6 md:pt-0 first:pt-0">
              <span className="text-4xl md:text-5xl font-serif text-cksi-brand-red">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs font-sans font-bold text-[#151C27] tracking-[0.15em] uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
