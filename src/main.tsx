import React from "react";
import { createRoot } from "react-dom/client";
import Tooltip from "./index";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Tooltip />
  </React.StrictMode>
);
