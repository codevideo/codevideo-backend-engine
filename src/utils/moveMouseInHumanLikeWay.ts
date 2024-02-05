import * as robot from "robotjs";
import { IPoint } from "../interfaces/IPoint";

type BezierCurveType =
  | "arc-above"
  | "arc-below"
  | "arc-left"
  | "arc-right"
  | "straight-line";

export const moveMouseInHumanLikeWay = (
  startPoint: IPoint,
  endPoint: IPoint,
  curveType: BezierCurveType,
  jitter: boolean = false
) => {
  // Speed up the mouse.
  robot.setMouseDelay(2);

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
        robot.moveMouse(x, y);

        // Compensate by applying the opposite adjustment after each jitter.
        x -= deltaX;
        y -= deltaY;
        robot.moveMouse(x, y);
      }
    }
    return;
  }

  // Calculate the control point for the bezier curve based on the curveType.
  let controlPoint: IPoint;
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
  const bezierCurvePoints: IPoint[] = [];
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

  // Move the mouse along the bezier curve.
  for (const point of bezierCurvePoints) {
    robot.moveMouse(point.x, point.y);
  }
};

// Example usage:
const startPoint: IPoint = { x: 100, y: 100 };
const endPoint: IPoint = { x: 500, y: 400 };
const curveType: BezierCurveType = "straight-line";
const jitter: boolean = true;

moveMouseInHumanLikeWay(startPoint, endPoint, curveType, jitter);
