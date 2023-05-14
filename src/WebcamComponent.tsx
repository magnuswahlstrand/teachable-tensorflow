import {useRef, useState} from "react";
import Webcam from "react-webcam";
import Button from "./Button.tsx";

export function WebcamComponent(props: { onAddImage: (image: string) => void }) {
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

    return (<div>
        <Webcam
            className={"rounded-xl"}
            ref={webcamRef}
            videoConstraints={{
                facingMode: 'user',
                width: 256,
                height: 256,
            }}
        />

        <div className="flex flex-col pt-3">
            <Button title={"Hold to record"}
                    onMouseDown={handleClickDown}
                    onMouseUp={handleClickUp}
                    onTouchStart={handleClickDown}
                    onTouchEnd={handleClickUp}
            />
        </div>
    </div>);
}