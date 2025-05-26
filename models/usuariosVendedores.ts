import { Schema, model, models } from "mongoose";

export const PagosSchema = new Schema({
  mes: {
    type: String,
  },
  fecha_de_facturacion: {
    type: String,
  },
  monto_a_pagar: {
    type: Number,
  },
  fecha_de_cancelacion: {
    type: String,
  },
  divisa_cancelada: {
    type: String,
  },
  monto_cancelado: {
    type: Number,
  },
  cambio_divisa:{
    type: String,
  }
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
  },
  telefono: {
    type: Number,
  },
  banco: {
    type: String,
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