import React, {useRef, useState} from "react";
import Webcam from "react-webcam";
import {Header} from "./Header.tsx";

export function WebcamComponent(props: { onAddImage: (image: string) => void, show: boolean }) {
    const webcamRef = useRef<Webcam>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const getScreenshot = () => {
        if (!webcamRef.current)
            return;

        const imageSrc = webcamRef.current.getScreenshot({width: 256, height: 256});
        if (!imageSrc)
            return;
        props.onAddImage(imageSrc)
    }

    const handleClickDown = () => {
        getScreenshot();
        const id = setInterval(() => {
            getScreenshot();
        }, 100);
        setIntervalId(id);
    };

    const handleClickUp = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    return (<div className="p-4">
        <Header title="Webcam"/>
        {props.show && (
            <Webcam
                className={"rounded-xl"}
                ref={webcamRef}
                videoConstraints={{
                    facingMode: 'user',
                    width: 256,
                    height: 256,
                }}
            />
        )}

        <button className="bg-blue-500 text-white p-2 mt-2"
                onMouseDown={handleClickDown}
                onMouseUp={handleClickUp}
                onTouchStart={handleClickDown}
                onTouchEnd={handleClickUp}
        >
            Hold to record
        </button>
    </div>);
}