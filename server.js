const express = require('express');
const app = express();

const cors = require("cors");
const corsOptions = {
    origin: '*', // change if want to make private
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}
app.use(cors(corsOptions));

const nodemailer = require('nodemailer');

const dateFormatter = require('date-and-time');

const mongoose = require('mongoose')
const Booking = require('./booking-model');
const ContactReq = require('./contactReq-model');

const uri = 'mongodb+srv://olivermillard:Uv2pEuf2QjizdIlT@guestroombookings.jyol5ad.mongodb.net/guest-bookings?retryWrites=true&w=majority'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'guestroombooker@gmail.com',
        pass: 'adgwvmatjtachgvg'
    }
});

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

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// app.get('/', (req, res) => {
//     Booking.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// })

app.get('/bookings', (req, res) => {
    Booking.find()
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
})

app.post('/bookings', (req, res) => {
    const booking = new Booking({
        guestName: req.body.guestName,
        guestEmail: req.body.guestEmail,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    });
    // save the booking
    booking.save()
        .then((result) => {
            res.send(result);
            console.log('saved new booking')
        }).catch((error) => {
            console.error((error))
        })

    const pattern = dateFormatter.compile('ddd, MMM D YYYY');

    const sdCorrectTz = new Date(booking.startDate.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    const edCorrectTz = new Date(booking.endDate.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    const formattedSd = dateFormatter.format(sdCorrectTz, pattern); 
    const formattedEd = dateFormatter.format(edCorrectTz, pattern);

    const mailToUserOptions = {
        from: 'guestroombooker@gmail.com',
        to: booking.guestEmail,
        subject: 'Application for guest bedroom',
        text: `Hey ${booking.guestName}!\n\nThank you for your interest in staying with us from ${formattedSd} to ${formattedEd}! We will get back to you shortly either confirming your dates or asking you to find other dates which will work better.\n\nWe look forward to seeing you soon!\n\nBest wishes,\nOliver and Chris`
    };

    transporter.sendMail(mailToUserOptions, function (error, info) {
        if (error) {
            console.error('(OBM) ERROR SENDING MAIL' + error);
        } else {
            console.log('(OBM) EMAIL SENT: ' + info.response);
        }
    })

    const mailToAdminOptions = {
        from: 'guestroombooker@gmail.com',
        to: 'olivermillard@gmail.com',
        subject: 'New request for guest bedroom',
        html: `Hey Oliver!\n\n${booking.guestName} has requested to stay with you from ${formattedSd} to ${formattedEd}! 
        <a href=https://guest-room-booker.herokuapp.com/confirm/${booking._id}>Confirm</a>\n
        <a href=https://guest-room-booker.herokuapp.com/deny/${booking._id}/>Deny</a>
        \n\n${booking.guestName}'s fate is in your hands!`
    };

    transporter.sendMail(mailToAdminOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('(OBM) EMAIL SENT: ' + info.response);
        }
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

// confirm a new booking (send out email)
app.get('/confirm/:booking_id/', (req, res) => {
    const { bookingId } = req.params.booking_id;
    Booking.find( {bookingId: bookingId})
        .then(booking => {
            console.log('OBM booking:', booking);
            const mailToUserOptions = {
                from: 'guestroombooker@gmail.com',
                to: booking.guestEmail,
                subject: 'Confirming Your Stay with Oliver and Chris',
                text: `Hey ${booking.guestName}!\n\nGreat news!!! You are booked to stay with us from ${formattedSd} to ${formattedEd}! We look forward to seeing you!\n\nBest wishes,\nOliver and Chris`
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

// deny a new booking (send out email and delete from server)
app.delete('/deny/:booking_id/', (req, res) => {
    const { bookingId } = req.params.booking_id;
    Booking.findByIdAndDelete({ bookingId: bookingId })
        .then(booking => {
            console.log('OBM booking:', booking);
            const mailToUserOptions = {
                from: 'guestroombooker@gmail.com',
                to: booking.guestEmail,
                subject: 'Regarding Your Stay with Oliver and Chris',
                html: `Hey ${booking.guestName}!\n\nSorry to bring you bad news, but unfortunately Oliver and Chris are not free for your visit on ${formattedSd} to ${formattedEd}. Please make a request for other dates here: <a> </a>\n\nBest wishes,\nOliver and Chris`
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

app.listen(process.env.PORT || 4000, () => console.log(`server started on port ${process.env.PORT || 4000}`));




