import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTodo, fetchTodo, deletTodo } from "../reducers/todoReducer";
import { logout } from "../reducers/authReducer";

const Todo = () => {
  const [mytodo, setTodo] = useState();
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const addTodo = () => {
    dispatch(createTodo({ todo: mytodo }));
  };

  useEffect(() => {
    dispatch(fetchTodo());
  }, []);

  return (
    <div>
      <input
        placeholder="write todo here"
        value={mytodo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button onClick={() => addTodo()}>Add todo</button>
      <ul>
        {todos.map((item) => {
          return (
            <li key={item._id} onClick={() => dispatch(deletTodo(item._id))}>
              {item.todo}
            </li>
          );
        })}
      </ul>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default Todo;
