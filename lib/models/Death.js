import mongoose from "mongoose";

const deathSchema = new mongoose.Schema(
  {
    // Податоци за Умрениот/Умрената
    deceased: {
      firstName: { type: String, required: true }, // Име
      fatherName: { type: String }, // Татково име
      lastName: { type: String, required: true }, // Презиме
      profession: { type: String }, // Професија
      maritalStatus: { type: String }, // Брачен статус
      religion: { type: String }, // Вера
      gender: { type: String }, // Пол
      birthPlace: { type: String }, // Место на раѓање
      birthDate: {
        day: { type: Number },
        month: { type: Number },
        year: { type: Number },
      }, // Дата на раѓање
    },

    // Податоци за умирањето
    death: {
      place: { type: String }, // Место каде умрел
      date: {
        day: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
      }, // Ден месец и година на умирањето
      causeOfDeath: { type: String }, // Од каква болест или начин на умирање
    },

    // Податоци за погребот
    burial: {
      date: {
        day: { type: Number },
        month: { type: Number },
        year: { type: Number },
      }, // Ден месец и година на погребот
      place: { type: String }, // Место на погребот
      priestName: { type: String }, // Свештеник име и презиме
      confessed: { type: Boolean }, // Дали се исповедал да или не
    },

    notes: { type: String }, // Забелешка
    pageNumber: { type: Number }, // Страна од оригинална книга
    createdBy: { type: String }, // Корисник
  },
  {
    timestamps: true,
  }
);

// Индекси за брзо пребарување и autocomplete
deathSchema.index({ "deceased.firstName": 1 });
deathSchema.index({ "deceased.lastName": 1 });
deathSchema.index({ "deceased.fatherName": 1 });
deathSchema.index({ "burial.priestName": 1 });
deathSchema.index({
  "death.date.year": -1,
  "death.date.month": -1,
  "death.date.day": -1,
});

export default mongoose.models.Death || mongoose.model("Death", deathSchema);
