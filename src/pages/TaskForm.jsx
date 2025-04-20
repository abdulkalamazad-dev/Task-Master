import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTaskContext();
  
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
    status: "pending"
  });
  
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      const taskToEdit = tasks.find(task => task.id === id);
      if (taskToEdit) {
        setFormData(taskToEdit);
      } else {
        alert("Task not found");
        navigate("/");
      }
    }
  }, [id, tasks, navigate, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditMode) {
      updateTask(formData);
      alert("Task updated successfully!");
    } else {
      addTask(formData);
      alert("Task created successfully!");
    }
    
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Task" : "Create New Task"}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input 
            type="text"
            id="title"
            name="title"
            className={`form-control ${errors.title && formSubmitted ? "is-invalid" : ""}`}
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
          {errors.title && formSubmitted && (
            <div className="form-error">{errors.title}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea 
            id="description"
            name="description"
            className={`form-control form-textarea ${errors.description && formSubmitted ? "is-invalid" : ""}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows={4}
          ></textarea>
          {errors.description && formSubmitted && (
            <div className="form-error">{errors.description}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="priority" className="form-label">Priority</label>
          <select 
            id="priority"
            name="priority"
            className="form-control form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input 
            type="date"
            id="dueDate"
            name="dueDate"
            className={`form-control ${errors.dueDate && formSubmitted ? "is-invalid" : ""}`}
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.dueDate && formSubmitted && (
            <div className="form-error">{errors.dueDate}</div>
          )}
        </div>
        
        {isEditMode && (
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select 
              id="status"
              name="status"
              className="form-control form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            {isEditMode ? "Update Task" : "Create Task"}
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
