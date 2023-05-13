import * as tf from "@tensorflow/tfjs";
import React, {useEffect} from "react";
import {ClassWithImages} from "./types.ts";
import {GraphModel, Sequential} from "@tensorflow/tfjs";

const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;

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

const predict = (mobilenet: GraphModel, model: Sequential, classNames: string[], ref: React.RefObject<HTMLImageElement>) => {
    tf.tidy(() => {
        if (!ref.current) {
            console.log('No ref');
            return;
        }
        const videoFrameAsTensor = tf.browser.fromPixels(ref.current).div(255);
        const resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [MOBILE_NET_INPUT_HEIGHT,
            MOBILE_NET_INPUT_WIDTH], true);

        const imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims());
        const prediction = model.predict(imageFeatures).squeeze();
        const highestIndex = prediction.argMax().arraySync();
        const predictionArray = prediction.arraySync();
        console.log(classNames[highestIndex]);
        console.log(predictionArray);
    });
};

async function getBaseModels(numClasses: number) {
    const URL =
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1'

    const mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});

    // model.add(layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
    // model.add(layers.dense({units: CLASS_NAMES.length, activation: 'softmax'}));


    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        const answer = mobilenet.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(answer);
    });
    console.log('Done loading mobile net')

    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
    model.add(tf.layers.dense({units: numClasses, activation: 'softmax'}));

    // model.summary();

    // Compile the model with the defined optimizer and specify a loss function to use.
    model.compile({
        // Adam changes the learning rate over time which is useful.
        optimizer: 'adam',
        // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
        // Else categoricalCrossentropy is used if more than 2 classes.
        loss: (numClasses === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
        // As this is a classification problem you can record accuracy in the logs too!
        metrics: ['accuracy']
    });
    return {mobilenet, model};
}

function gatherTrainingData(mobilenet: GraphModel, classes: ClassWithImages[]) {
    const trainingDataInputs: any[] = [];
    const trainingDataOutputs: number[] = [];

    const gatherTrainingData = (source: HTMLImageElement, index: number) => {
        const imageFeatures = tf.tidy(function () {
            const videoFrameAsTensor = tf.browser.fromPixels(source);
            const resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [MOBILE_NET_INPUT_HEIGHT,
                MOBILE_NET_INPUT_WIDTH], true);
            const normalizedTensorFrame = resizedTensorFrame.div(255);
            return mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze();
        });
        const gatherDataState = index;
        trainingDataInputs.push(imageFeatures);
        trainingDataOutputs.push(gatherDataState);
        console.log(typeof gatherDataState);
        console.log(typeof imageFeatures);
    }

    classes.forEach((cls, i) => {
        console.log('Gathering data for ' + cls.label)
        cls.images.forEach((image) => {
            if (!image.ref.current) {
                console.log('No ref');
                return;
            }
            gatherTrainingData(image.ref.current, i);
        })
    })
    return {trainingDataInputs, trainingDataOutputs};
}

async function trainModel(trainingDataInputs: any[], trainingDataOutputs: number[], numClasses: number, model: Sequential) {
    tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
    const outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32');
    const oneHotOutputs = tf.oneHot(outputsAsTensor, numClasses);
    const inputsAsTensor = tf.stack(trainingDataInputs);

    const results = await model.fit(inputsAsTensor, oneHotOutputs, {
        shuffle: true, batchSize: 5, epochs: 10,
        callbacks: {onEpochEnd: logProgress}
    });

    outputsAsTensor.dispose();
    oneHotOutputs.dispose();
    inputsAsTensor.dispose()
    console.log(results);
}

export function TrainCard(props: { classes: ClassWithImages[] }) {
    const redRef = React.useRef<HTMLImageElement>(null);
    const yellowRef = React.useRef<HTMLImageElement>(null);
    const blueRef = React.useRef<HTMLImageElement>(null);

    const classNames = props.classes.map(c => c.label);

    async function loadMobileNetFeatureModel() {
        const numClasses = props.classes.length;
        const {mobilenet, model} = await getBaseModels(numClasses);
        const {trainingDataInputs, trainingDataOutputs} = gatherTrainingData(mobilenet, props.classes);
        await trainModel(trainingDataInputs, trainingDataOutputs, numClasses, model);


        predict(mobilenet, model, classNames, redRef);
        predict(mobilenet, model, classNames, yellowRef);
        predict(mobilenet, model, classNames, blueRef);
        predict(mobilenet, model, classNames, yellowRef);
    }


// Call the function immediately to start loading.
    useEffect(() => {
        loadMobileNetFeatureModel();
    }, [])


    return (<div className="flex flex-row">
        <img className="w-12" ref={redRef}
             src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7ds6Dr/A6AF4OSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJc2gpBmUNIOSZlDSDEqaQUkzKGkGJe0CY7ECv2UirpoAAAAASUVORK5CYII="/>
        <img className="w-12" ref={yellowRef}
             src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII="/>
        <img className="w-12" ref={blueRef}
             src="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC"/>
    </div>);
}