import React from "react";

export type ClassWithImages = {
    label: string,
    images: ImageWithRef[]
}

export type ImageWithRef = {
    src: string,
    ref: React.RefObject<HTMLImageElement>
}
