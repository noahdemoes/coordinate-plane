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


export function check_answer(points,maxPoints,slope,var1,yIntercept,var2) {
  let message = "Please select exactly two points.";
  if (points.length === maxPoints) {
    const { slope, yIntercept } = calculateSlopeAndIntercept(points);
    if (slope === var1 && yIntercept === var2) {
      message = 'Correct! Great job.';
    } else {
      message = "Incorrect, let's try again.";
    }
  }
  return message;
}

export function drawGraph(x_abs_val,y_abs_val,
  points,slope, yIntercept,
  canvasWidth,canvasHeight,
  canvasContext,
  contextFont="10px Arial",
  contextTextAlign="center",
  contextTextBaseline="middle",
  contextStrokeStyle="#ddd",
  contextGridStyle='#000') {
  const ctx = canvasContext;
  const numPoints = x_abs_val + y_abs_val + 1;
  const step = canvasWidth / (numPoints - 1);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid and labels
    ctx.font = contextFont;
    ctx.textAlign = contextTextAlign;
    ctx.textBaseline = contextTextBaseline;
    for (let i = 0; i < numPoints; i++) {
      const pos = step * i;
      const label = i - x_abs_val; // Shift index to get labels from -10 to 10

      // Draw vertical grid lines
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvasHeight);
      ctx.strokeStyle = contextStrokeStyle;
      ctx.stroke();

      // Draw horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvasWidth, pos);
      ctx.stroke();

      // Labels
      if (label !== 0) { // Avoid drawing over origin labels
        ctx.fillText(label, pos, canvasHeight / 2 + 15);
        ctx.fillText(-label, canvasWidth / 2 - 15, pos);
      }
    }

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight/ 2);
    ctx.strokeStyle = contextGridStyle;
    ctx.stroke();

    // Redraw lines between points, labels, and equations if any
    drawLines(x_abs_val,y_abs_val,points,canvasWidth,canvasHeight,canvasContext, slope, yIntercept);
    labelPoints(x_abs_val,y_abs_val,points,canvasWidth,canvasContext);
  }