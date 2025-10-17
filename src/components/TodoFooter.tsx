import { useTodos } from "../hooks/useTodos";
import { useDeleteAllTodos } from "../hooks/useTodoMutations";

/**
 * Footer component for the todo application
 * Displays the count of active todos and provides a button to clear completed todos
 * @component TodoFooter
 * @returns {JSX.Element} Footer component with todo count and clear button
 * @example
 * <TodoFooter />
 */
export function TodoFooter() {
  const { data: todos = [] } = useTodos();
  const deleteAllTodosMutation = useDeleteAllTodos();

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    if (completedTodos.length === 0) return;
    
    try {
      await deleteAllTodosMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
    }
  };

  return (
    <div className="flex h-8 items-center justify-between">
      <span
        data-testid="todo-count"
        className="text-sm font-medium leading-6 text-gray-900"
      >
        {activeTodosCount} items left
      </span>
      {hasCompletedTodos && (
        <button 
          onClick={handleClearCompleted}
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}
