import React, {useState} from 'react';
import './App.css';
import {TrainCard} from "./TrainCard.tsx";
import {ClassWithImages} from "./types.ts";
import {MobileNetModel} from "./classes.ts";
import {Predictor} from "./Predictor.tsx";
import {Card} from "./ClassCard.tsx";


const App: React.FC = () => {
    const [model, setModel] = useState<MobileNetModel | null>(null);
    const classes: ClassWithImages[] = [
        {
            label: 'Red',
            images: [
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAADiCAIAAADccoyAAAACb0lEQVR4nO3SMQ0AIADAMMC/Z5DACUtaBTs294DfrdcBcGdTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEnAA3jUCw4ZBOKoAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAADiCAIAAADccoyAAAACb0lEQVR4nO3SMQ0AIADAMMC/Z5DACUtaBTs294DfrdcBcGdTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEnAA3jUCw4ZBOKoAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAADiCAIAAADccoyAAAACb0lEQVR4nO3SMQ0AIADAMMC/Z5DACUtaBTs294DfrdcBcGdTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEmBTAmxKgE0JsCkBNiXApgTYlACbEnAA3jUCw4ZBOKoAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                }
            ]
        },
        {
            label: 'Yellow',
            images: [
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaUlEQVR4nO3SMQEAIAzAMMC/5+GAlx6Jgh7dMwuyzu8AeDEoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIMSppBSTMoaQYlzaCkGZQ0g5JmUNIuFzgDvmi3M4EAAAAASUVORK5CYII=',
                    ref: React.createRef<HTMLImageElement>()
                },
            ]
        },
        {
            label: 'Blue',
            images: [
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC',
                    ref: React.createRef<HTMLImageElement>()
                },
                {
                    src: 'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAACaklEQVR4nO3SMQEAIAzAsIF/z+CAlx6Jgh5dM2egav8OgBeDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXNoKQZlDSDkmZQ0gxKmkFJMyhpBiXtAmGzAr9AoqBAAAAAAElFTkSuQmCC',
                    ref: React.createRef<HTMLImageElement>()
                },
            ]
        },
    ]

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row">
                <div className="flex flex-col items-center gap-2 p-4">
                    {classes.map((c, i) => (
                        <Card key={i} label={c.label} images={c.images}/>
                    ))}
                </div>
                <div>
                    <TrainCard classes={classes} onModelTrained={(m) => setModel(m)}/>
                    <Predictor model={model}/>
                </div>
            </div>
        </div>
    );
};

export default App;
