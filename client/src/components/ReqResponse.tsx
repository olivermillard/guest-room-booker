/* ******************************************************************************
 * ReqResponse.tsx                                                              *
 * ******************************************************************************
 *
 * The component which shows the response from an attempted booking.
 *
 * Created on      August 18, 2022
 * @author         Oliver Millard
 *
 * ******************************************************************************/

import {
    Button,
    Center,
    Text,
    VStack,
} from 'native-base';
import React from 'react';
import { useNavigate, useLocation} from 'react-router-dom';

interface ReqState {
    succReq: boolean;
}

const ReqResponse = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as ReqState;

    const img = state.succReq ? (
        <img
            src={require('../assets/greenCheck.png')}
            width='25%'
        />
    ) : (
        <img
            src={require('../assets/redX.png')}
            width='25%'
        />
    );

    const succHeaderText = 'Thank you for your booking request!';
    const failHeaderText = 'Oh no! Something went wrong.';
    const headerText = state.succReq ?  succHeaderText: failHeaderText;

    const succBodyText = 'We will review your request and get back to you as soon as possible.';
    const failBodyText = 'Please go back and try again.';
    const bodyText = state.succReq ?  succBodyText : failBodyText;

    const backButton = (
        <Button
            onPress={() => navigate('/')}
            colorScheme='blue'
            borderRadius={20}
            marginTop={10}
        >
            {state.succReq ? 'Book More Dates' : 'Try Again'}
        </Button>
    );

    return (
        <Center
            minH='100vh'
            w='95vw'
        >
            <Center
                h='50%'
            >
                <VStack
                    justifyContent={'center'}
                    alignItems='center'
                    w='100%'
                    space={3}
                    p='10px'
                >
                    {img}
                    <Text
                        fontSize='24px'
                        fontWeight={'bold'}
                    >
                        {headerText}
                    </Text>
                    <Text
                        fontSize='16px'
                    >
                        {bodyText}
                    </Text>
                    {backButton}
                </VStack>
            </Center>
        </Center>
    );
};

export {
    ReqResponse,
};
