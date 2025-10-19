import mongoose from "mongoose";

const marriageSchema = new mongoose.Schema(
  {
    // Податоци за Младоженец (Groom)
    groom: {
      firstName: { type: String, required: true }, // Име
      fatherName: { type: String, required: true }, // Татково име
      lastName: { type: String, required: true }, // Презиме
      profession: { type: String }, // Професија
      residence: { type: String }, // Место на живеење
      religion: { type: String }, // Вера
      nationality: { type: String }, // Народност
      birthDate: {
        day: { type: Number },
        month: { type: Number },
        year: { type: Number },
      }, // Датум на раѓање
      maritalStatus: { type: String }, // Брачен статус
      previousStatusDate: { type: Date }, // Датум на предпрачен статус
      marriageNumber: { type: Number }, // Во кој брак стапува
    },

    // Податоци за Невеста (Bride)
    bride: {
      firstName: { type: String, required: true },
      fatherName: { type: String, required: true },
      lastName: { type: String, required: true },
      profession: { type: String },
      residence: { type: String },
      religion: { type: String },
      nationality: { type: String },
      birthDate: {
        day: { type: Number },
        month: { type: Number },
        year: { type: Number },
      },
      maritalStatus: { type: String },
      previousStatusDate: { type: Date },
      marriageNumber: { type: Number },
    },

    // Податоци за Венчавање (Marriage)
    marriage: {
      church: { type: String }, // Храм
      place: { type: String }, // Место
      date: {
        day: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
      }, // Датум на венчавање
      priestName: { type: String }, // Свештеник
      bestMan: {
        name: { type: String }, // Кум
        residence: { type: String },
      },
      witness: {
        name: { type: String }, // Стар сват
        residence: { type: String },
      },
    },

    notes: { type: String }, // Забелешка

    pageNumber: { type: Number }, // Страна од оригинална книга

    createdBy: { type: String }, // Корисник
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Индекси за брзо пребарување и autocomplete
marriageSchema.index({ "groom.firstName": 1 });
marriageSchema.index({ "groom.lastName": 1 });
marriageSchema.index({ "groom.fatherName": 1 });
marriageSchema.index({ "bride.firstName": 1 });
marriageSchema.index({ "bride.lastName": 1 });
marriageSchema.index({ "bride.fatherName": 1 });
marriageSchema.index({ "marriage.bestMan.firstName": 1 });
marriageSchema.index({ "marriage.bestMan.lastName": 1 });
marriageSchema.index({ "marriage.witness.firstName": 1 });
marriageSchema.index({ "marriage.witness.lastName": 1 });
marriageSchema.index({ "marriage.priestName": 1 });
marriageSchema.index({
  "marriage.date.year": -1,
  "marriage.date.month": -1,
  "marriage.date.day": -1,
});

export default mongoose.models.Marriage ||
  mongoose.model("Marriage", marriageSchema);
