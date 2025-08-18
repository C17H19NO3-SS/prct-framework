import { type ErrorHandler } from "elysia";
import { renderToReadableStream } from "react-dom/server";
import { _404 } from "../ErrorPages/404";

// You can write the API endpoints here.
export const ErrorPages: ErrorHandler = async ({ code }) => {
  switch (code) {
    case "NOT_FOUND":
      return new Response(await renderToReadableStream(<_404 />), {
        headers: {
          "Content-Type": "text/html",
        },
      });
  }
};
