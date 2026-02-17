import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import TemplatePage from "./pages/TemplatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/template/:templateId" element={<TemplatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
