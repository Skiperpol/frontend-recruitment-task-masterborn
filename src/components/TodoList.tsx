import { useTodos } from "../hooks/useTodos";
import { TodoItem } from "./TodoItem";

/**
 * Component for displaying the list of all todo items
 * Handles loading states, error states, and renders individual TodoItem components
 * @component TodoList
 * @returns {JSX.Element} List component with todos or loading/error states
 * @example
 * <TodoList />
 */
export function TodoList() {
  const { data: todos = [], isLoading, error } = useTodos();

  if (isLoading) {
    return (
      <div className="text-center py-4">Loading todos...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        Error loading todos: {error.message}
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="text-base font-semibold leading-6 text-gray-900">
        Todo list
      </legend>
      <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
        {todos.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No todos yet</div>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </fieldset>
  );
}
