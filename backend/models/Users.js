const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Solo per il login locale
    role: { type: String, enum: ['Editor', 'Admin'], default: 'Editor' },
    googleId: { type: String, unique: true }, // Per il login con Google
}, { timestamps: true });

// Middleware per hashare la password prima di salvare
userSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
