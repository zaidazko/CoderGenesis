import { useState, useCallback, useRef, useEffect } from "react";

/**
 * High-performance resizable panel hook using requestAnimationFrame
 * @param {number} initialWidth - Starting width in pixels
 * @param {number} minWidth - Minimum width constraint
 * @param {number} maxWidth - Maximum width constraint
 * @param {'left' | 'right'} direction - Which side the resize handle is on
 * @returns {{ width: number, startResizing: function, isResizing: boolean }}
 */
export function useResizable(initialWidth, minWidth, maxWidth, direction = "right") {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  
  // Use refs for values that change during drag to avoid stale closures
  const rafId = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseMove = useCallback(
    (e) => {
      // Cancel any pending animation frame to prevent queuing
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      // Schedule the update for the next frame
      rafId.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - startX.current;
        
        // Calculate new width based on direction
        let newWidth;
        if (direction === "right") {
          // Handle on right side: dragging right increases width
          newWidth = startWidth.current + deltaX;
        } else {
          // Handle on left side: dragging left increases width
          newWidth = startWidth.current - deltaX;
        }

        // Clamp between min and max
        const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
        setWidth(clampedWidth);
      });
    },
    [direction, minWidth, maxWidth]
  );

  const handleMouseUp = useCallback(() => {
    // Cancel any pending animation frame
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // Reset body styles
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.body.classList.remove("resizing");

    // Remove listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    setIsResizing(false);
  }, [handleMouseMove]);

  const startResizing = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Store initial values
      startX.current = e.clientX;
      startWidth.current = width;

      // Set body styles to prevent text selection and show resize cursor
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.body.classList.add("resizing");

      // Add listeners to document (not the handle) to prevent mouse slip
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      setIsResizing(true);
    },
    [width, handleMouseMove, handleMouseUp]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { width, setWidth, startResizing, isResizing };
}

/**
 * Percentage-based resizable hook for split panels
 * @param {number} initialPercent - Starting percentage (0-100)
 * @param {number} minPercent - Minimum percentage
 * @param {number} maxPercent - Maximum percentage
 * @param {React.RefObject} containerRef - Ref to the container element
 * @param {'left' | 'right'} direction - Which side the handle is on
 */
export function useResizablePercent(
  initialPercent,
  minPercent,
  maxPercent,
  containerRef,
  direction = "right"
) {
  const [percent, setPercent] = useState(initialPercent);
  const [isResizing, setIsResizing] = useState(false);

  const rafId = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const mouseX = e.clientX - containerRect.left;

        let newPercent;
        if (direction === "right") {
          // Percentage from left edge
          newPercent = (mouseX / containerWidth) * 100;
        } else {
          // Percentage from right edge (for right-side panels)
          newPercent = ((containerWidth - mouseX) / containerWidth) * 100;
        }

        const clampedPercent = Math.min(Math.max(newPercent, minPercent), maxPercent);
        setPercent(clampedPercent);
      });
    },
    [containerRef, direction, minPercent, maxPercent]
  );

  const handleMouseUp = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.body.classList.remove("resizing");

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    setIsResizing(false);
  }, [handleMouseMove]);

  const startResizing = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.body.classList.add("resizing");

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      setIsResizing(true);
    },
    [handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { percent, setPercent, startResizing, isResizing };
}

export default useResizable;

