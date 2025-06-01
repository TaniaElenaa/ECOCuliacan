// window.onload = function() {
//     const successMessageDiv = document.querySelector('.flash-message.success');
//     const errorMessageDiv = document.querySelector('.flash-message.error');
    
//     const genericErrorPassportDiv = document.querySelector('.flash-message.error'); 

//     if (successMessageDiv && successMessageDiv.textContent.trim().length > 0) {
//         alert('Mensaje de Éxito: ' + successMessageDiv.textContent.trim());
//     } else if (errorMessageDiv && errorMessageDiv.textContent.trim().length > 0) {
//         alert('Mensaje de Error: ' + errorMessageDiv.textContent.trim());
//     } else if (genericErrorPassportDiv && genericErrorPassportDiv.textContent.trim().length > 0) {
//         alert('Mensaje de Error General: ' + genericErrorPassportDiv.textContent.trim());
//     }
// };

function togglePasswordVisibility(fieldId, iconElement) {

    const passwordField = document.getElementById(fieldId);
    const toggleIcon = iconElement.querySelector('img');
    

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.src = '/images/ojo.png'; // Cambia al icono de ojo abierto
        toggleIcon.alt = 'Ocultar Contraseña';
    } else {
        passwordField.type = 'password';
        toggleIcon.src = '/images/ojoff.png'; // Cambia al icono de ojo cerrado
        toggleIcon.alt = 'Mostrar Contraseña';
    }
}


function onlyNumber(element, maxLength) {
    if (element && element.value !== undefined) {
      // Primero, limpia el valor para dejar solo números
      let cleanValue = element.value.replace(/[^0-9]/g, '');

      // Luego, si se ha especificado un maxLength, trunca el valor
      if (maxLength && cleanValue.length > maxLength) {
        cleanValue = cleanValue.substring(0, maxLength);
      }
      element.value = cleanValue;
    }
  }

function inputName(element) {
    const fieldId = element.id;
    let input = element.value;

    switch (fieldId) {
        case 'cardHolder':
            // Solo permite letras y espacios para nombres
            element.value = input.replace(/[^A-Za-z\s]/g, '');
            // Limpia cualquier mensaje de validación personalizado establecido previamente
            element.setCustomValidity('');
            break;

        case 'expiryDate':
            // Elimina cualquier carácter que no sea un dígito
            input = input.replace(/\D/g, '');

            // Agrega la barra después de los primeros 2 dígitos (el mes)
            if (input.length > 2) {
                input = input.substring(0, 2) + '/' + input.substring(2, 4);
            }

            // Limita a un máximo de 5 caracteres (MM/AA)
            if (input.length > 5) {
                input = input.substring(0, 5);
            }

            element.value = input; // Actualiza el valor del campo de entrada

            // Valida el formato
            const regex = /^(0[1-9]|1[0-2])\/?(\d{2})$/;
            if (!regex.test(input) && input.length === 5) {
                // Si tiene la longitud completa, pero no coincide con el formato
                element.setCustomValidity('Formato MM/AA inválido (Ej: 12/26).');
            } else if (input.length < 5 && input.length > 0) {
                 // Si está incompleto
                 element.setCustomValidity('Formato incompleto (MM/AA).');
            } else {
                element.setCustomValidity(''); // Limpia cualquier mensaje de validación personalizado
            }
            break;

    }
}
// Esto da feedback inmediato al usuario cuando sale del campo si el formato es incorrecto.
document.addEventListener('DOMContentLoaded', function() {
    const expiryDateField = document.getElementById('expiryDate');
    if (expiryDateField) { // Asegurarse de que el elemento existe
        expiryDateField.addEventListener('blur', function() {
            const input = this.value;
            const regex = /^(0[1-9]|1[0-2])\/?(\d{2})$/;

            // Solo validar si el campo no está vacío
            if (input.length > 0 && !regex.test(input)) {
                this.setCustomValidity('Por favor, introduce una fecha válida en formato MM/AA (Ej: 12/26).');
            } else {
                this.setCustomValidity(''); // Campo válido
            }
        });
    }
});