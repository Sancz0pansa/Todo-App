import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';
import { useTodo } from '../context/AppContext';

const filterTodos = (todos: Todo[], filter: Filter) => {
  let filteredTodos = todos;

  switch (filter) {
    case 'Active':
      filteredTodos = filteredTodos.filter(todo => todo.completed === false);
      break;
    case 'Completed':
      filteredTodos = filteredTodos.filter(todo => todo.completed === true);
      break;
    case 'All':
    default:
  }

  return filteredTodos;
};

export const TodoList = () => {
  const {
    todos,
    filter,
    temporaryTodo,
  } = useTodo();

  return (

    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos(todos, filter).map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />

      ))}
      {temporaryTodo && <TempTodo temporaryTodo={temporaryTodo} />}
    </section>

  );
};
