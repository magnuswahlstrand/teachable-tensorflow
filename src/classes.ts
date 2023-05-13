import * as tf from "@tensorflow/tfjs";
import {GraphModel} from "@tensorflow/tfjs";
import {ClassWithImages, Prediction} from "./types.ts";

export const MOBILE_NET_INPUT_WIDTH = 224;
export const MOBILE_NET_INPUT_HEIGHT = 224;

function logProgress(epoch: any, logs: any) {
    console.log('Data for epoch ' + epoch, logs);
}

export class MobileNetModel {
    model: tf.Sequential;
    mobilenet: tf.GraphModel;
    trainingCompleted: boolean;
    classes: string[]
    numClasses: number;

    constructor(mobilenet: GraphModel, classes: string[]) {
        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
        model.add(tf.layers.dense({units: classes.length, activation: 'softmax'}));

        // Compile the model with the defined optimizer and specify a loss function to use.
        model.compile({
            // Adam changes the learning rate over time which is useful.
            optimizer: 'adam',
            // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
            // Else categoricalCrossentropy is used if more than 2 classes.
            loss: (classes.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
            // As this is a classification problem you can record accuracy in the logs too!
            metrics: ['accuracy']
        });

        this.model = model;
        this.mobilenet = mobilenet;
        this.trainingCompleted = false;
        this.classes = classes
        this.numClasses = classes.length;
    }

    gatherTrainingData(classes: ClassWithImages[]): { trainingDataInputs: any[]; trainingDataOutputs: number[] } {
        const trainingDataInputs: any[] = [];
        const trainingDataOutputs: number[] = [];

        const mobilenet = this.mobilenet

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

    async train(classes: ClassWithImages[]): Promise<void> {
        const {trainingDataInputs, trainingDataOutputs} = this.gatherTrainingData(classes);

        tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
        const outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32');
        const oneHotOutputs = tf.oneHot(outputsAsTensor, this.numClasses);
        const inputsAsTensor = tf.stack(trainingDataInputs);

        const results = await this.model.fit(inputsAsTensor, oneHotOutputs, {
            shuffle: true, batchSize: 5, epochs: 10,
            callbacks: {onEpochEnd: logProgress}
        });

        outputsAsTensor.dispose();
        oneHotOutputs.dispose();
        inputsAsTensor.dispose()
        console.log(results);
    }

    predict(input: HTMLImageElement | HTMLVideoElement): Prediction[] {
        // Implement the functionality for making predictions here
        let predictions: Prediction[] = [];
        tf.tidy(() => {
            // if (!ref.current) {
            //     console.log('No ref');
            //     return;
            // }
            const videoFrameAsTensor = tf.browser.fromPixels(input).div(255);
            const resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [MOBILE_NET_INPUT_HEIGHT,
                MOBILE_NET_INPUT_WIDTH], true);

            const imageFeatures = this.mobilenet.predict(resizedTensorFrame.expandDims());
            const prediction = this.model.predict(imageFeatures).squeeze();
            const highestIndex = prediction.argMax().arraySync();
            const predictionArray = prediction.arraySync();
            console.log(this.classes[highestIndex]);
            console.log(predictionArray);
            predictions = predictionArray.map((probability: number, index: number) => {
                return {label: this.classes[index], probability};
            })
        });
        return predictions

    }
}