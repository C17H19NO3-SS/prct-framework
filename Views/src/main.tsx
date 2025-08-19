import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createMemoryRouter,
  Route,
  Routes,
} from "react-router";
import { DefaultPage } from "./Pages/home";

export const routes = [
  {
    path: "/",
    element: <DefaultPage />,
    index: true,
  },
];

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={createMemoryRouter(routes)} />
);
