// Cuando el DOM esté completamente cargado, ejecuta estas funciones
document.addEventListener("DOMContentLoaded", async () => {
    await loadModels(); // Cargar modelos de face-api.js
    initializeCamera(); // Inicializar la cámara
});

// Función para cargar los modelos de face-api.js
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models'); // Cargar el modelo de detección de rostros
    console.log("✅ Modelos cargados correctamente.");
}

// Función para inicializar la cámara y configurar los eventos
function initializeCamera() {
    // Capturar elementos del HTML mediante el ID
    const openCameraBtn = document.getElementById("openCameraBtn"); // Botón para abrir la cámara
    const cameraBox = document.getElementById("cameraBox"); // Contenedor para la cámara
    const video = document.getElementById("video"); // Elemento de video para mostrar la cámara
    const captureBtn = document.getElementById("captureBtn"); // Botón para capturar la foto
    const noCaptureBtn = document.getElementById("noCaptureBtn"); // Botón para cerrar la cámara
    const captureCanvas = document.getElementById("captureCanvas"); // Canvas para capturar la imagen
    const fotoBase64 = document.getElementById("fotoBase64"); // Input oculto para guardar la imagen en base64
    const previewImage = document.getElementById("previewImage"); // Imagen de vista previa
    const faceDetectionMessage = document.getElementById("faceDetectionMessage"); // Mensaje de detección de rostro
    const overlayCanvas = document.getElementById("overlayCanvas"); // Canvas para dibujar el rectángulo de detección
    const deletePhotoBtn = document.getElementById("deletePhotoBtn");

    let streamVideo = null; // Variable para almacenar el flujo de video de la cámara
    let isFaceDetected = false; // Variable para rastrear si se detecta un rostro

    // FUNCIÓN PARA ABRIR LA CÁMARA
    async function openCamera() {
        previewImage.src = ""; // Limpiar la vista previa
        previewImage.style.display = "none";
        try {
            previewImage.src = ""; // Limpiar la vista previa
            previewImage.style.display = "none"; // Ocultar la vista previa
            // Solicitar acceso a la cámara del usuario
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (mediaStream) {
                streamVideo = mediaStream; // Almacenar el flujo de video
                video.srcObject = streamVideo; // Asignar el flujo de video al elemento <video>

                // Esperar a que el video esté listo para reproducirse
                video.onloadedmetadata = () => {
                    video.play(); // Reproducir el video
                    cameraBox.style.display = "block"; // Mostrar el contenedor de la cámara
                    openCameraBtn.style.display = "none"; // Ocultar el botón de abrir cámara
                    captureBtn.style.display = "block"; // Mostrar el botón de capturar foto
                    noCaptureBtn.style.display = "block"; // Mostrar el botón de no capturar

                    console.log("✅ Cámara activada correctamente.");

                    // Iniciar la detección de rostros
                    detectFaces();
                };
            } else {
                console.error("⚠️ No se recibió flujo de video.");
                alert("No se pudo acceder a la cámara.");
            }
        } catch (error) {
            console.error("❌ Error al acceder a la cámara:", error);
            alert("No se puede acceder a la cámara.");
        }
    }

    // FUNCIÓN PARA DETECTAR ROSTROS EN TIEMPO REAL
    // Función para detectar rostros en tiempo real
async function detectFaces() {
    const displaySize = { width: video.videoWidth, height: video.videoHeight }; // Obtener el tamaño del video

    // Ajustar el tamaño del overlayCanvas para que coincida con el video
    overlayCanvas.width = video.videoWidth;
    overlayCanvas.height = video.videoHeight;

    // Ajustar el tamaño del overlayCanvas para la detección
    faceapi.matchDimensions(overlayCanvas, displaySize);

    // Verificar la detección de rostros cada 100ms
    setInterval(async () => {
        // Limitar la detección a un solo rostro
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ maxDetections: 1 })); // Detectar un solo rostro
        const resizedDetections = faceapi.resizeResults(detections, displaySize); // Redimensionar las detecciones al tamaño del overlayCanvas

        // Limpiar el overlayCanvas antes de dibujar
        const overlayContext = overlayCanvas.getContext("2d");
        overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        if (resizedDetections.length > 0) {
            isFaceDetected = true; // Rostro detectado
            faceDetectionMessage.style.display = "block"; // Mostrar el mensaje
            faceDetectionMessage.textContent = "✅ Rostro detectado"; // Actualizar el texto del mensaje
            faceDetectionMessage.style.color = "green"; // Cambiar el color del mensaje a verde
            captureBtn.disabled = false; // Habilitar el botón de captura

            // Dibujar un rectángulo alrededor del rostro detectado en el overlayCanvas
            faceapi.draw.drawDetections(overlayCanvas, resizedDetections); // Dibujar las detecciones en el overlayCanvas
        } else {
            isFaceDetected = false; // No se detectó rostro
            faceDetectionMessage.style.display = "block"; // Mostrar el mensaje
            faceDetectionMessage.textContent = "⚠️ No se detectó ningún rostro"; // Actualizar el texto del mensaje
            faceDetectionMessage.style.color = "red"; // Cambiar el color del mensaje a rojo
            captureBtn.disabled = true; // Deshabilitar el botón de captura
        }
    }, 100); // Verificar cada 100ms
}

    // FUNCIÓN PARA CAPTURAR LA IMAGEN Y CONVERTIRLA A BASE64
    function captureImage() {
        if (!isFaceDetected) {
            alert("⚠️ No se ha detectado un rostro. Por favor, asegúrate de que tu rostro esté visible.");
            return; // Detener la función si no se detecta un rostro
        }
    
        try {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                // Usar el captureCanvas para capturar la foto
                captureCanvas.width = video.videoWidth; // Establecer el ancho del captureCanvas
                captureCanvas.height = video.videoHeight; // Establecer el alto del captureCanvas
    
                const captureContext = captureCanvas.getContext("2d"); // Obtener el contexto 2D del captureCanvas
                captureContext.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height); // Dibujar la imagen del video en el captureCanvas
    
                const imageBase64 = captureCanvas.toDataURL("image/png"); // Convertir la imagen a formato Base64
                fotoBase64.value = imageBase64; // Guardar la imagen en el input oculto
    
                previewImage.src = imageBase64; // Mostrar la imagen capturada en la vista previa
                previewImage.style.display = "block"; // Mostrar el elemento de vista previa
                deletePhotoBtn.style.display = "block"; // Mostrar el botón de eliminar foto
    
                cameraBox.style.display = "none"; // Ocultar el contenedor de la cámara
                openCameraBtn.style.display = "none"; // Ocultar el botón de abrir cámara
                captureBtn.style.display = "none"; // Ocultar el botón de capturar foto
                noCaptureBtn.style.display = "none"; // Ocultar el botón de no capturar
    
                alert("✅ Imagen capturada correctamente.");
                console.log("✅ Imagen capturada correctamente:", imageBase64);
    
                closeCamera(); // Cerrar la cámara después de capturar la imagen
            } else {
                console.warn("⚠️ No se pudo capturar la imagen porque el video no está cargado.");
                alert("⚠️ No se puede capturar la imagen, asegúrate de que la cámara está activa.");
            }
        } catch (error) {
            console.error("❌ Error al capturar la imagen:", error);
            alert("❌ Ocurrió un error al capturar la imagen. Inténtalo nuevamente.");
        }
    }

    // FUNCIÓN PARA CERRAR LA CÁMARA
    function closeCamera() {
        if (streamVideo) {
            streamVideo.getTracks().forEach(track => track.stop()); // Detener todas las pistas de video
            streamVideo = null; // Restablecer la variable del flujo de video
        }

        cameraBox.style.display = "none"; // Ocultar el contenedor de la cámara
        openCameraBtn.style.display = "block"; // Mostrar el botón de abrir cámara
        captureBtn.style.display = "none"; // Ocultar el botón de capturar foto
        noCaptureBtn.style.display = "none"; // Ocultar el botón de no capturar
        faceDetectionMessage.style.display = "none"; // Ocultar el mensaje de detección de rostro
        console.log("✅ Cámara cerrada correctamente.");
    }

    // Función para eliminar la foto capturada
    function deletePhoto() {
        previewImage.src = ""; // Limpiar la vista previa
        previewImage.style.display = "none"; // Ocultar la vista previa
        deletePhotoBtn.style.display = "none"; // Ocultar el botón de eliminar foto
        fotoBase64.value = ""; // Limpiar el input oculto
        openCameraBtn.style.display = "block"; // Mostrar el botón de abrir cámara
        window.location.href = "/nuevo_usuario.html";
    }

    // Asignar eventos a los botones
    openCameraBtn.addEventListener("click", openCamera); // Abrir la cámara al hacer clic
    noCaptureBtn.addEventListener("click", closeCamera); // Cerrar la cámara al hacer clic
    captureBtn.addEventListener("click", captureImage); // Capturar la imagen al hacer clic
    deletePhotoBtn.addEventListener("click", deletePhoto);
}