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

export function displayEquation(var1, var2, canvasWidth,canvas_context) {
  if (var1 !== null && var2 !== null) {
    const ctx = canvas_context;
    ctx.font = "14px Arial";
    ctx.textAlign = "center"; // Center align text for better visualization
    ctx.clearRect(0, 0, canvasWidth, 20); // Clear previous equation display area
    ctx.fillText(`y = ${var1}x + ${var2}`, canvasWidth / 2, 10); // Display equation at the top of the canvas
  }
}