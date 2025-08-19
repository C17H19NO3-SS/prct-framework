import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DefaultPage } from "./Pages/default";

const PageComponent = (): React.ReactNode => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultPage />} index />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <PageComponent />
);
