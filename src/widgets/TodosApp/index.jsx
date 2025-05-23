import { TodosInput } from "./ui/todos/TodosInput";
import { TodosList } from "./ui/todos/TodosList";
import { TodosItem } from "./ui/todos/TodosItem";
import Dropdown from "../../shared/ui/dropdown/Dropdown";
import { MainSection } from "../../shared/MainSection";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewTodoItem,
  selectTodosActiveItems,
  selectTodosCompletedItems,
} from "../../redux/slice/todos/todosSlice";
import { useInput } from "../../hooks/useInput";
import { isNotEmpty } from "../../util/validation";

export const TodosApp = () => {
  const dispatch = useDispatch();

  const activeTodos = useSelector(selectTodosActiveItems);
  const completedTodos = useSelector(selectTodosCompletedItems);

  const {
    value: messageValue,
    handleInputBlur: handleMessageBlur,
    handleInputChange: handleMessageChange,
    hasError: messageHasError,
    setInputState,
  } = useInput("", (value) => isNotEmpty(value));

  function onSubmit(e) {
    e.preventDefault();

    if (!isNotEmpty(messageValue)) {
      handleMessageBlur();
      return;
    }
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    dispatch(addNewTodoItem(data.todo_title));
    setInputState({
      value: "",
      didBlur: false,
      wasValidOnBlur: false,
    });
  }
  return (
    <MainSection>
      <h2 className='capitalize mb-[30px]'>список задач</h2>
      <TodosInput
        value={messageValue}
        onBlur={handleMessageBlur}
        onChange={handleMessageChange}
        onSubmit={onSubmit}
        name='todo_title'
        // messageHasError={messageHasError}
      />

      <TodosList>
        <div className='flex flex-col gap-8'>
          <div className='cursor-pointer transition-colors '>
            {activeTodos.map((todo) => (
              <TodosItem
                key={todo.title}
                title={todo.title}
                statusOfImportant={todo.statusOfImportant}
                deadline={todo.deadline}
                isComplete={false}
              />
            ))}
          </div>
          <Dropdown
            btnText={"Выполненые"}
            rightIcon={
              <svg
                viewBox='0 0 448 512'
                xmlns='http://www.w3.org/2000/svg'
                className='fill-[#5E5E5E80] w-3 h-3 mt-[2px]'
              >
                <path d='M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z' />
              </svg>
            }
            rightIconPosition='inline'
            className=''
          >
            <div className='text-[#5E5E5E] cursor-pointer transition-colors w-full '>
              {completedTodos.map((todo) => (
                <TodosItem
                  key={todo.title}
                  title={todo.title}
                  statusOfImportant={todo.statusOfImportant}
                  deadline={todo.deadline}
                  isComplete={true}
                />
              ))}
            </div>
          </Dropdown>
        </div>
      </TodosList>
    </MainSection>
  );
};
