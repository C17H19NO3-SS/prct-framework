import type React from "react";

export const App = ({
  Scripts,
}: {
  Scripts: () => React.ReactNode | React.ReactNode[] | string;
}): React.ReactNode => (
  <html>
    <head>
      <title>Crct | Home</title>
    </head>
    <body>
      <div id="root"></div>
      <Scripts />
    </body>
  </html>
);
