import React, {useState} from "react";
import {EditIcons} from "./icons/Icons.tsx";

export function Title({title}: { title: string }) {
    return <h2 className="text-lg font-medium">{title}</h2>;
}

const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => event.target.select();

export function EditableTitle({title, onUpdate}: { title: string, onUpdate: (value: string) => void }) {
    const [isEditingTitle, setIsEditing] = useState(false);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log('do validate')
            setIsEditing(false)
        }
    }

    return <>
        <h2 className="text-lg font-medium">
            {isEditingTitle ? (
                <input
                    autoFocus={true}
                    className="bg-transparent border-b border-gray-500 px-2"
                    onKeyDown={handleKeyDown}
                    value={title}
                    onChange={e => onUpdate(e.target.value)}
                    onBlur={() => setIsEditing(false)}
                    onFocus={handleFocus}
                />) : title}
        </h2>
        <button onClick={() => setIsEditing(state => !state)}>
            <EditIcons className="text-slate-400 w-4"/>
        </button>
    </>;
}