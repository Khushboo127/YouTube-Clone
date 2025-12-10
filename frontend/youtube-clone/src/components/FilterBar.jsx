// src/components/FilterBar.jsx

const FILTERS = [
    { key: "ALL", label: "All" },
    { key: "4K", label: "4K resolution" },
    { key: "JAVASCRIPT", label: "JavaScript" },
    { key: "REACT", label: "React" },
    { key: "DATA_STRUCTURES", label: "Data Structures" },
    { key: "COMPLEX_NUMBERS", label: "Complex numbers" },
    { key: "MUSIC", label: "Music" },
    { key: "GAMING", label: "Gaming" },
    // extra fun filters like in screenshot:
    { key: "OOP", label: "Object-oriented programming" },
    { key: "AI", label: "AI" },
    { key: "INDIAN_POP", label: "Indian pop music" },
];

function FilterBar({ selectedFilter, onChange }) {
    return (
        <div className="filter-bar">
            {FILTERS.map((f) => (
                <button
                    key={f.key}
                    className={
                        "filter-chip" +
                        (selectedFilter === f.key ? " filter-chip-active" : "")
                    }
                    onClick={() => onChange(f.key)}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
}

export default FilterBar;
