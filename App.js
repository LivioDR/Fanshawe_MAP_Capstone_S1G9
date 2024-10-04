import HomeScreen from "./screens/HomeScreen/HomeScreen";

// TODO: replace this with an auth variable of some sort
const loggedIn = true;

// TODO: replace this with a value retrieved from the DB
const isAdmin = true;
const userId = 'super1234';

export default function App() {
    return (
      <>
      {
        loggedIn &&
        <HomeScreen userId={userId} isAdmin={isAdmin}/>
      }
      </>
    );
}