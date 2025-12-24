"use client";

export default function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0">
      <form onSubmit={handleSubmit}>
        <label className="relative flex items-center w-full h-14 rounded-xl shadow-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all">
          <div className="absolute left-0 pl-4 flex items-center pointer-events-none text-white/50">
            <span className="material-symbols-outlined">location_on</span>
          </div>
          <input
            id="city-search"
            name="city-search"
            className="w-full h-full pl-12 pr-36 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-colors rounded-xl"
            placeholder="Search city or zip code..."
            type="text"
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </form>
      <div className="mt-4 flex items-center justify-center lg:justify-start gap-4 text-sm text-white/40">
        <span>Popular:</span>
        <button
          onClick={() => setSearchTerm("Davao")}
          className="hover:text-primary transition-colors"
        >
          Davao
        </button>
        <button
          onClick={() => setSearchTerm("Cagayan")}
          className="hover:text-primary transition-colors"
        >
          Cagayan
        </button>
        <button
          onClick={() => setSearchTerm("General Santos")}
          className="hover:text-primary transition-colors"
        >
          General Santos
        </button>
      </div>
    </div>
  );
}
