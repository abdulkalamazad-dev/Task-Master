import { FaEdit, FaTrash, FaCheck, FaUndo, FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask } = useTaskContext();
  
  const task = tasks.find(task => task.id === id);
  
  const priorityClasses = {
    low: "badge-low",
    medium: "badge-medium",
    high: "badge-high"
  };
  
  if (!task) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold mb-4">Task Not Found</h2>
        <p className="mb-6">The task you're looking for doesn't exist or has been deleted.</p>
        <Link to="/" className="btn btn-primary">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const toggleStatus = () => {
    updateTask({
      ...task,
      status: task.status === "completed" ? "pending" : "completed"
    });
    
    alert(`Task marked as ${task.status === "completed" ? "pending" : "completed"}`);
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      alert("Task deleted");
      navigate("/");
    }
  };

  return (
    <div>
      <Link to="/" className="btn btn-outline mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </Link>
      
      <div className="card">
        <div className="d-flex justify-between mb-4">
          <span className={`badge ${priorityClasses[task.priority]}`}>
            {task.priority.toUpperCase()} PRIORITY
          </span>
          
          <span className={`badge ${task.status === "completed" ? "badge-completed" : "badge-pending"}`}>
            {task.status.toUpperCase()}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
        
        <p className="mb-6">{task.description}</p>
        
        <div className="border-t border-b py-4 my-4">
          <div className="mb-2">
            <strong>Due Date:</strong>
            <p>{formatDate(task.dueDate)}</p>
          </div>
          
          <div>
            <strong>Created:</strong>
            <p>{formatDate(task.createdAt)}</p>
          </div>
        </div>
        
        <div className="d-flex justify-end gap-2">
          <button
            className={`btn ${task.status === "completed" ? "btn-warning" : "btn-success"}`}
            onClick={toggleStatus}
          >
            {task.status === "completed" ? (
              <>
                <FaUndo className="mr-2" />
                Mark as Pending
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Mark as Completed
              </>
            )}
          </button>
          
          <Link
            to={`/edit/${task.id}`}
            className="btn btn-primary"
          >
            <FaEdit className="mr-2" />
            Edit
          </Link>
          
          <button
            className="btn btn-danger"
            onClick={handleDelete}
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
