import { Schema, model, models } from "mongoose";

const productosSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
    },
    marca: {
      type: String,
    },
    tipo: {
      type: String,
      enum: ["bebida", "comida"],
      required: [true, "El tipo de producto es requerido (bebida o comida)"],
    },
    peso_o_contenido: {
      type: String,
    },
    precio: {
      type: Number,
      required: [true, "El precio es requerido"],
    },
    id_usuarioVendedor: {
      type: Schema.Types.ObjectId,
      ref: "UsuariosVendedores",
      required: [true, "El ID del vendedor es requerido"],
    },
    status_Stock: {
      type: Boolean,
      default: true,
    },
    url_img: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Productos || model("Productos", productosSchema);
