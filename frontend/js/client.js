const socket = new WebSocket("ws://localhost:8999");

socket.onopen = function (e) {
  console.log("[open] Conexión establecida");
  console.log("Enviando al servidor");
  socket.send("Mi nombre es John");
};

socket.onmessage = function (event) {
  console.log(`[message] Datos recibidos del servidor: ${event.data}`);
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(
      `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
    );
  } else {
    // ej. El proceso del servidor se detuvo o la red está caída
    // event.code es usualmente 1006 en este caso
    console.log("[close] La conexión se cayó");
  }
};

socket.onerror = function (error) {
  console.log(`[error] ${error.message}`);
};
