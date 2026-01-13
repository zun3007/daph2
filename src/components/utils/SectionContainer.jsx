const SectionContainer = ({ children, className = '', gradient = false }) => {
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center px-6 py-20 ${
        gradient ? 'bg-linear-to-b from-white to-emerald-50' : 'bg-white'
      } ${className}`}
    >
      {children}
    </section>
  );
};

export default SectionContainer;
