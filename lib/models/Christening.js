import mongoose from "mongoose";

const christeningSchema = new mongoose.Schema(
  {
    // Податоци за Крстениче
    child: {
      firstName: { type: String, required: true }, // Име на детето
      lastName: { type: String }, // Презиме
      gender: { type: String }, // Пол
      birthDate: {
        day: { type: Number },
        month: { type: Number },
        year: { type: Number },
      }, // Датум на раѓање
      birthPlace: { type: String, default: "Битола" }, // Место на раѓање
    },

    // Податоци за Татко
    father: {
      firstName: { type: String, required: true }, // Име
      lastName: { type: String, required: true }, // Презиме
    },

    // Податоци за Мајка
    mother: {
      firstName: { type: String, required: true }, // Име
      lastName: { type: String, required: true }, // Презиме
      childOrderNumber: { type: Number }, // Кое дете по ред е на мајката
    },

    // Податоци за Крштевање
    christening: {
      date: {
        day: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
      }, // Датум на крштевање
      church: { type: String }, // Храм на крштевање
      place: { type: String }, // Место на крштевање
      priestName: { type: String }, // Свештеник
      godparentFirstName: { type: String }, // Име на Кум
      godparentLastName: { type: String }, // Презиме на Кум
    },

    // Дополнителни податоци
    civillyRegistered: { type: Boolean }, // Дали е детето граѓански законо
    churchMarriage: { type: Boolean }, // Дали е детето црковно брачно
    isTwin: { type: Boolean, default: false }, // Дали е близнак

    notes: { type: String }, // Забелешка
    pageNumber: { type: String }, // Страна
    createdBy: { type: String }, // Корисник
  },
  {
    timestamps: true,
  }
);

// Индекси за autocomplete
christeningSchema.index({ "child.firstName": 1 });
christeningSchema.index({ "child.lastName": 1 });
christeningSchema.index({ "father.firstName": 1 });
christeningSchema.index({ "father.lastName": 1 });
christeningSchema.index({ "mother.firstName": 1 });
christeningSchema.index({ "mother.lastName": 1 });
christeningSchema.index({ "christening.godparentFirstName": 1 });
christeningSchema.index({ "christening.godparentLastName": 1 });
christeningSchema.index({ "christening.priestName": 1 });

export default mongoose.models.Christening ||
  mongoose.model("Christening", christeningSchema);
