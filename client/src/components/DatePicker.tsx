/* ******************************************************************************
 * DatePicker.tsx                                                               *
 * ******************************************************************************
 *
 * The date picker component for finding calendar dates.
 *
 * Created on      August 12, 2022
 * @author          Oliver Millard
 *
 * ******************************************************************************/

import { Box, Button } from 'native-base';
import React, { useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';

const DatePicker = () => {
    const timeZone = 'Europe/London';
    const currDateString = new Date().toLocaleString('en-US', {timeZone: timeZone});
    const currDate = new Date(Date.parse(currDateString));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ dateRange, setDateRange ] = useState<any>([
        {
            startDate: currDate,
            endDate: null,
            key: 'selection'
        }
    ]);

    const handleDateChange = (item: RangeKeyDict) => {
        setDateRange([ item.selection ]);
        console.log(item);
    };

    const handleSubmit = () => {
        console.log('hi');
        fetch('http://localhost:3000/store-data', {
            method: 'POST',
            // We convert the React state to JSON and send it as the POST body
            body: JSON.stringify(dateRange)
        }).then(function(response) {
            console.log(response);
            return response.json();
        });
    };

    return (
        <Box
            borderRadius={20}
            overflow='hidden'
        >
            <DateRange
                editableDateInputs={true}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(item: any) => handleDateChange(item)}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                minDate={currDate}
            />
            <Button
                onPress={()=>handleSubmit()}
            >
                {'click me'}
            </Button>
        </Box>
    );
};


export {
    DatePicker,
};
