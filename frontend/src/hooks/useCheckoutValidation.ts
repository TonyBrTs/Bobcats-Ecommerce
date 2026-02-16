// hooks/useCheckoutValidation.ts

type CheckoutFields = {
  nombre: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  provincia: string;
  canton: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  titular: string;
  cartItems: any[];
};
// Provincia y cantón
const provinciasYCantones: { [key: string]: string[] } = {
  "San José": [
    "San José",
    "Escazú",
    "Desamparados",
    "Aserrí",
    "Mora",
    "Goicoechea",
    "Santa Ana",
    "Alajuelita",
    "Vásquez de Coronado",
    "Acosta",
    "Tibás",
    "Moravia",
    "Montes de Oca",
    "Turrubares",
    "Dota",
    "Curridabat",
    "Pérez Zeledón",
    "León Cortés",
  ],
  Alajuela: [
    "Alajuela",
    "San Ramón",
    "Grecia",
    "San Mateo",
    "Atenas",
    "Naranjo",
    "Palmares",
    "Poás",
    "Orotina",
    "San Carlos",
    "Zarcero",
    "Valverde Vega",
    "Upala",
    "Los Chiles",
    "Guatuso",
    "Río Cuarto",
  ],
  Cartago: [
    "Cartago",
    "Paraíso",
    "La Unión",
    "Jiménez",
    "Turrialba",
    "Alvarado",
    "Oreamuno",
    "El Guarco",
  ],
  Heredia: [
    "Heredia",
    "Barva",
    "Santo Domingo",
    "Santa Bárbara",
    "San Rafael",
    "San Isidro",
    "Belén",
    "Flores",
    "Sarapiquí",
  ],
  Guanacaste: [
    "Liberia",
    "Nicoya",
    "Santa Cruz",
    "Bagaces",
    "Carrillo",
    "Cañas",
    "Abangares",
    "Tilarán",
    "Nandayure",
    "La Cruz",
    "Hojancha",
  ],
  Puntarenas: [
    "Puntarenas",
    "Esparza",
    "Buenos Aires",
    "Montes de Oro",
    "Osa",
    "Quepos",
    "Golfito",
    "Coto Brus",
    "Parrita",
    "Corredores",
    "Garabito",
  ],
  Limón: ["Limón", "Pococí", "Siquirres", "Talamanca", "Matina", "Guácimo"],
};

export const useCheckoutValidation = () => {
  const validate = (fields: CheckoutFields): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Nombre y apellidos
    if (!fields.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!fields.apellidos.trim())
      errors.apellidos = "Los apellidos son obligatorios.";

    // Dirección
    if (!fields.direccion.trim() || fields.direccion.length < 10) {
      errors.direccion = "La dirección debe tener al menos 10 caracteres.";
    }

    // Teléfono (8 dígitos)
    if (!/^\d{8}$/.test(fields.telefono)) {
      errors.telefono = "El teléfono debe tener exactamente 8 dígitos.";
    }

    // Provincia y cantón
    if (!provinciasYCantones[fields.provincia]) {
      errors.provincia = "Provincia inválida.";
    } else if (!provinciasYCantones[fields.provincia].includes(fields.canton)) {
      errors.canton = "Cantón inválido para la provincia seleccionada.";
    }

    // Número de tarjeta
    if (!/^\d{16}$/.test(fields.cardNumber)) {
      errors.cardNumber = "El número de tarjeta debe tener 16 dígitos." ;
    }

    // Fecha de vencimiento
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(fields.expiryDate)) {
      errors.expiryDate = "Formato de vencimiento inválido. Use MM/AA.";
    } else {
      const [mes, año] = fields.expiryDate
        .split("/")
        .map((val) => parseInt(val));
      const ahora = new Date();
      const añoActual = ahora.getFullYear() % 100; 
      const mesActual = ahora.getMonth() + 1; 

      if (año < añoActual || (año === añoActual && mes < mesActual)) {
        errors.expiryDate = "La tarjeta ya expiró. Use una fecha válida.";
      }
    }

    // CVV
    if (!/^\d{3,4}$/.test(fields.cvv)) {
      errors.cvv = "El código de seguridad (CVV) es inválido";
    }

    // Nombre del titular
    if (!fields.titular.trim()) {
      errors.titular = "El nombre del titular es obligatorio.";
    }

    // Carrito vacío
    if (fields.cartItems.length === 0) {
      errors.cartItems = "El carrito está vacío.";
    }

    return errors;
  };

  return { validate };
};
