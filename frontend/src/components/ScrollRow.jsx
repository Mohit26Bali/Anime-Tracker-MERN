import { useRef, useState } from "react";

function ScrollRow({ title, children }) {
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="px-4 sm:px-6">
      <h2 className="mb-2 text-lg font-semibold text-stone-100">{title}</h2>
      <div
        className="group relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-stone-950 to-transparent transition-opacity duration-200 ${
            atStart ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-stone-950 to-transparent transition-opacity duration-200 ${
            atEnd ? "opacity-0" : "opacity-100"
          }`}
        />

        {isHovering && !atStart && (
          <button
            onClick={() => scrollByAmount(-1)}
            className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/80 p-2 text-white hover:bg-black"
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}
        {isHovering && !atEnd && (
          <button
            onClick={() => scrollByAmount(1)}
            className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/80 p-2 text-white hover:bg-black"
            aria-label="Scroll right"
          >
            ›
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateEdges}
          className="no-scrollbar flex snap-x snap-proximity gap-3 overflow-x-auto scroll-smooth pb-2"
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export default ScrollRow;
