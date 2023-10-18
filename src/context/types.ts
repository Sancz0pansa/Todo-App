import {
  Dispatch, FormEventHandler, MutableRefObject, SetStateAction,
} from 'react';
import { Todo } from '../types/Todo';
import { ErrorMess } from '../types/Error';
import { Filter } from '../types/Filter';

export type TodoContextType = {
  todos: Todo[];
  counter: number;
  handleComplete: (todo: Todo, callback: () => void) => void;
  handleCompleteALL: (toDos: Todo[], data: boolean) => void;
  handleDelete: (todo: Todo, callback?: () => void) => void;
  handleSubmit: FormEventHandler;
  handleError: (mess: ErrorMess) => void;
  temporaryTodo: Todo | null;
  error: ErrorMess;
  title: string;
  isSubmiting: boolean;
  filter: Filter;
  inputRef: MutableRefObject<HTMLInputElement | null>
  setError: Dispatch<SetStateAction<ErrorMess>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setFilter: Dispatch<SetStateAction<Filter>>;
};
