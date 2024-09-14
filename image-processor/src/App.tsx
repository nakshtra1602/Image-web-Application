import { Route, Routes } from 'react-router-dom';
import ImageUpload from "./Pages/ImageUpload"

function App() {
  return (
   <>
   <Routes>
   <Route path="/" element={<ImageUpload />} />
   </Routes>
   </>
  );
}

export default App;
