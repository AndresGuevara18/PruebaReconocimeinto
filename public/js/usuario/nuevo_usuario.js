document.addEventListener("DOMContentLoaded", () => {
    createUser(); // Inicializar el formulario de registro si está presente
});

function createUser() {
    const form = document.getElementById("userForm");

    if (!form) {
        console.warn("⚠️ No se encontró el formulario en la página.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que la página se recargue automáticamente

        // Captura los valores del formulario
        const usuarioData = {
            tipo_documento: document.getElementById("tipo_documento").value,
            numero_documento: document.getElementById("numero_documento").value,
            nombre_empleado: document.getElementById("nombre_empleado").value,
            direccion: document.getElementById("direccion").value,
            telefono: document.getElementById("telefono").value,
            email_empleado: document.getElementById("email_empleado").value,
            eps: document.getElementById("eps").value,
            usuario: document.getElementById("usuario").value,
            contrasena: document.getElementById("contrasena").value,
            id_cargo: document.getElementById("id_cargo").value,
            fotoBase64: document.getElementById("fotoBase64").value, // Capturar la imagen en Base64
        };

        // Verificar si hay una imagen en Base64
        if (!usuarioData.fotoBase64) {
            console.error("⚠️ No se ha capturado una imagen.");
            alert("⚠️ Por favor, capture una foto antes de enviar el formulario.");
            return;
        }

        // Validar que los campos obligatorios no estén vacíos
        if (!usuarioData.tipo_documento || !usuarioData.numero_documento || !usuarioData.nombre_empleado || 
            !usuarioData.email_empleado || !usuarioData.id_cargo) {
            alert("⚠️ Por favor, complete todos los campos obligatorios.");
            return;
        }

        try {
            // Convertir Base64 a Blob
            const mimeType = "image/png"; // Ajusta según el tipo de imagen
            const blob = base64ToBlob(usuarioData.fotoBase64, mimeType);

            // Verificar el Blob
            console.log("Blob creado:", blob);
            console.log("Tamaño del Blob:", blob.size, "bytes");

            // Crear un FormData para enviar los datos
            const formData = new FormData();
            formData.append("tipo_documento", usuarioData.tipo_documento);
            formData.append("numero_documento", usuarioData.numero_documento);
            formData.append("nombre_empleado", usuarioData.nombre_empleado);
            formData.append("direccion", usuarioData.direccion);
            formData.append("telefono", usuarioData.telefono);
            formData.append("email_empleado", usuarioData.email_empleado);
            formData.append("eps", usuarioData.eps);
            formData.append("usuario", usuarioData.usuario);
            formData.append("contrasena", usuarioData.contrasena);
            formData.append("id_cargo", usuarioData.id_cargo);
            formData.append("foto", blob, "foto.png"); // Agregar el Blob como archivo

            // Verificar el FormData
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // Enviar los datos al backend
            const response = await fetch("/api/usuarios", {
                method: "POST",
                body: formData, // Usar FormData en lugar de JSON
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Usuario registrado exitosamente");
                window.location.href = "/usuario.html"; // Redirige a la lista de usuarios
            } else {
                alert("FRONT⚠️ Error: " + (result.error || "No se pudo registrar el usuario."));
                window.location.href = "/nuevo_usuario.html";
            }
        } catch (error) {
            console.error("FRONT❌ Error al enviar la solicitud:", error);
            alert("FRONT❌ Error al registrar el usuario.");
        }
    });
}

// 🔹 Función para convertir Base64 a Blob
function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}