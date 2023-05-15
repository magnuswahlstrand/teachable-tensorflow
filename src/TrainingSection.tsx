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

const green = <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor"
                   viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"></path>
</svg>

const gray = <svg className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"></path>
</svg>

function Checklist(props: { classes: ClassWithImages[] }) {
    const atleastTwoClasses = props.classes.length >= 2
    const atleastOneSamplePerClass = props.classes.filter(c => c.images.length >= 2).length

    return <div>
        <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
            <li className="flex items-center">
                {atleastTwoClasses ? green: gray}
                At least 2 classes
            </li>
            <li className="flex items-center">
                {atleastOneSamplePerClass ? green: gray}
                At least one samples per class
            </li>
        </ul>
    </div>
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
                <Checklist classes={props.classes}/>
                <Button title={title} onClick={() => loadMobileNetFeatureModel()}
                        disabled={readyClasses.length < 2 || trainingInProgress || modelNotLoaded}/>
            </div>
        </Card2>
    );
}