const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

const mongoose = require('mongoose')
const Booking = require('./booking-model');

const uri = 'mongodb+srv://olivermillard:Uv2pEuf2QjizdIlT@guestroombookings.jyol5ad.mongodb.net/guest-bookings?retryWrites=true&w=majority'
// const port = process.env.PORT || 4000;

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

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
app.use(express.urlencoded({ extended: true })) // { extended: true }
// app.use(morgan('dev'));

app.get('/', (req, res) => {
    Booking.find()
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
        });
})

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
    console.log(req.body);
    const booking = new Booking({
        guestName: req.body.guestName,
        guestEmail: req.body.guestEmail,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    });

    booking.save()
        .then((result) => {
            res.send(result);
            console.log('saved new booking')
        }).catch((error) => {
            console.error((error))
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

app.post('/send-email', function (req, res) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'guestroombooker@gmail.com',
            pass: 'adgwvmatjtachgvg'
        }
    });

    const booking = new Booking({
        guestName: req.body.guestName,
        guestEmail: req.body.guestEmail,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    });

    const formattedSd = `${booking.startDate.getMonth()}/${booking.startDate.getDay()}/${booking.startDate.getYear()}`;
    const formattedEd = `${booking.endDate.getMonth()}/${booking.endDate.getDay()}/${booking.endDate.getYear()}`;
    
    const mailToUserOptions = {
        from: 'guestroombooker@gmail.com',
        to: booking.guestEmail,
        subject: 'Application for guest bedroom',
        text: `Hey ${booking.guestName}!\nThank you for your interest in staying with us from ${formattedSd} to ${formattedEd}! We will get back to you shortly either confirming your dates or asking you to find other dates which will work better.\n\nWe look forward to seeing you soon!\n\nBest wishes,\nOliver and Chris`
    };

    transporter.sendMail(mailToUserOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
});


// app.get("/api", (req, res) => {
//     res.json({ "users": ['user1', 'user2'] })
// })

app.listen(process.env.PORT || 4000, () => console.log(`server started on port ${process.env.PORT || 4000}`));




