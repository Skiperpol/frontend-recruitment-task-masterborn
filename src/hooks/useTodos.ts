import { useQuery } from '@tanstack/react-query';
import { todoApi } from '../api/todoApi';
import { Todo } from '../types/todo';

/**
 * Custom hook for fetching all todo items
 * Uses TanStack Query for caching, background updates, and error handling
 * @function useTodos
 * @returns {UseQueryResult<Todo[], Error>} Query result containing todos data, loading state, and error information
 * @example
 * const { data: todos, isLoading, error } = useTodos();
 */
export const useTodos = () => {
  return useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: todoApi.getTodos,
  });
};

/**
 * Custom hook for fetching a single todo item by ID
 * Uses TanStack Query for caching and automatic refetching
 * @function useTodo
 * @param {string} id - The unique identifier of the todo item to fetch
 * @returns {UseQueryResult<Todo, Error>} Query result containing todo data, loading state, and error information
 * @example
 * const { data: todo, isLoading, error } = useTodo('123');
 */
export const useTodo = (id: string) => {
  return useQuery<Todo>({
    queryKey: ['todos', id],
    queryFn: () => todoApi.getTodo(id),
    enabled: !!id,
  });
};
