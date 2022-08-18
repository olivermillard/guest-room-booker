'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactReqSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientEmails: {
        type: [String],
        required: true
    },
}, { timestamps: true })

const ContactReq = mongoose.model('ContactReq', contactReqSchema);

module.exports = ContactReq;
