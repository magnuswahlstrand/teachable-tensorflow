import {MobileNetModel} from "./classes.ts";
import Card2 from "./Card2.tsx";
import React, {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import {Prediction} from "./types.ts";
import Button from "./Button.tsx";


const PredictionsList = (props: { predictions: Prediction[] }) => {
    return <div>
        {props.predictions.map((prediction, index) => {
            const percentage = Math.round(prediction.probability * 100).toString() + "%";
            return (
                <div key={index} className="grid grid-cols-2">
                    {/*<img src={prediction.image} alt="webcam" class1Name="w-20 rounded"/>*/}
                    <div>{prediction.label}</div>
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div
                            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-sm"
                            style={{width: percentage}}> {percentage}
                        </div>
                    </div>
                </div>
            )
        })}
    </div>;
}

export default function Predictor(props: { model: MobileNetModel | null }) {
    const webcamRef = useRef<Webcam>(null);
    const [predictions, setPredictions] = React.useState<Prediction[]>([]);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const handlePredict = () => {
        if (props.model === null) return;
        console.log("Predicting...");
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
            {props.model === null ? "Model is null" : <>
                <Webcam
                    className={"rounded-xl"}
                    ref={webcamRef}
                    videoConstraints={{
                        facingMode: 'user',
                        width: 256,
                        height: 256,
                    }}
                />

                <Button title={"Predict"} onClick={handlePredict}/>
                {/*<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"*/}
                {/*        onClick={handlePredict}>*/}
                {/*    Predict*/}
                {/*</button>*/}
                <PredictionsList predictions={predictions}/>
            </>}
        </div>
    </Card2>
}