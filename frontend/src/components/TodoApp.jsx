import { useEffect, useState } from "react";
import { API } from "../api";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Detect system dark mode
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    API.get("/todos").then(res => setTodos(res.data));
  }, []);

  const addTodo = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;
    const res = await API.post("/todos", { title });
    setTodos([res.data, ...todos]);
    setTitle("");
  };

  const toggleTodo = async (id, completed) => {
    const res = await API.put(`/todos/${id}`, { completed: !completed });
    setTodos(todos.map(t => (t._id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await API.delete(`/todos/${id}`);
    setTodos(todos.filter(t => t._id !== id));
  };

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"}`}>
      <h1 className="text-red-500 text-4xl font-bold">
          Todo App
       </h1>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg hover:scale-110 transition"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      {/* Card */}
      <div className="w-full max-w-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 transition-all duration-300">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">
          📝 My Tasks
        </h1>

        {/* Input Form */}
        <form onSubmit={addTodo} className="flex gap-3 mb-8">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition text-gray-800 dark:text-gray-100 placeholder-gray-500"
            onKeyDown={e => e.key === "Enter" && addTodo(e)}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all"
          >
            Add
          </button>
        </form>

        {/* Todo List */}
        <div className="space-y-3 mb-6">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🚀</p>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No tasks yet! Add one above to get started.
              </p>
            </div>
          ) : (
            todos.map(todo => (
              <div
                key={todo._id}
                className="group flex items-center gap-4 bg-white/70 dark:bg-gray-700/70 rounded-2xl px-5 py-4 shadow hover:shadow-xl transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <span
                  className={`flex-1 text-lg transition-all ${
                    todo.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition text-2xl"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activeCount} {activeCount === 1 ? "task" : "tasks"} active
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Click checkbox to complete • Hover for delete
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoApp;