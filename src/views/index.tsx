import { useEffect, useState } from "react";
import React from "react";
import { createRoot } from "react-dom/client";

const PageComponent = (): React.ReactNode => {
  const [state, setState] = useState("test");

  useEffect(() => {
    setTimeout(() => {
      setState("deneme");
    }, 2000);
  }, []);
  return <div>{state}</div>;
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <PageComponent />
);
