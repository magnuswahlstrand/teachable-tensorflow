import * as tf from "@tensorflow/tfjs";
import React from "react";
import {ClassWithImages} from "./types.ts";
import {EPOCHS, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, MobileNetModel} from "./classes.ts";
import Card2 from "./Card2.tsx";
import Button from "./Button.tsx";


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

function logProgress(epoch: number) {
    console.log('Data for epoch ' + epoch);
}


export default function TrainingSection(props: {
    classes: ClassWithImages[],
    onModelTrained: (model: MobileNetModel) => void
}) {
    const [trainingInProgress, setTrainingInProgress] = React.useState(false);
    const [epochs, setEpochs] = React.useState(0);
    // TODO: How to handle these values?
    const [maxEpochs, setMaxEpochs] = React.useState(0);
    const classNames = props.classes.map(c => c.label);
    const readyClasses = props.classes.filter(c => c.images.length > 0);

    async function loadMobileNetFeatureModel() {
        setEpochs(0);
        setMaxEpochs(EPOCHS);
        setTrainingInProgress(true);
        console.log("Loading MobileNet feature model...");
        // const numClasses = props.classes.length;
        // TODO: We don't need to do this every time the component is rendered.
        const mobilenet = await downloadMobilenet();
        const model = new MobileNetModel(mobilenet, classNames);
        // const {trainingDataInputs, trainingDataOutputs} = model.gatherTrainingData(props.classes);

        const onProgress = (epoch: number) => {
            setEpochs(epoch);
            logProgress(epoch);
        }
        await model.train(props.classes, onProgress)
        props.onModelTrained(model);
        setTrainingInProgress(false);
    }

    const title = trainingInProgress ? `Training (${epochs}/${maxEpochs})` : "Train";

    return (
        <Card2 title={"Training"}>
            <div className="flex flex-col p-4">
                <Button title={title} onClick={() => loadMobileNetFeatureModel()}
                        disabled={readyClasses.length < 2 || trainingInProgress}/>
            </div>
        </Card2>
    );
}