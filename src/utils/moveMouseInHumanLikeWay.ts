import { mouse, Point, straightTo } from "@nut-tree/nut-js";

type BezierCurveType =
  | "arc-above"
  | "arc-below"
  | "arc-left"
  | "arc-right"
  | "straight-line";

export const moveMouseInHumanLikeWay = async (
  startPoint: Point,
  endPoint: Point,
  curveType: BezierCurveType,
  jitter: boolean = false
) => {
  // Speed up the mouse.
  mouse.config.mouseSpeed = 20; // pixels per second

  if (curveType === "straight-line") {
    // Move the mouse in a straight line.
    const pointsCount = 100;
    const xIncrement = (endPoint.x - startPoint.x) / pointsCount;
    const yIncrement = (endPoint.y - startPoint.y) / pointsCount;

    for (let i = 0; i <= pointsCount; i++) {
      let x = startPoint.x + i * xIncrement;
      let y = startPoint.y + i * yIncrement;

      if (jitter) {
        // Add slight random deviations to the path.
        const deltaX = (Math.random() - 0.5) * 5;
        const deltaY = (Math.random() - 0.5) * 5;

        x += deltaX;
        y += deltaY;
        await straightTo(new Point(x, y));

        // Compensate by applying the opposite adjustment after each jitter.
        x -= deltaX;
        y -= deltaY;
        await straightTo(new Point(x, y));
      }
    }
    return;
  }

  // Calculate the control point for the bezier curve based on the curveType.
  let controlPoint: Point;
  if (curveType === "arc-above" || curveType === "arc-below") {
    controlPoint = { x: (startPoint.x + endPoint.x) / 2, y: startPoint.y };
  } else if (curveType === "arc-left" || curveType === "arc-right") {
    controlPoint = { x: startPoint.x, y: (startPoint.y + endPoint.y) / 2 };
  } else {
    console.error(
      "Invalid curve type. Please provide a valid curve type: 'arc-above', 'arc-below', 'arc-left', 'arc-right', or 'straight-line'."
    );
    return;
  }

  // Calculate the bezier curve points.
  const bezierCurvePoints: Point[] = [];
  for (let t = 0; t <= 1; t += 0.01) {
    let x =
      Math.pow(1 - t, 2) * startPoint.x +
      2 * (1 - t) * t * controlPoint.x +
      Math.pow(t, 2) * endPoint.x;
    let y =
      Math.pow(1 - t, 2) * startPoint.y +
      2 * (1 - t) * t * controlPoint.y +
      Math.pow(t, 2) * endPoint.y;

    if (jitter) {
      // Add slight random deviations to the path.
      const deltaX = (Math.random() - 0.5) * 5;
      const deltaY = (Math.random() - 0.5) * 5;

      x += deltaX;
      y += deltaY;
      bezierCurvePoints.push({ x, y });

      // Compensate by applying the opposite adjustment after each jitter.
      x -= deltaX;
      y -= deltaY;
      bezierCurvePoints.push({ x, y });
    }
  }

  // Move the mouse along the bezier curve points

  await mouse.move(bezierCurvePoints);
};

// Example usage:
const startPoint: Point = new Point(100, 100);
const endPoint: Point = new Point(500, 400);
const curveType: BezierCurveType = "straight-line";
const jitter: boolean = true;

moveMouseInHumanLikeWay(startPoint, endPoint, curveType, jitter);
