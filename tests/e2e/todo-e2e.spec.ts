import { test, expect } from '@playwright/test';
import { TodoTestHelpers } from './test-helpers';

test.describe('Todo App Happy Path', () => {
  let helpers: TodoTestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TodoTestHelpers(page);
    await helpers.setupCleanState();
    await helpers.verifyApiUISync();
  });

  test('should add new todo items and clear input field', async () => {
    const todoText = 'Playwright testing';

    await helpers.addTodoViaUI(todoText);
    await helpers.verifyTodoExists(todoText);
  });

  test('should append new todos to the bottom of the list', async () => {
    const todos = ['First todo', 'Second todo', 'Third todo'];
    
    await helpers.addMultipleTodosViaUI(todos);
    const todoTitles = helpers.getTodoTitles();
    await expect(todoTitles.nth(0)).toContainText('First todo');
    await expect(todoTitles.nth(1)).toContainText('Second todo');
    await expect(todoTitles.nth(2)).toContainText('Third todo');
  });

  test('should mark todo as complete', async () => {
    await helpers.addTodoViaUI('Complete this task');
    await helpers.verifyTodoCompleted(0, false);
    await helpers.markTodoAsCompleteViaUI(0);
    await helpers.verifyTodoCompleted(0, true);
  });

  test('should unmark todo as complete', async () => {
    await helpers.addTodoViaUI('Uncomplete this task');
    await helpers.markTodoAsCompleteViaUI(0);
    await helpers.verifyTodoCompleted(0, true);
    await helpers.markTodoAsCompleteViaUI(0);
    await helpers.verifyTodoCompleted(0, false);
  });

  test('should display current number of todo items', async () => {
    await helpers.verifyTodoCount(0);
    await helpers.addTodoViaUI('First task');
    await helpers.verifyTodoCount(1);
    await helpers.addTodoViaUI('Second task');
    await helpers.verifyTodoCount(2);
    await helpers.markTodoAsCompleteViaUI(0);
    await helpers.verifyTodoCount(1);
  });

  test('should clear completed items when clicking Clear Completed button', async () => {
    const todos = ['Task 1', 'Task 2', 'Task 3'];

    await helpers.addMultipleTodosViaUI(todos);
    await helpers.markTodoAsCompleteViaUI(0);
    await helpers.markTodoAsCompleteViaUI(1);
    await helpers.verifyClearCompletedButtonVisibility(true);
    await helpers.clearCompletedTodos();
    await helpers.verifyOnlyActiveTodosRemain(['Task 3']);
  });

  test('should hide Clear Completed button when there are no completed items', async () => {
    await helpers.addTodoViaUI('Only task');
    
    await helpers.verifyClearCompletedButtonVisibility(false);
    await helpers.markTodoAsCompleteViaUI(0);
    await helpers.verifyClearCompletedButtonVisibility(true);
    await helpers.markTodoAsCompleteViaUI(0);
    await helpers.verifyClearCompletedButtonVisibility(false);
  });

  test('should handle complete happy path workflow', async () => {
    // 1. Add multiple todos
    const todos = ['Buy groceries', 'Walk the dog', 'Finish project', 'Call mom'];
    await helpers.addMultipleTodosViaUI(todos);
    
    // 2. Verify all todos are added and count is correct
    await helpers.verifyTodoCount(4);
    await expect(helpers.getTodoTitles()).toHaveCount(4);
    
    // 3. Mark some todos as complete
    await helpers.markTodoAsCompleteViaUI(0);
    await helpers.markTodoAsCompleteViaUI(2);
    
    // 4. Verify completed todos have line-through styling
    await helpers.verifyTodoCompleted(0, true);
    await helpers.verifyTodoCompleted(2, true);
    
    // 5. Verify count shows only active todos
    await helpers.verifyTodoCount(2);
    
    // 6. Verify Clear Completed button is visible
    await helpers.verifyClearCompletedButtonVisibility(true);
    
    // 7. Clear completed todos
    await helpers.clearCompletedTodos();
    
    // 8. Verify only active todos remain
    await helpers.verifyOnlyActiveTodosRemain(['Walk the dog', 'Call mom']);
    
    // 9. Verify count is updated
    await helpers.verifyTodoCount(2);
    
    // 10. Verify Clear Completed button is hidden
    await helpers.verifyClearCompletedButtonVisibility(false);
  });
});
