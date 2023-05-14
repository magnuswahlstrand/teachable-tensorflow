import React from "react";

export type ClassWithImages = {
    label: string,
    images: ImageWithRef[]
    collapsed: boolean
}

export type ImageWithRef = {
    src: string,
    ref: React.RefObject<HTMLImageElement>
}

export type Prediction = { label: string, probability: number };
