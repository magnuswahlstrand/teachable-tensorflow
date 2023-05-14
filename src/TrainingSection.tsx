import * as tf from "@tensorflow/tfjs";
import {GraphModel} from "@tensorflow/tfjs";
import React, {useEffect} from "react";
import {ClassWithImages} from "./types.ts";
import {EPOCHS, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, MobileNetModel} from "./classes.ts";
import Card2 from "./Card2.tsx";
import Button from "./Button.tsx";


// const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1'
// const downloadOptions = {fromTFHub: true};
const URL = '/model.json'
const downloadOptions = {fromTFHub: false};

async function downloadMobilenet() {

    const mobilenet = await tf.loadGraphModel(URL, downloadOptions);

    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        mobilenet.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
    });


    return mobilenet;
}


export default function TrainingSection(props: {
    classes: ClassWithImages[],
    onModelTrained: (model: MobileNetModel) => void
}) {
    const [trainingInProgress, setTrainingInProgress] = React.useState(false);
    const [epochs, setEpochs] = React.useState(0);
    const [mobilenet, setMobilenet] = React.useState<GraphModel | null>(null);
    // TODO: How to handle these values?
    const classNames = props.classes.map(c => c.label);
    const readyClasses = props.classes.filter(c => c.images.length > 0);

    useEffect(() => {
        (async () => {
            const mobilenet = await downloadMobilenet();
            setMobilenet(mobilenet);
        })()
    }, [])

    async function loadMobileNetFeatureModel() {
        if (!mobilenet) {
            throw new Error("MobileNet not loaded");
        }
        setEpochs(0);
        setTrainingInProgress(true);
        console.log("Loading MobileNet feature model...");
        // const numClasses = props.classes.length;
        // TODO: We don't need to do this every time the component is rendered.
        const model = new MobileNetModel(mobilenet, classNames);
        // const {trainingDataInputs, trainingDataOutputs} = model.gatherTrainingData(props.classes);

        const onProgress = (epoch: number) => {
            setEpochs(epoch);
        }
        await model.train(props.classes, onProgress)
        props.onModelTrained(model);
        setTrainingInProgress(false);
    }

    const modelNotLoaded = mobilenet === null;
    let title;
    if (modelNotLoaded) {
        title = "Loading base model";
    } else if (trainingInProgress) {
        title = `Training (${epochs}/${EPOCHS})`;
    } else {
        title = "Train";
    }

    return (
        <Card2 title={"Training"}>
            <div className="flex flex-col p-4">
                <Button title={title} onClick={() => loadMobileNetFeatureModel()}
                        disabled={readyClasses.length < 2 || trainingInProgress || modelNotLoaded}/>
            </div>
        </Card2>
    );
}