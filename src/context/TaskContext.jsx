import { createContext, useContext, useReducer, useEffect } from "react";

const TaskContext = createContext();

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: "all", 
  searchQuery: "",
};

function taskReducer(state, action) {
  switch (action.type) {
    case "FETCH_TASKS_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_TASKS_SUCCESS":
      return { ...state, isLoading: false, tasks: action.payload };
    case "FETCH_TASKS_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      dispatch({ 
        type: "FETCH_TASKS_SUCCESS", 
        payload: JSON.parse(savedTasks) 
      });
    } else {
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const fetchTasks = async () => {
    dispatch({ type: "FETCH_TASKS_START" });
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
      const data = await response.json();
      
      const formattedTasks = data.map(item => ({
        id: item.id.toString(),
        title: item.title,
        description: "Task imported from JSONPlaceholder",
        status: item.completed ? "completed" : "pending",
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      }));
      
      dispatch({ type: "FETCH_TASKS_SUCCESS", payload: formattedTasks });
    } catch (error) {
      dispatch({ type: "FETCH_TASKS_ERROR", payload: error.message });
    }
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  const updateTask = (task) => {
    dispatch({ type: "UPDATE_TASK", payload: task });
  };

  const deleteTask = (id) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: "SET_SEARCH", payload: query });
  };

  const getFilteredTasks = () => {
    let filtered = [...state.tasks];
    
    if (state.filter !== "all") {
      filtered = filtered.filter(task => task.status === state.filter);
    }
    
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        filteredTasks: getFilteredTasks(),
        addTask,
        updateTask,
        deleteTask,
        setFilter,
        setSearchQuery,
        refreshTasks: fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}
