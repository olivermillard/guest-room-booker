/* ******************************************************************************
 * Header.tsx                                                                   *
 * ******************************************************************************
 *
 * @fileoverview The top bar component
 *
 * Created on       August 12, 2022
 * @author          Oliver Millard
 *
 * ******************************************************************************/

import {
    HStack,
    // useBreakpointValue,
    useColorMode,
} from 'native-base';
import React from 'react';

const Header = () => {
    const {colorMode} = useColorMode();


    // const isLg = useBreakpointValue({
    //     base: false,
    //     lg: true,
    // });

    // const barIconSize = useBreakpointValue({
    //     base: '24px',
    //     lg: '30px',
    // });

    return (
        <HStack
            position='fixed'
            bg={colorMode === 'light' ? 'bg.light' : 'bg.dark'}
            space={3}
            alignItems='center'
            justifyContent='center'
            w='100%'
            h={{base: '50px', lg: '110px'}}
            zIndex='100'
            opacity={'90%'}
        >
            <HStack
                justifyContent='left'
                alignItems='center'
                w='40vw'
                // pl={{base: '30px', lg: '40px'}}
                pl={{base: '5%',lg: '2.5%'}}
            >
                {'left'}
            </HStack>
            <HStack
                justifyContent='center'
                alignItems='center'
                w='20vw'
                h='100%'
            >
                {'center'}
            </HStack>
            <HStack
                justifyContent='right'
                alignItems='center'
                w='40vw'
                h='100%'
                pr= {{base: '5%',lg: '2.5%'}}// {{base: '30px', lg: '40px'}}
                space={5}
            >
                {'right'}
            </HStack>
        </HStack>
    );
};

export {
    Header,
};
