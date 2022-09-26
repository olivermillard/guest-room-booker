'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingReqSchema = new Schema({
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
    },
    response: {
        type: Boolean
    }
}, { timestamps: true })

const BookingReq = mongoose.model('BookingReq', bookingReqSchema);

module.exports = BookingReq;
