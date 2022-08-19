const express = require('express');
const cors = require("cors");

const nodemailer = require('nodemailer');
const dateFormatter = require('date-and-time');

const mongoose = require('mongoose')
const Booking = require('./booking-model');
const BookingReq = require('./bookingReq-model');
const ContactReq = require('./contactReq-model');

const app = express();

const corsOptions = {
    origin: '*', // change if want to make private
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions));
app.set('view engine', 'ejs');

const uri = 'mongodb+srv://olivermillard:Uv2pEuf2QjizdIlT@guestroombookings.jyol5ad.mongodb.net/guest-bookings?retryWrites=true&w=majority'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'guestroombooker@gmail.com',
        pass: 'adgwvmatjtachgvg'
    }
});

const OLIVER_EMAIL = 'olivermillard@gmail.com';
const CHRIS_EMAIL = 'chris961125@gmail.com';

async function connect() {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        )
    } catch (error) {
        console.error(error)
    }
}
connect();

// app.get('/', (req, res) => {
//     Booking.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// })

const datePattern = dateFormatter.compile('ddd, MMM D YYYY');
// convert dates to correct format
const formatDate = (date) => {
    const tz = 'Europe/London';
    const correctTz = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    const formattedDate = dateFormatter.format(correctTz, datePattern);
    
    return formattedDate;
}
// get the dates string depending on whether or not the guest has selected a single day or multiple days
const getDatesString = (sd, ed) => {
    const sdF = formatDate(sd);
    const edF = formatDate(ed);
    const datesString = sdF === edF ? `on ${sdF}` : `from ${sdF} to ${edF}`;
    
    return datesString;
}
// get the actual bookings
app.get('/bookings', (req, res) => {
    Booking.find()
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
})

// get the booking requests
app.get('/bookingsReq', (req, res) => {
    BookingReq.find()
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
})

// save a new booking request 
app.post('/bookingsReq', (req, res) => {
    const bookingReq = new BookingReq({
        guestName: req.body.guestName,
        guestEmail: req.body.guestEmail,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    });
    // save the booking request
    bookingReq.save()
        .then((result) => {
            res.send(result);
            console.log('saved new booking')
        }).catch((error) => {
            console.error((error))
        })

    const datesString = getDatesString(bookingReq.startDate, bookingReq.endDate);

    const mailToAdminOptions = {
        from: 'guestroombooker@gmail.com',
        to: [OLIVER_EMAIL, CHRIS_EMAIL],
        subject: 'New request for your guest bedroom',
        html: `Hey Oliver and Chris!\n\n${bookingReq.guestName} has requested to stay with you ${datesString}! 
        <a href=https://guest-room-booker.herokuapp.com/booking-request/${bookingReq._id}>Resond to Request</a>
        \n\n${bookingReq.guestName}'s fate is in your hands!`
    };

    const mailToUserOptionsSucc = {
        from: 'guestroombooker@gmail.com',
        to: bookingReq.guestEmail,
        subject: 'Application for guest bedroom',
        text: `Hey ${bookingReq.guestName}!\n\nThank you for your interest in staying with us ${datesString}! We have received your request and will get back to you shortly either confirming your dates or asking you to find other dates which will work better.\n\nWe look forward to seeing you soon!\n\nBest wishes,\nOliver and Chris`
    };

    const mailToUserOptionsFail = {
        from: 'guestroombooker@gmail.com',
        to: bookingReq.guestEmail,
        subject: 'Issue with your booking',
        text: `Hey ${bookingReq.guestName}!\n\nThere was an issue with your booking to stay with us. Please try again!\n\nBest wishes,\nOliver and Chris`
    };

    transporter.sendMail(mailToAdminOptions, function (error, info) {
        if (error) {
            transporter.sendMail(mailToUserOptionsFail, function (error, info) {
                if (error) {
                    console.error(error);
                } else {
                    console.log('SENT FAIL REQ EMAIL TO GUEST ' + info.response);
                }
            })
        } else {
            transporter.sendMail(mailToUserOptionsSucc, function (error, info) {
                if (error) {
                    console.error(error);
                } else {
                    console.log('SENT SUCC REQ EMAIL TO GUEST ' + info.response);
                }
            }) 
        }
    })
})

// go to booking request view
app.get('/booking-request/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;
    BookingReq.findById(bookingId)
        .then(booking => {
            res.render('handleBookingRequest', { 
                booking: booking,
                title: 'hi',
            })
        })
})

