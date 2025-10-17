import { useState } from "react";
import { useCreateTodo } from "../hooks/useTodoMutations";

/**
 * Form component for creating new todo items
 * Handles form submission, input validation, and todo creation
 * @component TodoForm
 * @returns {JSX.Element} Form component with input field and submit handling
 * @example
 * <TodoForm />
 */
export function TodoForm() {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const createTodoMutation = useCreateTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTodoTitle.trim();
    if (trimmedTitle) {
      try {
        await createTodoMutation.mutateAsync({ title: trimmedTitle });
        setNewTodoTitle("");
      } catch (error) {
        console.error("Failed to create todo:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="What needs to be done?"
        type="text"
        value={newTodoTitle}
        disabled={createTodoMutation.isPending}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        data-testid="todo-input"
      />
    </form>
  );
}
