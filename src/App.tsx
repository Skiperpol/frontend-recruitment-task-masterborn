import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { TodoFooter } from "./components/TodoFooter";

export function App() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <TodoForm />
      <TodoList />
      <TodoFooter />
    </div>
  );
}
