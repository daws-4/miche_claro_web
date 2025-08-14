import { Schema, model, models } from "mongoose";

// --- NUEVO SUB-ESQUEMA PARA LAS UBICACIONES ---
// Define la estructura de una única ubicación guardada.
const UbicacionSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre de la ubicación es requerido."],
    trim: true,
  },
  latitud: {
    type: Number,
    required: [true, "La latitud es requerida."],
  },
  longitud: {
    type: Number,
    required: [true, "La longitud es requerida."],
  },
});

const usuariosSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "Por favor, ingrese su nombre"],
      trim: true,
      maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    },
    apellido: {
      type: String,
      required: [true, "Por favor, ingrese su apellido"],
      trim: true,
      maxlength: [50, "El apellido no puede tener más de 50 caracteres"],
    },
    cedula: {
      type: String,
      required: [true, "Por favor, ingrese su número de cédula"],
      trim: true,
      unique: true,
      maxlength: [
        20,
        "El número de cédula no puede tener más de 20 caracteres",
      ],
    },
    telefono: {
      type: String,
      required: [true, "Por favor, ingrese su número de teléfono"],
      trim: true,
      maxlength: [
        20,
        "El número de teléfono no puede tener más de 20 caracteres",
      ],
    },
    fecha_nacimiento: {
      type: Date,
      required: [true, "Por favor, ingrese su fecha de nacimiento"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Por favor, introduce un email válido."],
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    image: {
      type: String,
    },
    // --- NUEVO CAMPO AÑADIDO ---
    // Este es el array que contendrá las ubicaciones del usuario.
    ubicacionesGuardadas: {
      type: [UbicacionSchema], // Se define como un array del esquema de ubicación
      default: [], // Por defecto, el array estará vacío
    },
  },
  {
    timestamps: true,
  }
);

export default models.Usuarios || model("Usuarios", usuariosSchema);
