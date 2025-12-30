import { useEffect, useState } from "react";
import { API } from "../api";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Plus, Moon, Sun, CheckCircle2, Circle, Trash2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    API.get("/todos").then((res) => setTodos(res.data));
  }, []);

  useEffect(() => {
    if (todos.length > 0 && todos.every((t) => t.completed)) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#a78bfa", "#c084fc", "#e879f9", "#60a5fa", "#34d399"],
      });
    }
  }, [todos]);

  const addTodo = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;
    const res = await API.post("/todos", { title });
    setTodos([res.data, ...todos]);
    setTitle("");
  };

  const toggleTodo = async (id, completed) => {
    const res = await API.put(`/todos/${id}`, { completed: !completed });
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await API.delete(`/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const allCompleted = todos.length > 0 && activeCount === 0;

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{
          backgroundImage: darkMode
            ? "url('https://images.pexels.com/photos/10903696/pexels-photo-10903696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
            : "url('https://images.pexels.com/photos/27788815/pexels-photo-27788815.jpeg?cs=srgb&dl=pexels-baran-robin-76507255-27788815.jpg&fm=jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 z-50 p-4 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/30 shadow-2xl"
        >
          {darkMode ? <Sun className="w-7 h-7 text-yellow-400" /> : <Moon className="w-7 h-7 text-indigo-300" />}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="bg-white/65 dark:bg-black/55 backdrop-blur-3xl rounded-3xl shadow-4xl border border-white/40 dark:border-white/20 p-10 md:p-12">
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                My Tasks
              </motion.h1>

              {allCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 flex items-center justify-center gap-3 text-2xl text-emerald-500 dark:text-emerald-400"
                >
                  <Sparkles className="w-10 h-10" />
                  All Done! You're amazing!
                  <Sparkles className="w-10 h-10" />
                </motion.div>
              )}
            </div>

            {/* ONLY CHANGE: Added text-white to input */}
            <form onSubmit={addTodo} className="flex gap-4 mb-12">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's next?"
                className="flex-1 px-6 py-5 rounded-2xl bg-white/50 dark:bg-black/40 border border-white/40 backdrop-blur text-lg placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-400/50 text-white" /* ← text-white added */
              />
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl text-white"
              >
                <Plus className="w-8 h-8" />
              </motion.button>
            </form>

            <AnimatePresence>
              {todos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="text-9xl mb-8"
                  >
                    ✨
                  </motion.div>
                  <p className="text-2xl text-gray-700 dark:text-gray-300">
                    Your day is wide open. Let's make it productive!
                  </p>
                </motion.div>
              ) : (
                <motion.ul className="space-y-5">
                  {todos.map((todo, index) => (
                    <motion.li
                      key={todo._id}
                      layout
                      initial={{ opacity: 0, x: -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100, scale: 0.8 }}
                      transition={{ delay: index * 0.07 }}
                      className="group flex items-center gap-6 bg-white/40 dark:bg-black/30 rounded-2xl p-6 backdrop-blur border border-white/30 hover:border-purple-400/60 transition-all duration-300"
                    >
                      <button onClick={() => toggleTodo(todo._id, todo.completed)}>
                        {todo.completed ? (
                          <CheckCircle2 className="w-9 h-9 text-emerald-500 fill-emerald-200 dark:fill-emerald-800" />
                        ) : (
                          <Circle className="w-9 h-9 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>

                      <span
                        className={`flex-1 text-xl font-medium ${
                          todo.completed
                            ? "line-through text-gray-500 dark:text-gray-600"
                            : "text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {todo.title}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.3, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTodo(todo._id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 dark:text-red-400"
                      >
                        <Trash2 className="w-7 h-7" />
                      </motion.button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            {todos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 pt-8 border-t border-white/30 text-center"
              >
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {activeCount} {activeCount === 1 ? "task" : "tasks"} remaining
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default TodoApp;
