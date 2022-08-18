import {
    Button,
    Text,
    Box
} from 'native-base';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const GoBackFab = () => {
    const navigate = useNavigate();
    navigate;
    return(

        <Box
            position='fixed'
            right='10px'
            bottom='10px'
            zIndex={'10000'}
        >
            <Button
                variant="solid"
                bg="calendarBlue"
                colorScheme="blue"
                borderRadius="full"
                w='100px'
                onPress={()=> navigate(-1)}
            >
                <Text
                    color='white'
                >
                    {'Go Back'}
                </Text>
            </Button>
        </Box>

    );
};

export {
    GoBackFab,
};
