import {MobileNetModel} from "./classes.ts";
import Card2 from "./Card2.tsx";
import React, {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import {Prediction} from "./types.ts";


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

export function Predictor(props: { model: MobileNetModel | null }) {
    const blueRef = React.useRef<HTMLImageElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const [predictions, setPredictions] = React.useState<Prediction[]>([]);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const handlePredict = () => {
        if(props.model === null) return;
        console.log("Predicting...");
        if (props.model === null || blueRef.current === null || webcamRef.current === null || webcamRef.current.video === null)
            return;
        props.model.predict(blueRef.current);
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

    return <Card2 title={"Predict"} onUpdateTitle={(s) => ({})}>
        <h3 className="text-sm font-medium mb-3">
            aa {props.model === null ? null : "YEAH"}
        </h3>
        <Webcam
            className={"rounded-xl"}
            ref={webcamRef}
            videoConstraints={{
                facingMode: 'user',
                width: 256,
                height: 256,
            }}
        />
        <img className="w-12" ref={blueRef}
             src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC"/>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handlePredict}>
            Predict
        </button>
        <PredictionsList predictions={predictions}/>
    </Card2>
}