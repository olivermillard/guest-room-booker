import { Center, Button, VStack } from 'native-base';
import React from 'react';
import { ContactName } from './ContactFab';
import { useNavigate, useLocation} from 'react-router-dom';
import { GoBackFab } from './GoBackFab';

interface ContactFormState {
    recipient: ContactName;
}

const ContactForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as ContactFormState;

    let recipientName: string = state.recipient; // casting to string to change the value

    if(recipientName === 'Both') {
        recipientName = 'both Oliver and Chris';
    }

    return (
        <Center
            minH='100vh'
            minW='100vw'
        >
            <GoBackFab/>
            <VStack>
                <Button
                    colorScheme={'blue'}
                >
                    {`Send Email to ${recipientName}`}
                </Button>
                <Button
                    onPress={() => navigate(-1)}
                >
                    {'Go Back'}
                </Button>
            </VStack>
        </Center>
    );
};


export {
    ContactForm
};
