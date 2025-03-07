document.addEventListener("DOMContentLoaded", () => {
    getAllUsuarios(); // Cargar usuarios automáticamente al cargar la página
});

// 🔹 Función para obtener y mostrar la lista de usuarios
function getAllUsuarios() {
    const tableBody = document.getElementById("userTable"); // Ubicación donde se mostrará la lista de usuarios

    if (!tableBody) {
        console.warn("⚠️ No se encontró la tabla de usuarios en la página.");
        return;
    }

    fetch('/api/usuarios')
        .then(response => {
            console.log("Respuesta recibida:", response); // Log para depuración

            if (!response.ok) {
                throw new Error("Error al obtener los usuarios");
            }
            return response.json();
        })
        .then(data => {
            tableBody.innerHTML = ""; // Limpiar contenido anterior antes de agregar nuevos datos
            
            data.forEach(user => {
                let row = `<tr>
                    <td>${user.id_usuario}</td>
                    <td>${user.tipo_documento}</td>
                    <td>${user.numero_documento}</td>
                    <td>${user.nombre_empleado}</td>
                    <td>${user.email_empleado}</td>
                    <td>${user.id_cargo}</td>
                    <td>
                        <button class="boton boton-editar">Editar</button>
                        <button class="boton boton-eliminar" onclick="eliminarUsuario(${user.id_usuario})">Eliminar</button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error("❌ Error al cargar usuarios:", error);
            tableBody.innerHTML = `<tr><td colspan="7">⚠️ Error al cargar los datos</td></tr>`;
        });
}

