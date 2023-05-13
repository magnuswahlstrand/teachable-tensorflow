import {MobileNetModel} from "./classes.ts";
import Card2 from "./Card2.tsx";

export function Predictor(props: { model: MobileNetModel | null }) {
    return <Card2 title={"Predict"} onUpdateTitle={(s) => ({})}>
        <h3 className="text-sm font-medium mb-3">
            aa {props.model === null ? null : "YEAH"}
        </h3>
    </Card2>
}