import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";

export default function App() {

  const [credentials, setCredentials] = useState("");

  return (
      <LoginScreen setCredentials={credentials}></LoginScreen>
  );
}
