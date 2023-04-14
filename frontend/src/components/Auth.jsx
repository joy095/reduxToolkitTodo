import { useState } from "react";
import { signupUser, signinUser } from "../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import "./loading.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState("signin");
  const { loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const authenticate = () => {
    if (auth === "signin") {
      dispatch(signinUser({ email, password }));
    } else {
      dispatch(signupUser({ email, password }));
    }
  };

  return (
    <div>
      {loading && (
        <div>
          <div className="loader"></div>
        </div>
      )}
      <h1>please {auth}!</h1>
      {error && <h5>{error}</h5>}
      <h1>please {auth}</h1>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {auth === "signin" ? (
        <h6 onClick={() => setAuth("signup")}>Don't have account</h6>
      ) : (
        <h6 onClick={() => setAuth("signin")}>Already have account</h6>
      )}
      <button onClick={() => authenticate()}>{auth}</button>
    </div>
  );
};

export default Auth;
