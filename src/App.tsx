import React, {ReactNode, useState} from 'react';
import './App.css';
import {TrainCard} from "./TrainCard.tsx";
import {ClassWithImages} from "./types.ts";
import {MobileNetModel} from "./classes.ts";
import Predictor from "./Predictor.tsx";
import ClassCard from "./ClassCard.tsx";
import {AddIcon, LongDownArrow, LongRightArrow} from "./component/icons/Icons.tsx";


function PredictArrow() {
    return <div className="flex flex-row items-center gap-2 justify-center">
        <div className="opacity-0 -mr-6">3. Predict</div>
        <LongDownArrow className="w-24 h-24 text-gray-400"/>
        <div className="-ml-6">3. Predict</div>
    </div>;
}

function RightArrowWithTitle(props: { title: ReactNode }) {
    return <div className="flex flex-col items-center px-4">
        <LongRightArrow className="w-24 h-24 text-gray-400"/>
        <div className="-mt-5">{props.title}</div>
    </div>;
}

const App: React.FC = () => {
    const [model, setModel] = useState<MobileNetModel | null>(null);
    const [classes, setClasses] = useState<ClassWithImages[]>([
        // const classes: ClassWithImages[] = [
        {
            label: 'Class 1',
            images: []
        }
    ]);

    const handleAddClass = () => {
        console.log("handleAddClass")
        setClasses(classes => [...classes, {
            label: `Class ${classes.length}`,
            images: []
        }])
    }

    const handleAddImageToClass = (label: string, base64image: string) => {
        setClasses(classes => {
            const newClasses = classes.map(c => {
                // TODO: This will error if labels are identical
                if (c.label === label) {
                    return {
                        ...c,
                        images: [...c.images, {src: base64image, ref: React.createRef<HTMLImageElement>()}]
                    }
                }
                return c;
            })
            return newClasses
        });
    }

    const handleTitleUpdated = (label: string, newTitle: string) => {
        setClasses(classes => {
            const newClasses = classes.map(c => {
                // TODO: This will error if labels are identical
                if (c.label === label) {
                    return {
                        ...c,
                        label: newTitle
                    }
                }
                return c;
            })
            return newClasses
        });
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row p-4">
                <RightArrowWithTitle title={<>1. Gather<br/>examples</>}/>
                <div className="flex flex-col items-center gap-3 items-stretch">
                    {classes.map((c, i) => (
                        <ClassCard key={i} label={c.label} images={c.images}
                                   onAddImage={(image: string) => handleAddImageToClass(c.label, image)}
                                   onTitleUpdated={(newTitle: string) => handleTitleUpdated(c.label, newTitle)
                                   }/>
                    ))}
                    <div
                        className="rounded-lg border-dashed border-2 border-gray-400 text-gray-500 hover:text-blue-900 hover:border-blue-900 flex flex-col items-center py-6 hover:cursor-pointer">
                        <div className="flex flex-row" onClick={handleAddClass}>
                            <AddIcon className="h-6 w-6"/>
                            Add a class
                        </div>
                    </div>
                </div>
                <RightArrowWithTitle title={<>2. Train<br/>model</>}/>
                <div className="flex flex-col items-stretch">
                    <TrainCard classes={classes} onModelTrained={(m) => setModel(m)}/>
                    <PredictArrow/>
                    <Predictor model={model}/>
                </div>
            </div>
        </div>
    );
};

export default App;
