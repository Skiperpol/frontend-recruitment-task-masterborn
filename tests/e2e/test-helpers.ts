import { Page, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { Todo } from '../../src/types/todo';

dotenv.config();

/**
 * Helper functions for Todo app E2E tests
 * Provides utilities for data management and common test operations
 */

export class TodoTestHelpers {
  private page: Page;
  private apiBaseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.apiBaseUrl = process.env.VITE_API_URL || 'http://localhost:3000';
  }

  /**
   * Clears all todos from the API
   * This ensures test isolation by removing any existing data
   */
  async clearAllTodos(): Promise<void> {
    try {
      await this.page.request.delete(`${this.apiBaseUrl}/todos`);
      console.log('Successfully cleared all todos from API');
    } catch (error) {
      console.error('Failed to clear todos:', error);
      throw error;
    }
  }

  /**
   * Creates a todo via API (useful for test setup)
   */
  async createTodoViaApi(
    title: string,
    completed: boolean = false
  ): Promise<Todo> {
    try {
      const response = await this.page.request.post(`${this.apiBaseUrl}/todos`, {
        data: { title, completed }
      });
      console.log(`Successfully created todo via API: ${title}`);
      return response.json();
    } catch (error) {
      console.error('Failed to create todo via API:', error);
      throw error;
    }
  }

  /**
   * Gets all todos from API
   */
  async getAllTodosFromApi(): Promise<Todo[]> {
    try {
      const response = await this.page.request.get(`${this.apiBaseUrl}/todos`);
      return response.json();
    } catch (error) {
      console.error('Failed to get todos from API:', error);
      throw error;
    }
  }

  /**
   * Waits for the app to be ready
   */
  async waitForAppReady(): Promise<void> {
    await this.page.waitForSelector('[data-testid="todo-count"]');
    await this.page.waitForLoadState('networkidle');
  }


  /**
   * Marks a todo as complete via UI
   */
  async markTodoAsComplete(index: number = 0): Promise<void> {
    const checkbox = this.page.locator('[data-testid="todo-item"]').nth(index).locator('input[type="checkbox"]');
    await checkbox.click();
    
    // Wait for the change to be reflected
    await this.page.waitForTimeout(100);
  }

  /**
   * Gets the current todo count from UI
   */
  async getTodoCountFromUI(): Promise<number> {
    const countText = await this.page.locator('[data-testid="todo-count"]').textContent();
    const match = countText?.match(/(\d+) items left/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Verifies that the API and UI are in sync
   */
  async verifyApiUISync(): Promise<void> {
    const apiTodos = await this.getAllTodosFromApi();
    const uiTodos = await this.page.locator('[data-testid="todo-title"]').count();
    
    if (apiTodos.length !== uiTodos) {
      throw new Error(`API-UI sync error: API has ${apiTodos.length} todos, UI shows ${uiTodos}`);
    }
    
    console.log(`API-UI sync verified: ${apiTodos.length} todos`);
  }

  /**
   * Sets up a clean state for tests
   */
  async setupCleanState(): Promise<void> {
    await this.clearAllTodos();
    await this.page.goto('/');
    await this.waitForAppReady();
  }

  // UI Helper Methods
  /**
   * Gets the todo input field
   */
  getTodoInput() {
    return this.page.locator('[data-testid="todo-input"]');
  }

  /**
   * Gets the todo count display
   */
  getTodoCount() {
    return this.page.locator('[data-testid="todo-count"]');
  }

  /**
   * Gets all todo titles
   */
  getTodoTitles() {
    return this.page.locator('[data-testid="todo-title"]');
  }

  /**
   * Gets all todo items
   */
  getTodoItems() {
    return this.page.locator('[data-testid="todo-item"]');
  }

  /**
   * Gets the clear completed button
   */
  getClearCompletedButton() {
    return this.page.locator('button:has-text("Clear completed")');
  }

  /**
   * Adds a single todo via UI
   */
  async addTodoViaUI(title: string): Promise<void> {
    const todoInput = this.getTodoInput();
    await todoInput.fill(title);
    await todoInput.press('Enter');
    await expect(todoInput).toHaveValue(''); // Verify input is cleared
  }

  /**
   * Adds multiple todos via UI
   */
  async addMultipleTodosViaUI(titles: string[]): Promise<void> {
    for (const title of titles) {
      await this.addTodoViaUI(title);
    }
  }

  /**
   * Marks a todo as complete via UI
   */
  async markTodoAsCompleteViaUI(index: number = 0): Promise<void> {
    const checkbox = this.getTodoItems().nth(index).locator('input[type="checkbox"]');
    await checkbox.click();
  }

  /**
   * Verifies todo count
   */
  async verifyTodoCount(expectedCount: number): Promise<void> {
    const todoCount = this.getTodoCount();
    await expect(todoCount).toContainText(`${expectedCount} items left`);
  }

  /**
   * Verifies if todo exists
   */
  async verifyTodoExists(title: string, shouldExist: boolean = true): Promise<void> {
    const todoTitles = this.getTodoTitles();
    if (shouldExist) {
      await expect(todoTitles).toContainText(title);
    } else {
      await expect(todoTitles).not.toContainText(title);
    }
  }

  /**
   * Verifies todo completion status
   */
  async verifyTodoCompleted(index: number, isCompleted: boolean): Promise<void> {
    const todoTitle = this.getTodoTitles().nth(index);
    const checkbox = this.getTodoItems().nth(index).locator('input[type="checkbox"]');
    
    if (isCompleted) {
      await expect(checkbox).toBeChecked();
      await expect(todoTitle).toHaveClass(/line-through/);
    } else {
      await expect(checkbox).not.toBeChecked();
      await expect(todoTitle).not.toHaveClass(/line-through/);
    }
  }

  /**
   * Verifies clear completed button visibility
   */
  async verifyClearCompletedButtonVisibility(shouldBeVisible: boolean): Promise<void> {
    const clearButton = this.getClearCompletedButton();
    if (shouldBeVisible) {
      await expect(clearButton).toBeVisible();
    } else {
      await expect(clearButton).not.toBeVisible();
    }
  }

  /**
   * Clicks the clear completed button
   */
  async clearCompletedTodos(): Promise<void> {
    const clearCompletedButton = this.getClearCompletedButton();
    await clearCompletedButton.click();
  }

  /**
   * Verifies only active todos remain
   */
  async verifyOnlyActiveTodosRemain(expectedActiveTitles: string[]): Promise<void> {
    const remainingTodos = this.getTodoTitles();
    await expect(remainingTodos).toHaveCount(expectedActiveTitles.length);
    
    for (let i = 0; i < expectedActiveTitles.length; i++) {
      await expect(remainingTodos.nth(i)).toContainText(expectedActiveTitles[i]);
    }
  }
}
