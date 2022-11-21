import {
    Box,
    HStack,
    Stagger,
    useDisclose,
    Button,
    VStack
} from 'native-base';
import React, { useState } from 'react';
import { ContactModal } from './ContactModal';

type ContactName = 'Oliver' | 'Chris' | 'Both';

const ContactFab = () => {
    const [ showModal, setShowModal ] = useState(false);
    const [ recipient, setRecipient ] = useState<ContactName>('Oliver');

    const { isOpen, onToggle } = useDisclose();
    const baseButtonText = isOpen ? 'Nevermind' : 'Contact Us';

    const fabButton = (name: ContactName) => {
        return (
            <Button
                mb="4"
                variant="solid"
                bg="calendarBlue"
                colorScheme="blue"
                borderRadius="full"
                w='100px'
                onPress={()=> {
                    setRecipient(name);
                    setShowModal(true);
                }}
            >
                {name}
            </Button>
        );
    };

    return(
        <>
            <ContactModal
                recipient={recipient}
                showModal={showModal}
                setShowModal={setShowModal}
            />
            <Box
                position='fixed'
                right='10px'
                bottom='10px'
                zIndex={'10000'}
            >
                <VStack
                    alignItems={'flex-end'}
                >
                    <Box
                        alignItems="center"
                        w='100%'
                    >
                        <Stagger
                            visible={isOpen}
                            initial={{
                                opacity: 0,
                                scale: 0,
                                translateY: 34
                            }}
                            animate={{
                                translateY: 0,
                                scale: 1,
                                opacity: 1,
                                transition: {
                                    type: 'spring',
                                    mass: 0.8,
                                    stagger: {
                                        offset: 30,
                                        reverse: true
                                    }
                                }
                            }}
                            exit={{
                                translateY: 34,
                                scale: 0.5,
                                opacity: 0,
                                transition: {
                                    duration: 100,
                                    stagger: {
                                        offset: 30,
                                        reverse: true
                                    }
                                }
                            }}>
                            {fabButton('Oliver')}
                            {fabButton('Chris')}
                            {fabButton('Both')}
                        </Stagger>
                    </Box>
                    <HStack
                        alignItems="center"
                    >
                        <Button
                            variant="solid"
                            borderRadius="full"
                            size="md"
                            onPress={onToggle}
                            _light={{
                                bg: 'calendarBlue',
                                shadow: 1,
                                _pressed: { bg: 'calendarBlue' },
                            }}
                            w='100px'
                            colorScheme="blue"
                        >
                            {baseButtonText}
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </>
    );
};

export {
    ContactFab,
    ContactName
};
