
import { Uuid } from "~/utilities/utilities";
import {Widget, Widgetinstance} from "./widgets";

export enum DragTypes {
    moving = "63624c50-86bb-4558-8721-af764bc22703",
    newItem = "0e3684a8-c134-4066-bfc1-5d14ca468b9a",
}

export enum WidgetType {
    text = "cd1db6e5-8b78-4a89-9ec4-436459324f40",
    image = "180538cb-3e85-4a4c-a853-6e01ce2100fa",
    video = "f7c20ba6-6e22-415a-85a7-c32fc42b7683",
    carousel = "c0da9c70-e67f-4f7c-896d-94520c64daca",
    oneDropLayout = "971f32bc-0fc0-44f0-a584-4f5fd7c56dd4",
    oneColumnLayout = "312c6945-61dc-4b5f-bdf2-3cfba6754ec8",
    twoColumnLayout = "ee425ec3-ed20-481c-9ba2-5c09c4c28591",
}

export type MediaDetails = {
    src: string;
};

export interface Positions {
    top: string;
    bottom: string;
    right: string;
    left: string;
}

export abstract class BaseWidget {
    id: Uuid;
    type: WidgetType;
    humanRedableName: string;
    margin: Positions;
    padding: Positions;
    backgroundColor: string;

    constructor(
        id: Uuid,
        type: WidgetType,
        humanRedableName: string,
        margin: Positions = {
            top: "0",
            bottom: "0",
            right: "0",
            left: "0",
        },
        padding: Positions = {
            top: "0",
            bottom: "0",
            right: "0",
            left: "0",
        },
        backgroundColor: string,
    ) {
        this.id = id;
        this.type = type;
        this.humanRedableName = humanRedableName;
        this.margin = margin;
        this.padding = padding;
        this.backgroundColor = backgroundColor;
    }

    static getHumanReadableName(): string {
        throw new Error("Not implemented");
    }

    static getLeftPanelComponent(): React.ReactNode {
        throw new Error("Not implemented");
    }

    abstract getComponent(
        droppedItemsDispatch: React.Dispatch<any>,
        items: Widgetinstance[],
    ): JSX.Element;

    handleClick(
        droppedItemsDispatch: React.Dispatch<any>,
        selectedId: Uuid,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) {
        event.stopPropagation();
        console.log("selecteion id from definition", selectedId);
        droppedItemsDispatch({
            type: "selected",
            payload: {selectedId: selectedId},
        });
    }
    abstract deepClone(): BaseWidget;
}
