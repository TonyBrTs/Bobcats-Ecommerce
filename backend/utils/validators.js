/**
 * Validadores centralizados para reutilizar en diferentes rutas
 * Evita duplicación de código de validación
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z_ áéíóúÁÉÍÓÚñÑ]{3,50}$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d _\-!@#$%^&*(),.?":{}|<>]{8,}$/;

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {{valid: boolean, message?: string}}
 */
exports.validateEmail = (email) => {
  if (!email) {
    return {
      valid: false,
      message:
        "El correo electrónico es obligatorio. Por favor, ingresa tu correo electrónico",
    };
  }
  if (typeof email !== "string" || email.trim().length === 0) {
    return {
      valid: false,
      message: "El correo electrónico no puede estar vacío",
    };
  }
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message:
        "El formato del correo electrónico es inválido. Debe tener el formato: ejemplo@dominio.com",
    };
  }
  return { valid: true };
};

/**
 * Valida un username
 * @param {string} username - Username a validar
 * @returns {{valid: boolean, message?: string}}
 */
exports.validateUsername = (username) => {
  if (!username) {
    return {
      valid: false,
      message:
        "El nombre de usuario es obligatorio. Por favor, ingresa un nombre de usuario",
    };
  }
  if (typeof username !== "string" || username.trim().length === 0) {
    return {
      valid: false,
      message: "El nombre de usuario no puede estar vacío",
    };
  }
  if (username.length < 3) {
    return {
      valid: false,
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    };
  }
  if (username.length > 50) {
    return {
      valid: false,
      message: "El nombre de usuario no puede tener más de 50 caracteres",
    };
  }
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message:
        "El nombre de usuario contiene caracteres no permitidos. Solo se permiten letras, números, espacios y los caracteres: á, é, í, ó, ú, ñ",
    };
  }
  return { valid: true };
};

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {{valid: boolean, message?: string, rules?: string[]}}
 */
exports.validatePassword = (password) => {
  if (!password) {
    return {
      valid: false,
      message:
        "La contraseña es obligatoria. Por favor, ingresa una contraseña",
    };
  }
  if (typeof password !== "string" || password.trim().length === 0) {
    return { valid: false, message: "La contraseña no puede estar vacía" };
  }

  // Acumular todas las reglas que no se cumplen
  const failedRules = [];
  const rules = [];

  // Verificar cada regla y agregarla a la lista
  if (password.length < 8) {
    failedRules.push("Debe tener al menos 8 caracteres");
  }
  rules.push("Debe tener al menos 8 caracteres");

  if (!/[A-Za-z]/.test(password)) {
    failedRules.push("Debe contener al menos una letra (a-z o A-Z)");
  }
  rules.push("Debe contener al menos una letra (a-z o A-Z)");

  if (!/\d/.test(password)) {
    failedRules.push("Debe contener al menos un número (0-9)");
  }
  rules.push("Debe contener al menos un número (0-9)");

  if (/\s/.test(password)) {
    failedRules.push("No puede contener espacios en blanco");
  }
  rules.push("No puede contener espacios en blanco");

  // Si hay reglas que no se cumplen, devolver mensaje descriptivo
  if (failedRules.length > 0) {
    let message = `La contraseña no cumple con ${failedRules.length} ${
      failedRules.length === 1 ? "requisito" : "requisitos"
    }: ${failedRules.join(", ")}.`;

    return {
      valid: false,
      message: message,
      rules: rules,
      failedRules: failedRules,
    };
  }

  // Validación final con regex (por si hay algún caso edge)
  if (!passwordRegex.test(password)) {
    return {
      valid: false,
      message:
        'La contraseña contiene caracteres no permitidos. Solo se permiten letras, números y los siguientes caracteres especiales: _ - ! @ # $ % ^ & * ( ) , . ? " : { } | < >',
      rules: rules,
    };
  }

  return { valid: true };
};

/**
 * Valida múltiples campos a la vez
 * @param {Object} fields - Objeto con los campos a validar {email, username, password}
 * @returns {{valid: boolean, errors: Object, message?: string}}
 */
exports.validateFields = (fields) => {
  const errors = {};
  let isValid = true;
  const errorFields = [];

  if (fields.email !== undefined) {
    const emailValidation = exports.validateEmail(fields.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.message;
      errorFields.push("correo electrónico");
      isValid = false;
    }
  }

  if (fields.username !== undefined) {
    const usernameValidation = exports.validateUsername(fields.username);
    if (!usernameValidation.valid) {
      errors.username = usernameValidation.message;
      errorFields.push("nombre de usuario");
      isValid = false;
    }
  }

  if (fields.password !== undefined) {
    const passwordValidation = exports.validatePassword(fields.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.message;
      // Incluir reglas y reglas fallidas si están disponibles
      if (passwordValidation.rules) {
        errors.passwordRules = passwordValidation.rules;
      }
      if (passwordValidation.failedRules) {
        errors.passwordFailedRules = passwordValidation.failedRules;
      }
      errorFields.push("contraseña");
      isValid = false;
    }
  }

  // Crear mensaje descriptivo
  let message = "";
  if (!isValid) {
    if (errorFields.length === 1) {
      const fieldName = errorFields[0];
      // Si solo hay un campo con error, incluir el mensaje específico del error
      if (fieldName === "contraseña" && errors.password) {
        message = errors.password;
      } else if (fieldName === "correo electrónico" && errors.email) {
        message = errors.email;
      } else if (fieldName === "nombre de usuario" && errors.username) {
        message = errors.username;
      } else {
        message = `El campo ${fieldName} tiene un error de validación`;
      }
    } else if (errorFields.length === 2) {
      message = `Los campos ${errorFields[0]} y ${errorFields[1]} tienen errores de validación`;
    } else {
      const lastField = errorFields.pop();
      message = `Los campos ${errorFields.join(
        ", "
      )}, y ${lastField} tienen errores de validación`;
    }
  }

  return { valid: isValid, errors, message };
};
