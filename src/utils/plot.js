export function getRandomNonZero(min, max) {
    let result;
    do {
      result = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (result === 0);
    return result;
  }
  
export function selectRandomVariables(x_abs_val, y_abs_val) {
    let var1, var2;
  
    // Ensure x_abs_val and y_abs_val are positive
    x_abs_val = Math.abs(x_abs_val);
    y_abs_val = Math.abs(y_abs_val);
  
    var1 = getRandomNonZero(-x_abs_val, x_abs_val);
    var2 = getRandomNonZero(-y_abs_val, y_abs_val);
  
    return { var1, var2 };
  }


export function labelPoints(x_abs_val,y_abs_val,points,canvasWidth,canvas_context,context_font="12px Arial") {
  const numPoints = Math.abs(x_abs_val)+Math.abs(y_abs_val)+1; // From -10 to 10 inclusive
  const step = canvasWidth / (numPoints - 1);
  const ctx = canvas_context;
  ctx.font = context_font;
  points.forEach((point, index) => {
    const canvasX = (point.x + Math.abs(x_abs_val)) * step;
    const canvasY = (Math.abs(x_abs_val) - point.y) * step;
    ctx.fillText(`Point ${index + 1}: (${point.x}, ${point.y})`, canvasX, canvasY - Math.abs(x_abs_val));
  });
}

export function drawLines(x_abs_val,y_abs_val,points,canvasWidth,canvasHeight,canvas_context, slope, yIntercept,strokeStyle="blue",lineWidth=2) {
  if (points.length < 2 || slope === null) return;

  const ctx = canvas_context;
  const numPoints = x_abs_val + y_abs_val + 1;
  const step = canvasWidth / (numPoints - 1);

  // Calculate start and end points of the line on the canvas
  const xStart = -1 * Math.abs(x_abs_val);
  const xEnd = Math.abs(x_abs_val);
  const yStart = slope * xStart + yIntercept;
  const yEnd = slope * xEnd + yIntercept;

  // Convert these points to canvas coordinates
  const canvasXStart = (xStart + Math.abs(x_abs_val)) * step;
  const canvasYStart = canvasHeight - (yStart + Math.abs(y_abs_val)) * step;
  const canvasXEnd = (xEnd + Math.abs(x_abs_val)) * step;
  const canvasYEnd = canvasHeight - (yEnd + Math.abs(y_abs_val)) * step;

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(canvasXStart, canvasYStart);
  ctx.lineTo(canvasXEnd, canvasYEnd);
  ctx.strokeStyle = strokeStyle; // Change the line color to blue
  ctx.lineWidth = lineWidth; // Optional: Set the line width
  ctx.stroke();
}

export function calculateSlopeAndIntercept(points) {
  if (points.length < 2) {
    return { slope: null, yIntercept: null }; // Ensure there are enough points to calculate slope
  }

  const [p1, p2] = points;
  let slope, yIntercept;

  if (p1.x !== p2.x) {
    slope = (p2.y - p1.y) / (p2.x - p1.x);
    yIntercept = p1.y - slope * p1.x;
  } else {
    slope = Infinity; // Slope of a vertical line is undefined
    yIntercept = null;
  }

  return { slope, yIntercept };
}