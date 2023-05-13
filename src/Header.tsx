import React from "react";

export function Header(props: { title: string }) {
    return <h3 className="text-sm font-medium mb-3">{props.title}</h3>;
}