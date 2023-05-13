import * as tf from "@tensorflow/tfjs";
import React, {useEffect} from "react";
import {ClassWithImages} from "./types.ts";
import {MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, MobileNetModel} from "./classes.ts";
import Card2 from "./Card2.tsx";


async function downloadMobilenet() {
    const URL =
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1'

    const mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});

    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        const answer = mobilenet.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(answer);
    });


    return mobilenet;
}

export function TrainCard(props: { classes: ClassWithImages[], onModelTrained: (model: MobileNetModel) => void }) {
    // const redRef = React.useRef<HTMLImageElement>(null);
    // const yellowRef = React.useRef<HTMLImageElement>(null);
    // const blueRef = React.useRef<HTMLImageElement>(null);

    const classNames = props.classes.map(c => c.label);
    const readyClasses = props.classes.filter(c => c.images.length > 0);

    async function loadMobileNetFeatureModel() {
        // const numClasses = props.classes.length;
        // TODO: We don't need to do this every time the component is rendered.
        const mobilenet = await downloadMobilenet();
        const model = new MobileNetModel(mobilenet, classNames);
        // const {trainingDataInputs, trainingDataOutputs} = model.gatherTrainingData(props.classes);
        await model.train(props.classes);

        // if(redRef.current === null || yellowRef.current === null || blueRef.current === null)
        //     return
        // model.predict(redRef.current);
        // model.predict(yellowRef.current);
        // model.predict(blueRef.current);
        // model.predict(yellowRef.current);
        props.onModelTrained(model);
    }


// Call the function immediately to start loading.
    useEffect(() => {
        loadMobileNetFeatureModel();
    }, [])


    return (
        <Card2 title={"Trainer here"} onUpdateTitle={() => ({})}>
            {/*<div className="flex flex-row">*/}
            {/*    <img className="w-12" ref={redRef}*/}
            {/*         src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7ds6Dr/A6AF4OSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJe0CY7ECv2UirpoAAAAASUVORK5CYII="/>*/}
            {/*    <img className="w-12" ref={yellowRef}*/}
            {/*         src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII="/>*/}
            {/*    <img className="w-12" ref={blueRef}*/}
            {/*         src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC"/>*/}
            {/*</div>*/}
            <div>
                {props.classes.map((c, i) => {
                    return <div key={i} className="text-2xl font-bold">
                        {c.label} {c.images.length}
                    </div>
                })}

            </div>
            <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => loadMobileNetFeatureModel()}>
                    Retrain
                </button>
            </div>
        </Card2>
    );
}