import { Schema, model, models } from "mongoose";

export const PagosSchema = new Schema({
  mes: {
    type: String,
    required: true,
  },
  fecha_de_facturacion: {
    type: String,
    required: true,
  },
  monto_a_pagar: {
    type: Number,
    required: true,
  },
  fecha_de_cancelacion: {
    type: String,
    required: true,
  },
  divisa_cancelada: {
    type: String,
    required: true,
  },
  monto_cancelado: {
    type: Number,
    required: true,
  },
  cambio_divisa: {
    type: String,
    required: true,
  },
});

export const DatosBancolombiaSchema = new Schema({
  nequi: {
    type: Number,
  },
  numero_cuenta: {
    type: Number,
  },
  tipo_cuenta: {
    type: String,
  },
});

export const DatosPagoMovilSchema = new Schema({
  cedula_rif: {
    type: Number,
    required: true,
  },
  telefono: {
    type: Number,
    required: true,
  },
  banco: {
    type: String,
    required: true,
  },
});

const usuariosVendedoresSchema = new Schema(
  {
    email:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password:{
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    telefono1: {
      type: String,
      trim: true,
    },
    telefono2: {
      type: String,
      trim: true,
    },
    datosPagoMovil: DatosPagoMovilSchema,
    datosBancolombia: DatosBancolombiaSchema,
    datosZelle: {
      type: String,
    },
    pagos: [PagosSchema],
    activo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.UsuariosVendedores ||
  model("UsuariosVendedores", usuariosVendedoresSchema);