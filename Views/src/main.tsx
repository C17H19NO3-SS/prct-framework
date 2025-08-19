import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import { DefaultPage } from "./Pages";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DefaultPage />} />
    </Routes>
  </BrowserRouter>
);
