import { useTodo } from '../context/AppContext';

export const NewTodoInput = () => {
  const {
    handleSubmit,
    setTitle,
    title,
    isSubmiting,
    inputRef,
  } = useTodo();

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        disabled={isSubmiting}
        ref={inputRef}
      />
    </form>
  );
};
