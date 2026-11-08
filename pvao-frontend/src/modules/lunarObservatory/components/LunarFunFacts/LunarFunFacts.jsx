/**
 * Displays a rotating carousel of random lunar fun facts.
 * Computes random selections from the static fun facts data.
 */
import React from 'react';
import FactCarousel from '../../../../components/common/FactCarousel/FactCarousel';
import { lunarFunFacts } from './funFacts.data';

const LunarFunFacts = () => {
    return (
        <FactCarousel title="Lunar Fun Facts" facts={lunarFunFacts} />
    );
};

export default LunarFunFacts;
