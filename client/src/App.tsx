import {
    useColorMode,
    Box,
    Center,
} from 'native-base';
import React from 'react';
import { DatePicker } from './components/DatePicker';
import './index.css';

// type CurrentPage = 'introduction' | 'datePicker' | 'successfulBooking'

function App() {
    const { colorMode } = useColorMode();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    // const [ currentPage, setCurrentPage ] = useState<CurrentPage>('datePicker');

    return (
        <Box
            bg={colorMode === 'light' ? 'coolGray.50' : 'coolGray.900'}
            minHeight="100vh"
            justifyContent="center"
            px={4}
        >
            <Center>
                <DatePicker/>
            </Center>
        </Box>
    );
}


export default App;
