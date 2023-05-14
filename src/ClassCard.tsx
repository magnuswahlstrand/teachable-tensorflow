import {ImageWithRef} from "./types.ts";
import {Header} from "./Header.tsx";
import Card2 from "./Card2.tsx";
import {WebcamComponent} from "./WebcamComponent.tsx";
import {VideoIcon, XIcon} from "./component/icons/Icons.tsx";

type SampleImagesProps = {
    images: ImageWithRef[]
}
const SampleImages = ({images}: SampleImagesProps) => {
    return <div className="h-full overflow-auto pr-6">
        <div className="grid grid-cols-4 gap-1">
            {images.map((image, index) => (
                <img key={index} src={image.src} alt="webcam" className="w-16 h-16 rounded" ref={image.ref}/>
            ))}
        </div>
    </div>;
}

const SampleImagesCollapsed = ({images}: SampleImagesProps) => {
    return <div className="h-full overflow-auto pr-6">
        <div className="flex flex-row gap-2">
            {images.map((image, index) => (
                <img key={index} src={image.src} alt="webcam" className="w-16 h-16 rounded" ref={image.ref}/>
            ))}
        </div>
    </div>;
}

export default function ClassCard(props: {
    images: ImageWithRef[], label: string,
    collapsed: boolean,
    onAddImage: (image: string) => void
    onTitleUpdated: (newTitle: string) => void
    onSetCollapsed: (collapse: boolean) => void
    onRemove?: () => void
    onResetImages?: () => void
}) {

    const resetButton = <span className="cursor-pointer text-slate-500 italic"
                              onClick={props.onResetImages}>reset</span>

    const showWebcamButton =
        <div
            className="w-18 h-full text-blue-800 bg-blue-100 hover:bg-blue-200 flex flex-col items-center p-3 rounded-md cursor-pointer"
            onClick={() => props.onSetCollapsed(false)}
        >
            <VideoIcon/>
            <div className="text-sm">
                Webcam
            </div>
        </div>

    if (props.collapsed) {
        return (
            <Card2 title={props.label} onUpdateTitle={props.onTitleUpdated} onRemove={props.onRemove}>
                <div className="max-w-xl flex flex-row max-h-96">
                    <div className={"w-96 overflow-hidden mb-2"}>
                        <div className="py-4 pl-6 pr-0 h-full ">
                            <Header title={<>{props.images.length} Sample Images ({resetButton})</>}/>
                            <div className="flex flex-row gap-2">
                                {showWebcamButton}
                                <SampleImagesCollapsed images={props.images}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Card2>
        )
    }


    return (
        <Card2 title={props.label} onUpdateTitle={props.onTitleUpdated} onRemove={props.onRemove}>
            <div className="max-w-xl flex flex-row max-h-96">
                <div className={"w-96 bg-slate-100 p-4"}>
                    <div className="flex flex-row justify-between items-center">
                        <Header title="Webcam"/>
                        <button onClick={() => props.onSetCollapsed(true)}>
                            <XIcon className="w-4 h-4 mb-3"/>
                        </button>
                    </div>
                    {<WebcamComponent onAddImage={props.onAddImage}/>}
                </div>
                <div className={"w-96 overflow-hidden mb-2"}>
                    <div className="py-4 pl-6 pr-0 h-full ">
                        <Header title={<>{props.images.length} Sample Images ({resetButton})</>}/>
                        <SampleImages images={props.images}/>
                    </div>
                </div>
            </div>
        </Card2>
    );
}