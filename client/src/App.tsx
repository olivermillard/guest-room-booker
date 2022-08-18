import React from 'react';
import './index.css';
import {
    Routes,
    Route,
    useLocation
} from 'react-router-dom';
import { ReqResponse } from './components/ReqResponse';
import { ContactForm } from './components/ContactForm';
import { DatePicker } from './components/DatePicker';

function App() {
    // const { colorMode } = useColorMode();
    const location = useLocation();

    return (
        <>
            <Routes location={location} key={location.pathname}>
                <Route path='/intro' element={<DatePicker />} />
                <Route path='/' element={<DatePicker />} />
                <Route path='/reqResponse' element={<ReqResponse/>} />
                <Route path='/contact' element={<ContactForm/>} />
            </Routes>
        </>
    );
}


export default App;
