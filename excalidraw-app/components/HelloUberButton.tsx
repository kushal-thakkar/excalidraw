import React, { useCallback } from "react";

import { newTextElement } from "@excalidraw/element";

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

interface HelloUberButtonProps {
  excalidrawAPI: ExcalidrawImperativeAPI;
}

export const HelloUberButton: React.FC<HelloUberButtonProps> = ({
  excalidrawAPI,
}) => {
  const drawAnimatedHelloUber = useCallback(async () => {
    const message = "Hello Uber";
    const letters = message.split("");
    const elements: any[] = [];

    // Get current scene state
    const appState = excalidrawAPI.getAppState();
    const viewportCenterX = appState.width / 2 - appState.scrollX;
    const viewportCenterY = appState.height / 2 - appState.scrollY;

    // Starting position for the text
    const startX = viewportCenterX - (message.length * 30) / 2;
    const startY = viewportCenterY;

    // Animate each letter appearing
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];

      // Create a text element for each letter
      const textElement = newTextElement({
        x: startX + i * 30,
        y: startY + Math.sin(i * 0.5) * 20, // Wave effect
        text: letter,
        fontSize: 48,
        strokeColor: "#5100ff", // Uber purple
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 2,
        roughness: 0,
        opacity: 100,
      });

      elements.push(textElement);

      // Add element to scene with animation delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      excalidrawAPI.updateScene({
        elements: [...excalidrawAPI.getSceneElements(), textElement],
      });
    }

    // After all letters are drawn, animate them bouncing
    setTimeout(() => {
      const currentElements = excalidrawAPI.getSceneElements();
      const textElements = currentElements.slice(-message.length);

      let bounce = 0;
      const bounceInterval = setInterval(() => {
        bounce++;

        const updatedElements = currentElements
          .slice(0, -message.length)
          .concat(
            textElements.map((el, i) => ({
              ...el,
              y: startY + Math.sin((bounce + i) * 0.3) * 30,
            })),
          );

        excalidrawAPI.updateScene({
          elements: updatedElements,
        });

        if (bounce > 20) {
          clearInterval(bounceInterval);
        }
      }, 50);
    }, 1000);
  }, [excalidrawAPI]);

  return (
    <button
      className="hello-uber-button"
      onClick={drawAnimatedHelloUber}
      style={{
        position: "fixed",
        top: "70px",
        right: "20px",
        padding: "10px 20px",
        backgroundColor: "#5100ff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#6b1aff";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#5100ff";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      ✨ Hello Uber
    </button>
  );
};
