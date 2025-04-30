import { useEffect, useRef, useState } from "react";

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    const observer = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        observer.current = new ResizeObserver(() => {
            setWidth(window.innerWidth);
        });
        observer.current.observe(document.body);

        return () => observer.current?.disconnect();
    }, []);

    return width;
}

export default useWindowWidth;