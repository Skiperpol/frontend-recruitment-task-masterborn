/**
 * Represents a single todo item in the application
 * @interface Todo
 */
export type Todo = {
  /** Unique identifier for the todo item */
  id: string;
  /** The text content of the todo item */
  title: string;
  /** Whether the todo item is completed or not */
  completed: boolean;
};

/**
 * Request payload for creating a new todo item
 * @interface CreateTodoRequest
 */
export type CreateTodoRequest = {
  /** The title text for the new todo item */
  title: string;
};

/**
 * Request payload for updating an existing todo item
 * @interface UpdateTodoRequest
 */
export type UpdateTodoRequest = {
  /** Optional new title for the todo item */
  title?: string;
  /** Optional new completion status for the todo item */
  completed?: boolean;
};
