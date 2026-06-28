"use client";
import {useEffect, useState} from "react";

export function MswProvider({ children } :{children:React.ReactNode}) {
    const [mswReady, setMswReady] = useState(false);

    useEffect(() => {
        async function enableMocking(){
            const {worker}= await import("@/mocks/browser");
            await worker.start({ onUnhandledRequest: "bypass" });
            setMswReady(true);
        }
    
    enableMocking();
    }
, []);
    if (!mswReady) {
        return <div>Loading...</div>;
    }
    return <>{children}</>;
}