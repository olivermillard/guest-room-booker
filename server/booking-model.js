'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    guestName: { 
        type: String, 
        required: true 
    },
    guestEmail: {
        type: String,
        required: true
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true })

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
