import * as tf from "@tensorflow/tfjs";
import React, {useEffect} from "react";
import {ImageWithRef} from "./types.ts";

const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
const CLASS_NAMES = ['red', 'yellow', 'blue'];

const base64ToTfTensor = (base64_string: string) => {
    const b = window.atob(base64_string);
    const bytes = new Uint8Array(b.length);
    for (let i = 0; i < b.length; ++i) {
        bytes[i] = b.charCodeAt(i);
    }
    return tf.tensor(bytes);

}

function logProgress(epoch: any, logs: any) {
    console.log('Data for epoch ' + epoch, logs);
}


export function TrainCard(props: { images: ImageWithRef[] }) {
    const redRef = React.useRef<HTMLImageElement>(null);
    const yellowRef = React.useRef<HTMLImageElement>(null);
    const blueRef = React.useRef<HTMLImageElement>(null);
    const identifyRef = React.useRef<HTMLImageElement>(null);

    const classes = [
        {name: 'red', refs: [redRef]},
        {name: 'yellow', refs: [yellowRef]},
        {name: 'blue', refs: [blueRef]},
    ]

    async function loadMobileNetFeatureModel() {
        const URL =
            'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1'

        const mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});

        // model.add(layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
        // model.add(layers.dense({units: CLASS_NAMES.length, activation: 'softmax'}));


        // Warm up the model by passing zeros through it once.
        tf.tidy(function () {
            const answer = mobilenet.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
            console.log(answer);
            console.log(answer.shape);
        });
        console.log('Done loading mobile net')

        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
        model.add(tf.layers.dense({units: CLASS_NAMES.length, activation: 'softmax'}));

        // model.summary();

// Compile the model with the defined optimizer and specify a loss function to use.
        model.compile({
            // Adam changes the learning rate over time which is useful.
            optimizer: 'adam',
            // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
            // Else categoricalCrossentropy is used if more than 2 classes.
            loss: (CLASS_NAMES.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
            // As this is a classification problem you can record accuracy in the logs too!
            metrics: ['accuracy']
        });

        // const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAOIAAADiCAIAAADccoyAAAACb0lEQVR4nO3SMQ0AIADAMMC/Z5DACUtaBTs294DfrdcBcGdTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEnAA3jUCw4ZBOKoAAAAASUVORK5CYII='

        const trainingDataInputs: any[] = [];
        const trainingDataOutputs: number[] = [];

        const gatherTrainingData = (source: HTMLImageElement, cls: 'red' | 'blue' | 'yellow') => {
            const imageFeatures = tf.tidy(function () {
                const videoFrameAsTensor = tf.browser.fromPixels(source);
                const resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [MOBILE_NET_INPUT_HEIGHT,
                    MOBILE_NET_INPUT_WIDTH], true);
                const normalizedTensorFrame = resizedTensorFrame.div(255);
                return mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze();
            });
            const gatherDataState = CLASS_NAMES.indexOf(cls);
            trainingDataInputs.push(imageFeatures);
            trainingDataOutputs.push(gatherDataState);
            console.log('Gathered data for ' + cls);
            console.log(typeof gatherDataState);
            console.log(typeof imageFeatures);
        }
        if (!redRef.current || !yellowRef.current || !blueRef.current) {
            console.log('No refs');
            return;
        }

        for (let i = 0; i < 10; i++) {
            gatherTrainingData(redRef.current, 'red');
            gatherTrainingData(yellowRef.current, 'yellow');
            gatherTrainingData(blueRef.current, 'blue');
        }

        // const trainAndPredict => () {
        // predict = false;
        tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
        const outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32');
        const oneHotOutputs = tf.oneHot(outputsAsTensor, CLASS_NAMES.length);
        const inputsAsTensor = tf.stack(trainingDataInputs);

        const results = await model.fit(inputsAsTensor, oneHotOutputs, {
            shuffle: true, batchSize: 5, epochs: 10,
            callbacks: {onEpochEnd: logProgress}
        });

        outputsAsTensor.dispose();
        oneHotOutputs.dispose();
        inputsAsTensor.dispose()
        console.log(results);
        // predictLoop();
        // }
        //
        //
        // const a = tf.browser.fromPixels(imgRef.current).div(255)
        // console.log(a)
        // //
        // const predictLoop = () => {
        //     if (predict) {
        //         tf.tidy(function() {
        //             let videoFrameAsTensor = tf.browser.fromPixels(VIDEO).div(255);
        //             let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor,[MOBILE_NET_INPUT_HEIGHT,
        //                 MOBILE_NET_INPUT_WIDTH], true);
        //
        //             let imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims());
        //             let prediction = model.predict(imageFeatures).squeeze();
        //             let highestIndex = prediction.argMax().arraySync();
        //             let predictionArray = prediction.arraySync();
        //
        //             STATUS.innerText = 'Prediction: ' + CLASS_NAMES[highestIndex] + ' with ' + Math.floor(predictionArray[highestIndex] * 100) + '% confidence';
        //         });
        //
        //         window.requestAnimationFrame(predictLoop);
        //     }
        // }
    }


// Call the function immediately to start loading.
    useEffect(() => {
        loadMobileNetFeatureModel();
    }, [])

    // const model = loadGraphModel("https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_130_224/classification/2/default/1", {fromTFHub: true}).then((model) => {
    //     console.log(model)
    //     debugger;
    // }).catch((err) => {
    //     console.log(err)
    //     debugger;
    // })

    return (<div className="flex flex-row">
        <img className="w-12" ref={redRef}
             src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7ds6Dr/A6AF4OSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJe0CY7ECv2UirpoAAAAASUVORK5CYII="/>
        <img className="w-12" ref={yellowRef}
             src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII="/>
        <img className="w-12" ref={blueRef}
             src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC"/>
        <img className="w-12" ref={identifyRef}
             src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7ds6Dr/A6AF4OSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJe0CY7ECv2UirpoAAAAASUVORK5CYII="/>

        Train Card</div>);
}