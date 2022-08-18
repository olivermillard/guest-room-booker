/* ******************************************************************************
 * DatePicker.tsx                                                               *
 * ******************************************************************************
 *
 * The date picker component for finding calendar dates.
 *
 * Created on      August 12, 2022
 * @author         Oliver Millard
 *
 * ******************************************************************************/

import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Center,
    FormControl,
    Heading,
    HStack,
    Input,
    // Text,
    Spinner,
    WarningOutlineIcon,
} from 'native-base';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { useNavigate } from 'react-router-dom';
import { ContactFab } from './ContactFab';

const londonTimezone = 'Europe/London';
let attemptedBooking = false;

const DatePicker = () => {
    const navigate = useNavigate();

    const currDateString = new Date().toLocaleString('en-US', {timeZone: 'UTC'});
    const currDate = new Date(Date.parse(currDateString));
    const oneWeekAway = convertTimezone(
        new Date(
            currDate.getFullYear(),
            currDate.getMonth(),
            currDate.getDate()+6, // to make it 6 days in advance
            currDate.getHours(),
            currDate.getMinutes(),
            currDate.getSeconds() + 1, // to make it not 00:00:00
        ), londonTimezone
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ backendData, setBackendData ] = useState<any>([{}]);
    const [ dataLoaded, setDataLoaded ] = useState(false);

    const [ guestName, setGuestName ] = useState('');
    const [ emailAddress, setEmailAddress ] = useState('');
    const [ showNameError, setShowNameError ] = useState(false);
    const [ showDatesError, setShowDatesError ] = useState(false);
    const [ showEmailError, setShowEmailError ] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ dateRanges, setDateRange ] = useState<any>([
        {
            startDate: currDate,
            endDate: oneWeekAway,
            key: 'selection',
        }
    ]);

    useEffect(() => {
        fetch('./bookings').then(
            response => response.json()
        ).then(
            data => {
                setBackendData(data);
                setDataLoaded(true);
            }
        );
    }, []);

    const handleDateChange = (item: RangeKeyDict) => {
        const startDate = item.selection.startDate;
        const endDate = item.selection.endDate;

        if( startDate) { item.selection.startDate = convertTimezone(startDate, londonTimezone);}
        if(endDate) { item.selection.endDate = convertTimezone(endDate, londonTimezone); }

        if(attemptedBooking) {
            setShowDatesError(!checkDatesAreValid());
        }

        setDateRange([ item.selection ]);
    };

    const handleNameChange = (entry: string) => {
        const guestName = entry.trim();
        setGuestName(guestName);

        // if there is no guest name and the error isn't showing, show the error
        if(!guestName && !showNameError){
            setShowNameError(true);
        }
        // if there is a guest name and the error is showing, hide the error
        else if(guestName && showNameError){
            setShowNameError(false);
        }
    };

    const handleEmailChange = (entry: string) => {
        const emailAddress = entry.trim();
        setEmailAddress(emailAddress);

        // if there is no guest name and the error isn't showing, show the error
        if(!emailAddress && !showEmailError){
            setShowEmailError(true);
        }
        // if there is a guest name and the error is showing, hide the error
        else if(emailAddress && showEmailError){
            setShowEmailError(false);
        }
    };

    const handleSubmit = () => {
        attemptedBooking = true;
        const areDatesValid = checkDatesAreValid();

        // check if there is an invalid entry
        if(!areDatesValid || !guestName || !emailAddress) {
            // check if dates are invalid
            if(!areDatesValid) {
                setShowDatesError(true);
            }
            else {
                setShowDatesError(false);
            }
            // check if guest name is invalid
            if(!guestName) {
                setShowNameError(true);
            }
            else{
                setShowNameError(false);
            }
            // check if email is invalid
            if(!emailAddress) {
                setShowEmailError(true);
            }
            else {
                setShowEmailError(false);
            }

            return;
        }

        const postData = {
            guestName: guestName,
            guestEmail: emailAddress,
            startDate: dateRanges[0].startDate,
            endDate: dateRanges[0].endDate,
        };

        fetch('./send-email', { // ./bookings
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log('response:', response.json());
            attemptedBooking = false;
            navigate('/reqResponse', { state: {succReq: true }});
        }).catch(error => {
            console.error(error);
            navigate('/reqResponse', { state: {succReq: false }});
        });
    };

    let disabledDates: Date[] = [];

    const getDisabledDates = (): Date[] => {
        if(!backendData){
            console.error('DatePicker: Attempted to use backend data before it was loaded');
        }

        for(let i = 0; i < backendData.length; i++){
            const entryDate = new Date(backendData[i].startDate);
            const endDate = new Date(backendData[i].endDate);
            disabledDates = disabledDates.concat(getDateRange(entryDate, endDate));
        }

        return disabledDates;
    };

    const checkDatesAreValid = (): boolean => {
        const entryDate = new Date (dateRanges[0].startDate);
        const endDate = new Date (dateRanges[0].endDate);

        const selectedDatesRange = getDateRange(entryDate, endDate);
        const selectedDatesRangeStrings = selectedDatesRange.map(entry => entry.toDateString());
        const disabledDatesStrings = disabledDates.map(entry => entry.toDateString());

        const intersection = disabledDatesStrings.find(element => selectedDatesRangeStrings.includes(element));

        return intersection === undefined ? true : false;
    };

    return (
        <Center
            minH='100vh'
            minW='100vw'
        >
            <ContactFab/>
            {dataLoaded ? (
                <>
                    <Heading
                        fontWeight='700'
                        color={'#606060'}
                        mb='10px'
                    >
                        {'Request Dates to Visit'}
                    </Heading>
                    <Box
                        borderRadius={20}
                        // overflow='hidden'
                        h='100%'
                        bg={dataLoaded ? '#eceff6' : 'white'}
                    >
                        <Box
                            height={'100%'}
                        >
                            <Center
                                alignItems="center"
                                px='20px'
                                h='200px'
                            >
                                {/* NAME */}
                                <Box
                                    h='90px'
                                    w='100%'
                                >
                                    <FormControl isInvalid={showNameError} isRequired>
                                        <FormControl.Label>
                                            {'Name'}
                                        </FormControl.Label>
                                        <Input
                                            placeholder="Enter your name"
                                            onChangeText={text => handleNameChange(text)}
                                            borderColor={'#a8a8a8'}
                                            _light={{
                                                _pressed: { bg: 'primary.base' },
                                                _hover: { bg: 'primary.buttonHover' },
                                                _text: {
                                                    color: 'white',
                                                },
                                            }}
                                        />
                                        <FormControl.ErrorMessage
                                            leftIcon={<WarningOutlineIcon size="xs" />}
                                        >
                                            {'Please enter your name'}
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                </Box>
                                {/* EMAIL */}
                                <Box
                                    h='90px'
                                    w='100%'
                                >
                                    <FormControl isInvalid={showEmailError} isRequired>
                                        <FormControl.Label>
                                            {'Email'}
                                        </FormControl.Label>
                                        <Input
                                            placeholder="Enter your email address"
                                            onChangeText={text => handleEmailChange(text)}
                                            borderColor={'#a8a8a8'}
                                            type='email'
                                            _light={{
                                                _pressed: { bg: 'primary.base' },
                                                _hover: { bg: 'primary.buttonHover' },
                                                _text: {
                                                    color: 'white',
                                                },
                                            }}
                                        />
                                        <FormControl.ErrorMessage
                                            leftIcon={<WarningOutlineIcon size="xs" />}
                                        >
                                            {'Please enter your email address'}
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                </Box>
                            </Center>
                            {/* DATE RANGE PICKER */}
                            <Box
                                px='20px'
                                borderRadius={10}
                                h='475px' // computed height of date range and error message
                            >
                                <FormControl isInvalid={showDatesError} isRequired>
                                    <FormControl.Label>
                                        {'Dates'}
                                    </FormControl.Label>
                                    <DateRange
                                        // editableDateInputs={true}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        onChange={(item: any) => handleDateChange(item)}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dateRanges}
                                        minDate={currDate}
                                        disabledDates={getDisabledDates()}
                                        scroll={{enabled: true}}
                                    />
                                    <FormControl.ErrorMessage
                                        leftIcon={<WarningOutlineIcon size="xs" />}
                                    >
                                        {'Please enter dates which are free'}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </Box>
                            <Button
                                onPress={()=>handleSubmit()}
                                borderBottomLeftRadius={20}
                                borderBottomRightRadius={20}
                                bg='calendarBlue'
                                colorScheme="blue"
                            >
                                {'Book Your Dates'}
                            </Button>
                        </Box>
                    </Box>
                </>
            ) : (
                <HStack>
                    <Spinner accessibilityLabel="Loading previous entries" />
                    <Heading color="primary.500" fontSize="md" pl='10px'>
                        {'Loading'}
                    </Heading>
                </HStack>
            ) }
        </Center>
    );
};

const convertTimezone = (date: Date | string, tzString: string): Date => {
    return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {timeZone: tzString}));
};

const getDateRange = (sd: Date, ed: Date): Date[] => {
    const dates: Date[] = [];
    const entryDate = convertTimezone(new Date (sd), londonTimezone);
    const endDate = convertTimezone(new  Date(ed), londonTimezone);

    while (entryDate <= endDate) {
        dates.push(new Date(entryDate));
        entryDate.setDate(entryDate.getDate() + 1);
    }

    return dates;
};

export {
    DatePicker,
};
