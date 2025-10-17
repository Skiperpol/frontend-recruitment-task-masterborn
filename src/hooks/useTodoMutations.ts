import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../api/todoApi';
import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

/**
 * Custom hook for creating a new todo item
 * Uses TanStack Query mutation with automatic cache invalidation
 * @function useCreateTodo
 * @returns {UseMutationResult<Todo, Error, CreateTodoRequest>} Mutation result with create function and state
 * @example
 * const createTodoMutation = useCreateTodo();
 * createTodoMutation.mutate({ title: 'New todo' });
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) => todoApi.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

/**
 * Custom hook for updating an existing todo item
 * Uses TanStack Query mutation with optimistic updates and cache management
 * @function useUpdateTodo
 * @returns {UseMutationResult<Todo, Error, {id: string, data: UpdateTodoRequest}>} Mutation result with update function and state
 * @example
 * const updateTodoMutation = useUpdateTodo();
 * updateTodoMutation.mutate({ id: '123', data: { completed: true } });
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) =>
      todoApi.updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(['todos', updatedTodo.id], updatedTodo);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

/**
 * Custom hook for deleting a single todo item
 * Uses TanStack Query mutation with cache cleanup
 * @function useDeleteTodo
 * @returns {UseMutationResult<void, Error, string>} Mutation result with delete function and state
 * @example
 * const deleteTodoMutation = useDeleteTodo();
 * deleteTodoMutation.mutate('123');
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ['todos', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

/**
 * Custom hook for deleting all todo items
 * Uses TanStack Query mutation with complete cache clearing
 * @function useDeleteAllTodos
 * @returns {UseMutationResult<void, Error, void>} Mutation result with delete all function and state
 * @example
 * const deleteAllTodosMutation = useDeleteAllTodos();
 * deleteAllTodosMutation.mutate();
 */
export const useDeleteAllTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => todoApi.deleteAllTodos(),
    onSuccess: () => {
      queryClient.setQueryData(['todos'], []);
      queryClient.removeQueries({ queryKey: ['todos'] });
    },
  });
};
