import { Schema, model, models } from "mongoose";

const combosSchema = new Schema(
  {
    id_producto: [
      {
        type: Schema.Types.ObjectId,
        ref: "Productos",
        required: [true, "El ID del producto es requerido"],
      },
    ],
    precio: {
      type: Number,
      required: [true, "El precio es requerido"],
    },
    status_stock: {
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

export default models.Combos || model("Combos", combosSchema);
