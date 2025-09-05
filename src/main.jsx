import React from "react"; 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GameWrapper from "./GameWrapper.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <GameWrapper />
    </StrictMode>
)
