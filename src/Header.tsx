import {ReactNode} from "react";

export function Header(props: { title: ReactNode }) {
    return <h3 className="text-sm font-medium mb-3">{props.title}</h3>;
}