import React, {useRef, useState} from 'react';
import Webcam from 'react-webcam';
import './App.css';
import {EditableTitle} from "./component/EditableTitle.tsx";


type SampleImagesProps = {
    images: string[]
}

const SampleImages = ({images}: SampleImagesProps) => {
    return <div className="h-full overflow-auto pr-6">
        <div className="grid grid-cols-4 gap-1">
            {images.map((image, index) => (
                <img key={index} src={image} alt="webcam" className="w-20 rounded"/>
            ))}
        </div>
        {/*{images.length === 0 && <div className="text-gray-400">No images yet</div>}*/}
    </div>;
}

function Header(props: { title: string }) {
    return <h3 className="text-sm font-medium mb-3">{props.title}</h3>;
}


function Card() {
    const webcamRef = useRef<Webcam>(null);
    const [title, setTitle] = useState('Card Title');
    const [showWebcam, setShowWebcam] = useState(true);
    const [images, setImages] = useState<string[]>([]);

    function handleClick() {
        if (!webcamRef.current)
            return;

        const imageSrc = webcamRef.current.getScreenshot({width: 256, height: 256});
        if (!imageSrc)
            return;

        setImages([...images, imageSrc])
    }

    const top = (
        <div className="flex items-center justify-between p-3 border-b">
            <div className="flex flex-row gap-2">
                <EditableTitle title={title} onUpdate={setTitle}/>
            </div>
        </div>)

    const left = (<div className="p-4">
        <Header title="Webcam"/>
        {showWebcam && (
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

        <button className="bg-blue-500 text-white p-2 mt-2" onClick={handleClick
        }>
            Take a picture
        </button>
    </div>)

    const right = <div className="py-4 pl-6 pr-0 h-full ">
        <Header title={`${images.length} Sample Images`}/>
        <SampleImages images={images}/>
    </div>

    return (
        <div className="max-w-xl bg-white rounded-lg shadow-md overflow-hidden">
            {top}
            <div className="max-w-xl flex flex-row max-h-96">
                <div className={"w-96 bg-slate-100"}>
                    {left}
                </div>
                <div className={"w-96 overflow-hidden mb-2"}>
                    {right}
                </div>
            </div>
        </div>
    );
}


const App: React.FC = () => {


    return (
        <div className="flex flex-col items-center bg-slate-200 gap-2 p-4">
            <Card/>
            <Card/>
            <Card/>
        </div>
    );
};

export default App;
