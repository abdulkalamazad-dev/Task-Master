import { FaEdit, FaTrash, FaCheck, FaUndo } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTaskContext } from "../../context/TaskContext";

function TaskCard({ task }) {
  const { updateTask, deleteTask } = useTaskContext();

  const priorityClasses = {
    low: "badge-low",
    medium: "badge-medium",
    high: "badge-high"
  };

  const toggleStatus = () => {
    updateTask({
      ...task,
      status: task.status === "completed" ? "pending" : "completed"
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(task.id);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link
      to={`/task/${task.id}`}
      className={`card task-card ${task.status === "completed" ? "task-completed" : ""}`}
    >
      <div className="card-header">
        <span className={`badge ${priorityClasses[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-sm text-gray">
          Due: {formatDate(task.dueDate)}
        </span>
      </div>

      <h3 className="card-title truncate">{task.title}</h3>
      
      <p className="card-content line-clamp-2">{task.description}</p>

      <div className="card-footer" onClick={(e) => e.preventDefault()}>
        <button
          className={`btn btn-icon btn-sm ${task.status === "completed" ? "btn-warning" : "btn-success"}`}
          aria-label={task.status === "completed" ? "Mark as pending" : "Mark as completed"}
          onClick={toggleStatus}
        >
          {task.status === "completed" ? <FaUndo /> : <FaCheck />}
        </button>
        
        <Link
          to={`/edit/${task.id}`}
          className="btn btn-icon btn-sm btn-primary"
          aria-label="Edit task"
          onClick={(e) => e.stopPropagation()}
        >
          <FaEdit />
        </Link>
        
        <button
          className="btn btn-icon btn-sm btn-danger"
          aria-label="Delete task"
          onClick={handleDelete}
        >
          <FaTrash />
        </button>
      </div>
    </Link>
  );
}

export default TaskCard;
