import { useEffect, useState } from "react";

function TimeCard() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {time.toLocaleTimeString()}

        </>
    );
}

export default TimeCard;
