import React, { useEffect } from "react";
import { OptionsSection } from "@shared/OptionsSection/index.jsx";
import OptionsWrapDropdown from "@widgets/TodosApp/ui/options/OptionsWrapDropdown.jsx";
import CalendarIcon from "@assets/svg/option-calendar-icon.svg?react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import CalendarAppCalendar from "./CalendarAppCalendar";
import {
  closeCalendarOptions,
  selectActiveCalendarDay,
  selectIsOpenCalendarOptions,
} from "../../../../redux/slice/calendar/calendarSlice";
import {
  addNewOptionItem,
  changeTodosAction,
  createSubtaskAction,
  deleteTodoItem,
  deleteTodosAction,
  selectActiveDayTasks,
  selectActiveTodoItem,
  selectTodosOptionItems,
  setActiveTodoItem,
  setTodoItemTitle,
  setTodosItemIsComplete,
} from "../../../../redux/slice/todos/todosSlice";
import TodosOptionItem from "../../../TodosApp/ui/options/TodosOptionItem";
import { isNotEmpty } from "../../../../util/validation";
import { useInput } from "../../../../hooks/useInput";
import SubtasksIcon from "@assets/svg/subtasks.svg?react";
import CalendarInput from "./CalendarInput";
import CheckboxTodo from "../../../../shared/CheakBoxTodo/CheakoxTodo";
import BacketIcon from "@assets/svg/backet.svg?react";
import { useLocation } from "react-router-dom";
function CalendarOptions() {
  const dispatch = useDispatch();
  const {
    value: messageValue,
    handleInputBlur: handleMessageBlur,
    handleInputChange: handleMessageChange,
    setInputState,
  } = useInput("", (value) => isNotEmpty(value));

  const isOptionsOpen = useSelector(selectIsOpenCalendarOptions);

  const activeDay = useSelector(selectActiveCalendarDay);
  const { activeTodo, optionItems } = useSelector((state) => {
    const activeTodo = state.todos.todosList.find(
      (todo) => todo.id === selectActiveTodoItem(state)
    );
    const subtasks = selectTodosOptionItems(state, activeTodo?.id);
    return { activeTodo, optionItems: subtasks };
  });

  const {
    value: inputTaskValue,
    handleInputBlur,
    handleInputChange,
    setInputState: setInputTaskState,
  } = useInput(activeTodo?.title || "", (value) => isNotEmpty(value));

  useEffect(() => {
    setInputTaskState({
      value: activeTodo?.title,
      didBlur: false,
      wasValidOnBlur: false,
    });
  }, [activeTodo?.title]);

  const dayTasks = useSelector(selectActiveDayTasks);

  function onDeleteTodoItem() {
    dispatch(deleteTodoItem(activeTodo?.id));
    dispatch(deleteTodosAction(activeTodo?.id));
  }
  function onSubmit(e) {
    e.preventDefault();
    if (!isNotEmpty(messageValue)) {
      handleMessageBlur();
      return;
    }
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    dispatch(
      createSubtaskAction({ taskId: activeTodo?.id, title: data.subtask_title })
    );
    setInputState({
      value: "",
      didBlur: false,
      wasValidOnBlur: false,
    });
  }

  const handleToggle = (todoId, status) => {
    dispatch(setTodosItemIsComplete(todoId));
    dispatch(
      changeTodosAction({
        id: todoId,
        data: { is_active: !status },
      })
    );
  };
  function onSubmitInput(e) {
    e.preventDefault();
    if (!isNotEmpty(inputTaskValue)) {
      handleInputBlur();
      return;
    }
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    dispatch(
      setTodoItemTitle({
        id: activeTodo?.id,
        title: data.input_title,
      })
    );

    dispatch(
      changeTodosAction({
        id: activeTodo?.id,
        data: { title: data.input_title },
      })
    );
  }

  function onCloseOptions() {
    dispatch(closeCalendarOptions());
  }

  return (
    <OptionsSection
      open={isOptionsOpen}
      onClose={onCloseOptions}
      className={clsx(
        isOptionsOpen
          ? "opacity-100 w-full md:max-w-[400px] translate-x-0 pointer-events-auto pb-[100px]! sm:pb-4!  "
          : "opacity-0 max-w-0 translate-x-0 pointer-events-none "
      )}
    >
      <div className='flex flex-col gap-6 w-full h-full px-5 pb-5 md:p-5  min-h-fit    '>
        <section className='flex flex-col justify-center  w-full gap-2'>
          {dayTasks?.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "flex flex-col justify-center sm:flex-row sm:items-center gap-2 border border-[#E0E4FF] p-2 rounded-xl shadow w-full min-w-0",
                activeTodo?.id === item.id && "bg-[#E1F5FF]"
              )}
              onClick={() => dispatch(setActiveTodoItem(item.id))}
            >
              <div className='flex items-center w-full'>
                <CheckboxTodo
                  key={item?.id}
                  checked={!item.is_active}
                  onChange={() => handleToggle(item.id, item.is_active)}
                  title={item?.title}
                />
              </div>
            </div>
          ))}
        </section>
        <div className='sm:mt-auto'>
          {dayTasks?.length > 0 && (
            <div className='flex flex-col min-h-[250px] mt-[50%] sm:mt-0  w-[95%] mx-auto  '>
              <OptionsWrapDropdown
                icon={<SubtasksIcon />}
                text={`Подзадачи (${optionItems.length || 0})`}
                haveDorder={true}
              >
                <div className='flex flex-col gap-2'>
                  <form
                    onSubmit={onSubmit}
                    className='flex justify-start items-center shodow rounded w-full  rounded-sm p-3 shadow-[0_0_10px_rgba(0,0,0,0.1)]'
                  >
                    <button
                      type='submit'
                      className='flex justify-center items-center p-1 '
                    >
                      {/* <PlusIcon className='w-[1.0625rem] h-[1.0625rem]' /> */}
                    </button>
                    <input
                      type='text'
                      name='subtask_title'
                      placeholder='Добавить подзадачу'
                      className={`focus:outline-none focus:ring-0 w-full`}
                      value={messageValue}
                      onBlur={handleMessageBlur}
                      onChange={handleMessageChange}
                    />
                  </form>
                  <ul className='flex flex-col gap-2 p-1'>
                    {optionItems?.map((item) => (
                      <TodosOptionItem
                        key={item.title}
                        title={item.title}
                        taskId={activeTodo?.id}
                        id={item.id}
                      />
                    ))}
                  </ul>
                </div>
              </OptionsWrapDropdown>

              <OptionsWrapDropdown
                icon={<CalendarIcon />}
                text={"Изменить"}
                haveDorder={true}
              >
                <form
                  onSubmit={onSubmitInput}
                  className='flex items-center w-full'
                >
                  <div className='flex items-center w-full gap-2'>
                    <input
                      type='text'
                      value={inputTaskValue}
                      onBlur={handleInputBlur}
                      onChange={handleInputChange}
                      name='input_title'
                      className='w-full py-2 px-3 rounded bg-[#ECF7FF] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A8A5FF]'
                      placeholder='Название задачи'
                    />
                    <button className='w-0 h-0 opacity-0'></button>
                  </div>
                </form>
              </OptionsWrapDropdown>

              <OptionsWrapDropdown
                icon={<CalendarIcon />}
                text={"Другая дата"}
                haveDorder={true}
              >
                <CalendarAppCalendar />
              </OptionsWrapDropdown>
              <button
                onClick={onDeleteTodoItem}
                className='border-t border-b border-[#E0E4FF] w-full flex gap-2 py-3 h-fit  text-[#CDCDCD]'
              >
                <BacketIcon /> Удалить
              </button>
            </div>
          )}
        </div>
        <CalendarInput date={activeDay} />
      </div>
    </OptionsSection>
  );
}

export default CalendarOptions;
