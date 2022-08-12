import {
    useColorMode,
    Box,
} from 'native-base';
import React from 'react';

function App() {
    const { colorMode } = useColorMode();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    return (
        <Box
            bg={colorMode === 'light' ? 'coolGray.50' : 'coolGray.900'}
            minHeight="100vh"
            justifyContent="center"
            px={4}
        >
            {/* {(backendData.users === undefined) ? (
                <Text>
                    {'Loading...'}
                </Text>
            ) : (
                // // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // backendData.users.map((user: string, i: number) => {
                //     <p key={i}>
                //         {user}
                //     </p>;
                // })
                <Text>
                    {'loaded!'}
                </Text> */}
            {/* )} */}
        </Box>
    );
}

// function ToggleDarkMode() {
//     const { colorMode, toggleColorMode } = useColorMode();
//     return (
//         <HStack space={2}>
//             <Text>Dark</Text>
//             <Switch
//                 isChecked={colorMode === 'light'}
//                 onToggle={toggleColorMode}
//                 aria-label={
//                     colorMode === 'light' ? 'switch to dark mode' : 'switch to light mode'
//                 }
//             />
//             <Text>Light</Text>
//         </HStack>
//     );
// }

export default App;
