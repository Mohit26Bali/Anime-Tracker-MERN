function SearchBar({ value, onChange, onFocus, onBlur }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Search anime..."
      className="w-full max-w-md rounded border border-stone-600 bg-stone-800 px-3 py-2 text-white"
    />
  );
}

export default SearchBar;
