import React, {ReactNode} from "react";
import {EditableTitle} from "./component/EditableTitle.tsx";

export default function Card2(props: { title: string, onUpdateTitle: (s: string) => void; children: ReactNode }) {
    return <div className="max-w-xl bg-white rounded-lg shadow-md overflow-hidden ">
        <div className="flex items-center justify-between p-3 border-b">
            <div className="flex flex-row gap-2">
                <EditableTitle title={props.title} onUpdate={props.onUpdateTitle}/>
            </div>
        </div>
        {props.children}
    </div>;
}