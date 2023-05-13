import {MobileNetModel} from "./classes.ts";
import Card2 from "./Card2.tsx";
import React, {useRef} from "react";
import Webcam from "react-webcam";

export function Predictor(props: { model: MobileNetModel | null }) {
    const blueRef = React.useRef<HTMLImageElement>(null);
    const webcamRef = useRef<Webcam>(null);

    const handlePredict = () => {
        console.log("Predicting...");
        if (props.model === null || blueRef.current === null || webcamRef.current === null || webcamRef.current.video === null)
            return;
        props.model?.predict(blueRef.current);
        props.model?.predict(webcamRef.current.video);
        // props.model?.predict(webcamRef.current.);
    }

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
    </Card2>
}