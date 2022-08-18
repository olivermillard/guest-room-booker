/* ******************************************************************************
 * handleTextChange                                                        */ /**
 *
 * Handles text change of NativeBase forms by updating the state variables associated
 * with both the entry's value and whether or not to show the error.
 *
 * @param {} // TODO, fill me out later
 *
 */
const handleTextChange = (
    textInput: string,
    setEntry: (value: React.SetStateAction<string>) => void,
    showError: boolean,
    setShowError: (value: React.SetStateAction<boolean>) => void,
) => {

    const trimmedEntry = textInput.trim();
    setEntry(trimmedEntry);

    // if there is an invalid entry and the error isn't showing, show the error
    if (!trimmedEntry && !showError) {
        setShowError(true);
    }
    // if there is a valid entry and the error is showing, hide the error
    else if (trimmedEntry && showError) {
        setShowError(false);
    }
};

/* ******************************************************************************
 * emailIsValid                                                        */ /**
 *
 * Checks to see if a string is a valid email address
 *
 * @param {} // TODO, fill me out later
 *
 */
const emailIsValid = (email: string): boolean => {
    return(!/^([a-zA-Z0-9_.])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email));
    // return( /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
};

export {
    emailIsValid,
    handleTextChange
};
