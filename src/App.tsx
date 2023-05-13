import React, {useRef, useState} from 'react';
import Webcam from 'react-webcam';
import './App.css';
import {EditableTitle} from "./component/EditableTitle.tsx";
import {TrainCard} from "./TrainCard.tsx";
import {ClassWithImages, ImageWithRef} from "./types.ts";
import {MobileNetModel} from "./classes.ts";
import {Predictor} from "./Predictor.tsx";
import Card2 from "./Card2.tsx";

type SampleImagesProps = {
    images: ImageWithRef[]
}

const SampleImages = ({images}: SampleImagesProps) => {
    return <div className="h-full overflow-auto pr-6">
        <div className="grid grid-cols-4 gap-1">
            {images.map((image, index) => (
                <img key={index} src={image.src} alt="webcam" className="w-20 rounded" ref={image.ref}/>
            ))}
        </div>
    </div>;
}

function Header(props: { title: string }) {
    return <h3 className="text-sm font-medium mb-3">{props.title}</h3>;
}


function WebcamComponent(props: { onAddImage: (image: string) => void, show: boolean }) {
    const webcamRef = useRef<Webcam>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const getScreenshot = () => {
        if (!webcamRef.current)
            return;

        const imageSrc = webcamRef.current.getScreenshot({width: 256, height: 256});
        if (!imageSrc)
            return;
        props.onAddImage(imageSrc)
    }

    const handleClickDown = () => {
        getScreenshot();
        const id = setInterval(() => {
            getScreenshot();
        }, 100);
        setIntervalId(id);
    };

    const handleClickUp = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    return (<div className="p-4">
        <Header title="Webcam"/>
        {props.show && (
            <Webcam
                className={"rounded-xl"}
                ref={webcamRef}
                videoConstraints={{
                    facingMode: 'user',
                    width: 256,
                    height: 256,
                }}
            />
        )}

        <button className="bg-blue-500 text-white p-2 mt-2"
                onMouseDown={handleClickDown}
                onMouseUp={handleClickUp}
                onTouchStart={handleClickDown}
                onTouchEnd={handleClickUp}
        >
            Hold to record
        </button>
    </div>);
}

function Card(props: { images: ImageWithRef[], label: string, onAddImage?: (image: string) => void }) {
    const [title, setTitle] = useState(props.label);
    const [showWebcam, setShowWebcam] = useState(true);
    const [images, setImages] = useState<ImageWithRef[]>(props.images);

    const handleImageAdded = (image: string) => {
        const newImage = {src: image, ref: React.createRef<HTMLImageElement>()}
        setImages(images => [...images, newImage])
    }

    const top = (
        <div className="flex items-center justify-between p-3 border-b">
            <div className="flex flex-row gap-2">
                <EditableTitle title={title} onUpdate={setTitle}/>
            </div>
        </div>)

    const right = <div className="py-4 pl-6 pr-0 h-full ">
        <Header title={`${images.length} Sample Images`}/>
        <SampleImages images={images}/>
    </div>

    return (
        <Card2 title={title} onUpdateTitle={setTitle}>
            {top}
            <div className="max-w-xl flex flex-row max-h-96">
                <div className={"w-96 bg-slate-100"}>
                    {<WebcamComponent onAddImage={handleImageAdded} show={showWebcam}/>}
                </div>
                <div className={"w-96 overflow-hidden mb-2"}>
                    {right}
                </div>
            </div>
        </Card2>
    );
}


const App: React.FC = () => {
    const [model, setModel] = useState<MobileNetModel | null>(null);
    const classes: ClassWithImages[] = [
        {
            label: 'Red',
            images: [
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAADiCAIAAADccoyAAAACb0lEQVR4nO3SMQ0AIADAMMC/Z5DACUtaBTs294DfrdcBcGdTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEnAA3jUCw4ZBOKoAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAADiCAIAAADccoyAAAACb0lEQVR4nO3SMQ0AIADAMMC/Z5DACUtaBTs294DfrdcBcGdTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEnAA3jUCw4ZBOKoAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAADiCAIAAADccoyAAAACb0lEQVR4nO3SMQ0AIADAMMC/Z5DACUtaBTs294DfrdcBcGdTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEnAA3jUCw4ZBOKoAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                }
            ]
        },
        {
            label: 'Yellow',
            images: [
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
            ]
        },
        {
            label: 'Blue',
            images: [
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC',
                    ref: React.createRef<HTMLImageElement>()
                },
            ]
        },
    ]

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row">
                <div className="flex flex-col items-center gap-2 p-4">
                    {classes.map((c, i) => (
                        <Card key={i} label={c.label} images={c.images}/>
                    ))}
                </div>
                <div>
                    <TrainCard classes={classes} onModelTrained={(m) => setModel(m)}/>
                    <Predictor model={model}/>
                </div>
            </div>
        </div>
    );
};

export default App;
