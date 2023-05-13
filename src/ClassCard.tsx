import {ImageWithRef} from "./types.ts";
import React, {useState} from "react";
import {EditableTitle} from "./component/EditableTitle.tsx";
import {Header} from "./Header.tsx";
import Card2 from "./Card2.tsx";
import {WebcamComponent} from "./WebcamComponent.tsx";

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

export default function ClassCard(props: { images: ImageWithRef[], label: string, onAddImage: (image: string) => void }) {
    const [title, setTitle] = useState(props.label);
    const [showWebcam, setShowWebcam] = useState(true);
    // const [images, setImages] = useState<ImageWithRef[]>(props.images);

    // const handleImageAdded = (image: string) => {
    //     const newImage = {src: image, ref: React.createRef<HTMLImageElement>()}
    //     console.log("newImage", newImage)
    //     setImages(images => [...images, newImage])
    // }

    const right = <div className="py-4 pl-6 pr-0 h-full ">
        <Header title={`${props.images.length} Sample Images`}/>
        <SampleImages images={props.images}/>
    </div>

    return (
        <Card2 title={title} onUpdateTitle={setTitle}>
            <div className="max-w-xl flex flex-row max-h-96">
                <div className={"w-96 bg-slate-100"}>
                    {<WebcamComponent onAddImage={props.onAddImage} show={showWebcam}/>}
                </div>
                <div className={"w-96 overflow-hidden mb-2"}>
                    {right}
                </div>
            </div>
        </Card2>
    );
}