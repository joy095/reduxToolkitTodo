import React, { useEffect } from "react";
import Auth from "./components/Auth";
import Todo from "./components/Todo";
import { useSelector, useDispatch } from "react-redux";
import { addToken } from "./reducers/authReducer";

const App = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  useEffect(() => {
    dispatch(addToken());
  }, []);

  return <div>{token ? <Todo /> : <Auth />}</div>;
};

export default App;
