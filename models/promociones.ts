import { Schema, model, models } from "mongoose";

const promocionesSchema = new Schema(
  {
    fecha_inicio: {
      type: String,
      required: [true, "La fecha de inicio es requerida"],
    },
    fecha_fin: {
      type: String,
      required: [true, "La fecha de fin es requerida"],
    },
    id_promocionado: {
      type: Schema.Types.ObjectId,
      required: [true, "El ID del producto/combo promocionado es requerido"],
    },
    precio_promocionado: {
      type: Number,
      required: [true, "El precio promocionado es requerido"],
    },
    status_promocion: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Promociones || model("Promociones", promocionesSchema);
