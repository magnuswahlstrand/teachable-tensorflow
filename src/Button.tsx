import React from "react";

export default function Button(props: {
    title: string, disabled?: boolean,
    onClick?: () => void
    onMouseDown?: () => void,
    onMouseUp?: () => void,
    onTouchStart?: () => void,
    onTouchEnd?: () => void,
}) {
    return <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-500"
        disabled={props.disabled}
        onClick={props.onClick}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onTouchStart={props.onTouchStart}
        onTouchEnd={props.onTouchEnd}
    >{props.title}</button>;
}