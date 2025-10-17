import { clsx } from "clsx";
import { Todo } from "../types/todo";
import { useUpdateTodo, useDeleteTodo } from "../hooks/useTodoMutations";

/**
 * Component for displaying and managing a single todo item
 * Provides functionality to toggle completion status and delete the todo
 * @component TodoItem
 * @param {Todo} todo - The todo item data to display and manage
 * @returns {JSX.Element} Todo item component with checkbox and delete button
 * @example
 * <TodoItem todo={{ id: '1', title: 'Learn React', completed: false }} />
 */
export function TodoItem({ todo }: { todo: Todo }) {
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleToggleTodo = async () => {
    try {
      await updateTodoMutation.mutateAsync({
        id: todo.id,
        data: { completed: !todo.completed }
      });
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDeleteTodo = async () => {
    try {
      await deleteTodoMutation.mutateAsync(todo.id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
<div
      data-testid="todo-item"
      className="relative flex items-start py-4"
    >
      <div className="min-w-0 flex-1 text-sm leading-6">
        <label
          className={clsx(
            "select-none font-medium text-gray-900",
            todo.completed && "line-through"
          )}
          data-testid="todo-title"
        >
          {todo.title}
        </label>
      </div>
      <div className="ml-3 flex h-6 items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleTodo}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
        <button
          onClick={handleDeleteTodo}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
