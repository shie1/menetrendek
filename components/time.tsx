import { useEffect, useState } from 'react';

export const useTime = (refreshCycle = 100) => {
    // Returns the current time
    // and queues re-renders every `refreshCycle` milliseconds (default: 100ms)

    const [now, setNow] = useState(getTime());

    useEffect(() => {
        // Regularly set time in state
        // (this will cause your component to re-render frequently)
        const intervalId = setInterval(
            () => setNow(getTime()),
            refreshCycle,
        );

        // Cleanup interval
        return () => clearInterval(intervalId);

        // Specify dependencies for useEffect
    }, [refreshCycle, setInterval, clearInterval, setNow, getTime]);

    return now;
};

//
// getTime helper function
// (helpful for testing)
// (and for showing that this hook isn't specific to any datetime library)
//
import moment from 'moment';

export const getTime = () => {
    // This implementation uses Luxon: https://moment.github.io/luxon/
    // return DateTime.local();

    // You can also use moment: https://momentjs.com
    return moment();

    // Or just use native Date objects (in general, not a good move)
    // return new Date();

    // Or just use unix epoch timestamps (integers, no timezones)
    // return (new Date()).getTime();
};