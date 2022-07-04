const vertexShaderSource = `#version 300 es

in vec3 aPos;

void main() {
  gl_Position = vec4(aPos, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

out vec4 FragColor;
uniform vec4 ourColor;

void main() {
  FragColor = ourColor;
}
`;

function main() {
  // Get A WebGL context
  let canvas = document.getElementById("c");
  let gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // shader program 
  let program = webglUtils.createProgramFromSources(gl, [
    vertexShaderSource,
    fragmentShaderSource,
  ]);  

  let positions = [
    0.5, -0.5, 0.0,   // bottom right
    -0.5, -0.5, 0.0,  // bottom left
    0.0,  0.5, 0.0    // top 
];

  let vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Turn on the attribute
  let positionAttributeLocation = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  let component = 3; 
  let type = gl.FLOAT; // the data is 32bit floats
  let normalize = false; // don't normalize the data
  let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    component,
    type,
    normalize,
    stride,
    offset
  );


  function drawScene(now) {
    gl.useProgram(program);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    now *= 0.001;
    let greenValue = Math.sin(now) / 2.0 + 0.5;
    // look up uniform locations
    let ourColor = gl.getUniformLocation(program, "ourColor");
    gl.uniform4f(ourColor, 0.0, greenValue, 0.0, 1.0);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 3;
    gl.drawArrays(primitiveType, offset, count);

    // Call drawScene again next frame
    requestAnimationFrame(drawScene);
  
  }

  requestAnimationFrame(drawScene);

}

main();
