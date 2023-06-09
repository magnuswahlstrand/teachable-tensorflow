import {ReactNode} from "react";
import {EditableTitle, Title} from "./component/EditableTitle.tsx";
import {XIcon} from "./component/icons/Icons.tsx";

export default function Card2(props: {
    title: string,
    onUpdateTitle?: (s: string) => void;
    onRemove?: () => void;
    children: ReactNode
}) {
    return <div className="max-w-xl bg-white rounded-lg shadow-md overflow-hidden ">
        <div className="flex items-center justify-between p-3 border-b">
            <div className="flex flex-row gap-2 justify-apart">
                {props.onUpdateTitle ?
                    <EditableTitle title={props.title} onUpdate={props.onUpdateTitle}/> :
                    <Title title={props.title}/>
                }
            </div>
            {props.onRemove && <div onClick={props.onRemove} className="cursor-pointer">
                <XIcon/>
            </div>}
        </div>
        {props.children}
    </div>;
}
