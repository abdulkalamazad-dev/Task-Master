import { FaSearch } from "react-icons/fa";
import { useTaskContext } from "../../context/TaskContext";

function TaskFilter() {
  const { filter, searchQuery, setFilter, setSearchQuery } = useTaskContext();

  return (
    <div className="search-filter-container animate-slide-up">
      <div className="search-container">
        <span className="search-icon">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search tasks by title, description or priority..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <select 
        className="form-control form-select filter-select"
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}

export default TaskFilter;
