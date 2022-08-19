import React from 'react';
import { Button, Modal, FormControl, Input, Center, TextArea, WarningOutlineIcon } from 'native-base';
import { useState } from 'react';
import { ContactName } from './ContactFab';
import { handleTextChange, emailIsValid } from '../utils/text';
import { BACKEND_URL, CHRIS_EMAIL, OLIVER_EMAIL } from '../config';

interface ContactModalProps {
    recipient: ContactName;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;

}

const ContactModal = (props: ContactModalProps) => {
    const [ name, setName ] = useState('');
    const [ showNameError, setShowNameError ] = useState(false);

    const [ email, setEmail ] = useState('');
    const [ showEmailError, setShowEmailError ] = useState(false);

    const [ message, setMessage ] = useState('');
    const [ showMessageError, setShowMessageError ] = useState(false);

    let recipientName: string = props.recipient; // casting to string to change the value

    if(recipientName === 'Both') {
        recipientName = 'Oliver & Chris';
    }

    const handleSubmit = () => {
        // check if there is an invalid entry
        const emailCheck = emailIsValid(email);
        if(!name || !emailCheck || !message) {
            // check if name is invalid
            if(!name) {
                setShowNameError(true);
            }
            else {
                setShowNameError(false);
            }
            // check if email is invalid
            if(!email) {
                setShowEmailError(true);
            }
            // check if it is a valid email or not, not just if something is entered
            else{
                setShowEmailError(emailCheck);
            }
            // check if message is invalid
            if(!message) {
                setShowMessageError(true);
            }
            else {
                setShowMessageError(false);
            }



            let recipientEmails = [];
            if (props.recipient === 'Oliver') {
                recipientEmails = [ OLIVER_EMAIL ];
            }
            else if (props.recipient === 'Chris') {
                recipientEmails = [ CHRIS_EMAIL ];
            }
            else {
                recipientEmails = [ OLIVER_EMAIL, CHRIS_EMAIL ];
            }

            const postData = {
                name: name,
                email: email,
                message: message,
                recipientName: recipientName,
                recipientEmails: recipientEmails,
            };
            console.log('INFO', postData);
            fetch(`${BACKEND_URL}/contact-us`, { // ./bookings
                method: 'POST',
                body: JSON.stringify(postData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log('(OBM) response:', response.json());
            }).catch(error => {
                console.error(error);
            });
        }
    };

    return (
        <Center>
            <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
                <Modal.Content
                    maxWidth="390px"
                >
                    <Modal.CloseButton />
                    <Modal.Header>
                        {`Contact ${recipientName}`}
                    </Modal.Header>
                    <Modal.Body>
                        {/* NAME */}
                        <FormControl isRequired isInvalid={showNameError}>
                            <FormControl.Label>
                                {'Name'}
                            </FormControl.Label>
                            <Input
                                onChangeText={text => {
                                    handleTextChange(
                                        text,
                                        setName,
                                        showNameError,
                                        setShowNameError,
                                    );
                                }}
                            />
                            <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                                {'Please enter your name'}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        {/* EMAIL */}
                        <FormControl mt="3" isRequired isInvalid={showEmailError}>
                            <FormControl.Label>
                                {'Email'}
                            </FormControl.Label>
                            <Input
                                onChangeText={text => {
                                    handleTextChange(
                                        text,
                                        setEmail,
                                        showEmailError,
                                        setShowEmailError,
                                    );
                                }}
                            />
                            <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                                {'Please enter a valid email address'}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        {/* MESSAGE */}
                        <FormControl mt="3" isRequired isInvalid={showMessageError}>
                            <FormControl.Label>
                                {'Message'}
                            </FormControl.Label>
                            <TextArea
                                h={20}
                                placeholder="Write your message here"
                                w="100%"
                                onChangeText={text => {
                                    handleTextChange(
                                        text,
                                        setMessage,
                                        showMessageError,
                                        setShowMessageError,
                                    );
                                }}
                            />
                            <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                                {'Please enter a message to send to us'}
                            </FormControl.ErrorMessage>
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                props.setShowModal(false);
                            }}>
                                {'Cancel'}
                            </Button>
                            <Button onPress={() => {
                                handleSubmit();
                            }}>
                                {'Send'}
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Center>
    );
};



export {
    ContactModal,
};
