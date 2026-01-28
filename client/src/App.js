import { Routes, Route } from "react-router-dom";
import CreateText from "./components/createText";
import ViewText from "./components/viewText";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateText />} />
      <Route path="/v/:id" element={<ViewText />} />
    </Routes>
  );
}

export default App;
