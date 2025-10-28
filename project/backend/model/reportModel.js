import { Schema, model } from 'mongoose';

const reportSchema = new Schema(
  {
    // Utente che invia la segnalazione
    segnalante: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Utente segnalato
    segnalato: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Motivo selezionato dal menu a tendina
    motivo: {
      type: String,
      required: true,
      enum: [
        'contenuto-inappropriato',
        'linguaggio-offensivo',
        'profilo-falso',
        'altro',
      ],
    },

    // Descrizione testuale fornita dall’utente
    dettagli: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },

    // Stato della segnalazione, utile lato admin
    stato: {
      type: String,
      enum: ['in_attesa', 'in_esame', 'risolta', 'rifiutata'],
      default: 'in_attesa',
    },

    // Opzionale: risposta o nota dell’amministratore
    rispostaAdmin: {
      type: String,
      maxlength: 500,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // Aggiunge createdAt e updatedAt
  }
);

// Validazione logica opzionale
reportSchema.pre('save', function (next) {
  if (!this.segnalante.equals(this.segnalato)) {
    next();
  } else {
    next(new Error('Un utente non può segnalare sé stesso.'));
  }
});

export default model('Report', reportSchema);
