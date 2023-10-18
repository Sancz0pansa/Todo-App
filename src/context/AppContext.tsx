import React, {
  FormEventHandler,
  ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { TodoContextType } from './types';
import { Todo } from '../types/Todo';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from '../api/todos';
import { ErrorMess } from '../types/Error';
import { UserWarning } from '../UserWarning';
import { Filter } from '../types/Filter';

export const AppContext = createContext<TodoContextType | undefined>(undefined);

const USER_ID = 10521;

export const AppContextProvider: React.FC<{ children: ReactNode }>
= ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [error, setError] = useState<ErrorMess>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [title, setTitle] = useState<string>('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleError = (mess: ErrorMess) => {
    setError(mess);
    setTimeout(() => setError(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const todoss = getTodos(USER_ID);
      const count = (await todoss).filter(todo => todo.completed === false)
        .length;

      setTodos(await todoss);
      setCounter(count);
    } catch (e) {
      handleError('Unable to load todos');
    }
  }, []);

  const handleCount = () => {
    const count = todos.filter(toDo => toDo.completed === false)
      .length;

    setCounter(count);
  };

  const handleComplete = (todo: Todo, callback: () => void) => {
    updateTodo(todo.id, {
      completed: !todo.completed,
    }).then(() => {
      // eslint-disable-next-line no-param-reassign
      todo.completed = !todo.completed;
      handleCount();
    }).catch(() => {
      handleError('Unable to update a todo');
    }).finally(() => callback());
  };

  const handleCompleteALL = (toDos: Todo[], data: boolean) => {
    toDos.forEach(todo => {
      if (data === true && todo.completed === false) {
        updateTodo(todo.id, {
          completed: data,
        }).catch(() => {
          handleError('Unable to update a todo');
        }).finally(() => {
          fetchData();
          handleCount();
        });
      } else if (data === false) {
        updateTodo(todo.id, {
          completed: data,
        }).catch(() => {
          handleError('Unable to update a todo');
        }).finally(() => {
          fetchData();
          handleCount();
        });
      }
    });
  };

  const handleDelete = (todo: Todo, callback?: () => void) => {
    deleteTodo(todo.id).then(() => {
      setTodos(prevTodo => prevTodo.filter(toDo => toDo !== todo));
      inputRef.current?.focus();
      fetchData();
    }).catch(() => {
      handleError('Unable to delete todo');
      if (callback) {
        callback();
      }
    });
  };

  const handleAdd = () => {
    setIsSubmiting(true);
    addTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    }).then((response) => {
      setTitle('');
      setCounter(oldCount => oldCount + 1);
      setTodos((prevTodos) => [...prevTodos, response] as Todo[]);
    }).catch(() => {
      handleError('Unable to add a todo');
    }).finally(() => {
      setTemporaryTodo(null);
      setIsSubmiting(false);
    });
  };

  const handleSubmit: FormEventHandler
  = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (title.trim() === '') {
      handleError('Title should not be empty');

      return;
    }

    handleAdd();

    setTemporaryTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!isSubmiting) {
      inputRef.current?.focus();
    }
  }, [isSubmiting]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <AppContext.Provider value={{
      todos,
      counter,
      error,
      temporaryTodo,
      title,
      isSubmiting,
      filter,
      handleComplete,
      handleCompleteALL,
      handleDelete,
      handleSubmit,
      handleError,
      setError,
      setTitle,
      setFilter,
      inputRef,
    }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useTodo must be used within a AppContextProvider');
  }

  return context;
};
