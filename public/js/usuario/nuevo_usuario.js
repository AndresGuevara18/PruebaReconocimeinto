document.addEventListener("DOMContentLoaded", () => {
    createUser(); // Inicializar el formulario de registro si está presente
});

// 🔹 Función para manejar el registro de usuarios
function createUser() {
    const form = document.getElementById("userForm");

    if (!form) {
        console.warn("⚠️ No se encontró el formulario en la página.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que la página se recargue automáticamente

        // Captura los valores del formulario y los almacena en un objeto
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
            id_cargo: document.getElementById("id_cargo").value
        };

        // Validar que los campos obligatorios no estén vacíos
        if (!usuarioData.tipo_documento || !usuarioData.numero_documento || !usuarioData.nombre_empleado || 
            !usuarioData.email_empleado || !usuarioData.id_cargo) {
            alert("⚠️ Por favor, complete todos los campos obligatorios.");
            return;
        }

        try {
            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuarioData)
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
