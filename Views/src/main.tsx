import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createMemoryRouter,
  Route,
  Routes,
} from "react-router";
import { DefaultPage } from "./Pages/home";

createRoot(document.getElementById("root")!).render(
  <RouterProvider
    router={createMemoryRouter([
      {
        path: "/",
        element: <DefaultPage />,
        index: true,
      },
    ])}
  />
);
