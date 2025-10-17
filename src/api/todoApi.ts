import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * API client for todo operations
 * Provides methods for CRUD operations on todo items
 * @namespace todoApi
 */
export const todoApi = {
  /**
   * Fetches all todo items from the server
   * @async
   * @function getTodos
   * @returns {Promise<Todo[]>} Array of all todo items
   * @throws {Error} When the request fails
   * @example
   * const todos = await todoApi.getTodos();
   */
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  /**
   * Fetches a single todo item by its ID
   * @async
   * @function getTodo
   * @param {string} id - The unique identifier of the todo item
   * @returns {Promise<Todo>} The todo item with the specified ID
   * @throws {Error} When the todo is not found or request fails
   * @example
   * const todo = await todoApi.getTodo('123');
   */
  async getTodo(id: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Todo not found');
      }
      throw new Error('Failed to fetch todo');
    }
    return response.json();
  },

  /**
   * Creates a new todo item
   * @async
   * @function createTodo
   * @param {CreateTodoRequest} data - The data for the new todo item
   * @returns {Promise<Todo>} The newly created todo item
   * @throws {Error} When the creation fails
   * @example
   * const newTodo = await todoApi.createTodo({ title: 'Learn React' });
   */
  async createTodo(data: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  /**
   * Updates an existing todo item
   * @async
   * @function updateTodo
   * @param {string} id - The unique identifier of the todo item to update
   * @param {UpdateTodoRequest} data - The updated data for the todo item
   * @returns {Promise<Todo>} The updated todo item
   * @throws {Error} When the todo is not found or update fails
   * @example
   * const updatedTodo = await todoApi.updateTodo('123', { completed: true });
   */
  async updateTodo(id: string, data: UpdateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Todo not found');
      }
      throw new Error('Failed to update todo');
    }
    return response.json();
  },

  /**
   * Deletes a single todo item by its ID
   * @async
   * @function deleteTodo
   * @param {string} id - The unique identifier of the todo item to delete
   * @returns {Promise<void>} Resolves when the deletion is successful
   * @throws {Error} When the todo is not found or deletion fails
   * @example
   * await todoApi.deleteTodo('123');
   */
  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Todo not found');
      }
      throw new Error('Failed to delete todo');
    }
  },

  /**
   * Deletes all todo items
   * @async
   * @function deleteAllTodos
   * @returns {Promise<void>} Resolves when all todos are deleted
   * @throws {Error} When the deletion fails
   * @example
   * await todoApi.deleteAllTodos();
   */
  async deleteAllTodos(): Promise<void> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete all todos');
    }
  },
};
