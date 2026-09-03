import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/ibm-plex-mono/400.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/workbench.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");

createRoot(root).render(<StrictMode><App /></StrictMode>);
