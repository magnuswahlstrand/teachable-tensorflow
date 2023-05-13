import {MobileNetModel} from "./classes.ts";
import Card2 from "./Card2.tsx";
import React, {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import {Prediction} from "./types.ts";

const COLORS = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
]

const TEXT_COLORS = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-lime-500",
    "text-green-500",
    "text-emerald-500",
]


const PredictionsList = (props: { predictions: Prediction[] }) => {
    return <div className="flex flex-col gap-1 pt-3">
        {props.predictions.map((prediction, index) => {
            const percentage = Math.round(prediction.probability * 100).toString() + "%";
            return (
                <div key={index} className="grid grid-cols-3 gap-1">
                    <div className={TEXT_COLORS[index]}>{prediction.label}</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 col-span-2 rounded overflow-hidden">
                        <div
                            className={`${COLORS[index]} text-sm h-full text-white text-right px-2`}
                            style={{width: percentage}}>{percentage}
                        </div>
                    </div>
                </div>
            )
        })}
    </div>;
}


export default function PredictSection(props: { model: MobileNetModel | null }) {
    const webcamRef = useRef<Webcam>(null);
    const [predictions, setPredictions] = React.useState<Prediction[]>([]);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const handlePredict = () => {
        // console.log("Predicting...");
        if (props.model === null || webcamRef.current === null || webcamRef.current.video === null)
            return;
        // props.model.predict(blueRef.current);
        const predictions = props.model.predict(webcamRef.current.video);
        setPredictions(predictions);
        // props.model?.predict(webcamRef.current.);
    }

    useEffect(() => {
        const id = setInterval(handlePredict, 200)
        setIntervalId(id);
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
            }
        }
    }, [props.model]);

    return <Card2 title={"Predict"}>
        <div className="p-4">
            {props.model === null ? "Please train your model" : <>
                <Webcam
                    className={"rounded-xl"}
                    ref={webcamRef}
                    videoConstraints={{
                        facingMode: 'user',
                        width: 256,
                        height: 256,
                    }}
                />
                <PredictionsList predictions={predictions}/>
            </>}
        </div>
    </Card2>
}