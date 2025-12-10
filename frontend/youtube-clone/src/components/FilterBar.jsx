// src/components/FilterBar.jsx

const FILTERS = [
    "All",
    "4K resolution",
    "JavaScript",
    "React",
    "Data Structures",
    "Complex numbers",
    "Music",
    "Gaming",
    "Object-oriented programming",
    "AI",
    "Indian pop music",
];

function FilterBar({ selectedFilter, onChange }) {
    return (
        <div className="filter-bar">
            {FILTERS.map((label) => (
                <button
                    key={label}
                    className={
                        "filter-chip" +
                        (selectedFilter === label ? " filter-chip-active" : "")
                    }
                    onClick={() => onChange(label)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export default FilterBar;
