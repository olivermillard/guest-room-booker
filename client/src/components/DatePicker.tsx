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
    HStack,
    Input,
    Text,
    Spinner,
    WarningOutlineIcon,
    VStack,
} from 'native-base';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { useNavigate } from 'react-router-dom';
import { ContactFab } from './ContactFab';
import { emailIsValid, handleTextChange } from '../utils/text';
import { BACKEND_URL } from '../config';

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
    const [ isSubmitting, setIsSubmitting ] = useState(false);

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
        fetch(`${BACKEND_URL}/bookings`).then(
            response => response.json()
        )
            .then(
                data => {
                    setBackendData(data);
                    setDataLoaded(true);
                }
            )
            .catch((error) => {
                console.error(error);
                console.info('error');
            });
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

    const handleSubmit = () => {
        attemptedBooking = true;
        const areDatesValid = checkDatesAreValid();
        const emailCheck = emailIsValid(emailAddress);
        // check if there is an invalid entry
        if(!areDatesValid || !guestName || emailCheck) {
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
                setShowEmailError(emailCheck);
            }

            return;
        }

        const postData = {
            guestName: guestName,
            guestEmail: emailAddress,
            startDate: dateRanges[0].startDate,
            endDate: dateRanges[0].endDate,
        };

        setIsSubmitting(true);
        fetch(`${BACKEND_URL}/bookingsReq`, { // ./bookings
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log('RESPONSE: ', response.json());
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
            {isSubmitting ? <></> : <ContactFab/>}
            {dataLoaded ? isSubmitting ?  (
                <VStack
                    h='300px'
                    w='300px'
                    shadow={5}
                    borderRadius={10}
                    justifyContent='center'
                    alignItems='center'
                    space={1}
                >
                    <Text fontSize='24px'>
                        {'Hang Tight!'}
                    </Text>
                    <Text fontSize='16px'>
                        {'We are processing your request'}
                    </Text>
                    <Spinner
                        size={'lg'}
                        color='calendarBlue'
                        mt='20px'
                    />
                </VStack>
            ) : (

                <Box
                    bg='calendarBlue'
                    borderRadius={20}
                >
                    <VStack
                        py='10px'
                        alignItems={'center'}
                        mb='10px'
                    >
                        <Text
                            fontWeight='500'
                            color={'white'}
                            fontSize={'24px'}
                            // mb='10px'
                        >
                            {'Request Dates to Visit'}
                        </Text>
                        <Text
                            fontWeight='500'
                            color={'white'}
                            fontSize={'24px'}
                        >
                            {'Oliver and Chris'}
                        </Text>
                    </VStack>
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
                                            onChangeText={text => {
                                                handleTextChange(
                                                    text,
                                                    setGuestName,
                                                    showNameError,
                                                    setShowNameError,
                                                );
                                            }}
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
                                            onChangeText={text => {
                                                handleTextChange(
                                                    text,
                                                    setEmailAddress,
                                                    showEmailError,
                                                    setShowEmailError,
                                                );
                                            }}
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
                                            {'Please enter a valid email address'}
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
                                borderBottomLeftRadius={16}
                                borderBottomRightRadius={16}
                                bg='calendarBlue'
                                colorScheme="blue"
                                disabled={isSubmitting} // don't allow resubmits
                            >
                                {'Book Your Dates'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <HStack>
                    <Spinner
                        accessibilityLabel="Loading previous entries"
                        color='calendarBlue'
                    />
                    <Text
                        fontSize={'24px'}
                        color='calendarBlue'
                        pl='10px'
                    >
                        {'Loading'}
                    </Text>
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
