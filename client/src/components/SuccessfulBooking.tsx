import {
    Center,
    Text
} from 'native-base';
import React from 'react';

const SuccessfulBooking = () => {

    return (
        <Center
            h={'100%'}
            w={'100%'}
        >
            <Text>
                {'Thank you for your booking!'}
            </Text>
            <Text>
                {'We look forward to seeing you soon.'}
            </Text>
            <img
                src={require('../assets/greenCheck.png')}
                width='50%'
            />
        </Center>
    );
};

export{
    SuccessfulBooking,
};