// confirm a new booking (send out email)
app.post('/booking-request/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;
    BookingReq.findById(bookingId)
        .then(booking => {
            const datesString = getDatesString(booking.startDate, booking.endDate);
            const mailToUserOptions = {
                from: 'guestroombooker@gmail.com',
                to: booking.guestEmail,
                subject: 'Confirming Your Stay with Oliver and Chris',
                text: `Hey ${booking.guestName}!\n\nGreat news!!! You are booked to stay with us ${datesString}! We look forward to seeing you!\n\nBest wishes,\nOliver and Chris`
            };

            const bookingToSave = new Booking({
                guestName: booking.guestName,
                guestEmail: booking.guestEmail,
                startDate: booking.startDate,
                endDate: booking.endDate,
            });

            bookingToSave.save()
                .then((result) => {
                    res.send(result);
                    console.log('saved new booking')
                }).catch((error) => {
                    console.error((error))
                })

            transporter.sendMail(mailToUserOptions, function (error, info) {
                if (error) {
                    console.error('ERROR SENDING CONFIRMATION' + error);
                } else {
                    console.log('(OBM) EMAIL SENT: ' + info.response);
                }
            })
        })
        .catch(error => {
            console.log(error);
        })
})

// deny a new booking (send out email and delete from server)
app.delete('/booking-request/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;
    console.log('BOOKING ID AT DELETE');
    BookingReq.findByIdAndDelete(bookingId)
        .then(booking => {
            const datesString = getDatesString(booking.startDate, booking.endDate);
            const mailToUserOptions = {
                from: 'guestroombooker@gmail.com',
                to: booking.guestEmail,
                subject: 'Regarding Your Stay with Oliver and Chris',
                html: `Hey ${booking.guestName}!\n\nSorry to bring you bad news, but unfortunately the dates you requested for your visit ${datesString} don't work for us. Please make a request for other dates here: <a>google.com </a>\n\nBest wishes,\nOliver and Chris`
            };

            transporter.sendMail(mailToUserOptions, function (error, info) {
                if (error) {
                    console.error('(OBM) ERROR SENDING MAIL' + error);
                } else {
                    console.log('(OBM) EMAIL SENT: ' + info.response);
                }
            })
        })
        .catch(error => {
            console.log(error);
        })
})

app.get('/find-booking', (req, res) => {
    Booking.findById(res.body.booking)
        .then((result) => {
            res.send(result);
            console.log('Found the booking')
        })
        .catch((error) => {
            console.error(error)
        })
})

// contact us 
app.post('/contact-us', (req, res) => {
    console.log('OLIVER contact us tests', {req, body: req.body, res});
    const contactReq = new ContactReq({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message, 
        recipientName: req.body.recipientName,
        recipientEmails: req.body.recipientEmails,
    });

    // save the contact request
    contactReq.save()
        .then((result) => {
            res.send(result);
            console.log('new contact request saved')
        }).catch((error) => {
            console.error((error))
        })
    
    const mailOptions = {
        from: 'guestroombooker@gmail.com',
        to: contactReq.recipientEmails,
        subject: `Message from ${contactReq.name}`,
        text: `Hey ${contactReq.recipientName}!\n\n${contactReq.name} has sent you this message:\n\n${contactReq.message}\n\nYou can email them back at: ${contactReq.email}\n\nBest wishes,\nThe Guest Room Server`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('(OBM) ERROR SENDING MAIL' + error);
        } else {
            console.log('(OBM) EMAIL SENT: ' + info.response);
        }
    })
})




// app.post('/send-email', function (req, res) {
//     const booking = new Booking({
//         guestName: req.body.guestName,
//         guestEmail: req.body.guestEmail,
//         startDate: req.body.startDate,
//         endDate: req.body.endDate,
//     });
    
//     const mailToUserOptions = {
//         from: 'guestroombooker@gmail.com',
//         to: booking.guestEmail,
//         subject: 'Application for guest bedroom',
//         text: `Hey ${booking.guestName}!\n\nThank you for your interest in staying with us from X-Y! We will get back to you shortly either confirming your dates or asking you to find other dates which will work better.\n\nWe look forward to seeing you soon!\n\nBest wishes,\nOliver and Chris`
//     };

//     transporter.sendMail(mailToUserOptions, function (error, info) {
//         if (error) {
//             console.log('(OBM) ERROR SENDING MAIL' + error);
//         } else {
//             console.log('(OBM) EMAIL SENT: ' + info.response);
//         }
//     })
// });


// app.get("/api", (req, res) => {
//     res.json({ "users": ['user1', 'user2'] })
// })



// 404 view
app.use((req, res) => {
    res.status(404).render('404');
})

app.listen(process.env.PORT || 4000, () => console.log(`server started on port ${process.env.PORT || 4000}`));




