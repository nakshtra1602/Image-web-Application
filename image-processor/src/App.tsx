import { Route, Routes } from "react-router-dom";
import ImageManipulator from "./Pages/ImageManipulator";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ImageManipulator />} />
      </Routes>
    </>
  );
}

export default App;
