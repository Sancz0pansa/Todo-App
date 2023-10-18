/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-param-reassign */

import React from 'react';
import cn from 'classnames';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { NewTodoInput } from './components/NewTodoInput';
import { useTodo } from './context/AppContext';

export const App: React.FC = () => {
  const {
    todos, temporaryTodo, error,
    handleCompleteALL, setError,
  } = useTodo();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all',
                { active: todos.every(todo => todo.completed) })}
              data-cy="ToggleAllButton"
              onClick={() => {
                if (todos.every(todo => todo.completed === true)) {
                  handleCompleteALL(todos, false);
                } else {
                  handleCompleteALL(todos, true);
                }
              }}
            />
          )}

          <NewTodoInput />
        </header>

        {(todos.length > 0 || temporaryTodo) && (
          <TodoList />
        )}

        {(todos.length > 0 || temporaryTodo)
          && (
            <Footer />
          )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          { hidden: error === null })}
      >
        {error
        && (
          <div
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => setError(null)}
            />
          </div>

        )}
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
