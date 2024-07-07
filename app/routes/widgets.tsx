import {BaseWidget, Positions, WidgetType} from "./widgetDefinition";
import {TextComponent} from "~/components/textComponent";
import {ImageComponent} from "~/components/imageComponent";
import {VideoComponent} from "~/components/videoComponent";
import {OneDrop} from "~/components/oneDrop";
import {VerticalStack} from "~/components/verticalStacking";
import {HorizontalStacking} from "~/components/horizontalStacking";
import {TwoLayoutComponent} from "~/components/twoLayoutComponent";
import { Uuid } from "~/utilities/utilities";

export class TextWidget extends BaseWidget {
    content: string;

    constructor(
        id: Uuid,
        content: string,
        backgroundColor: string,
        margin: Positions,
        padding: Positions,
    ) {
        super(id, WidgetType.text, "Text", margin, padding, backgroundColor);
        this.content = content;
    }

    static getHumanReadableName(): string {
        return "Text Widget";
    }


    getComponent(
        droppedItemsDispatch: React.Dispatch<any>,
        items: Widgetinstance[],
    ): JSX.Element {
        return (
            <TextComponent
                handleClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => this.handleClick(droppedItemsDispatch, this.id, event)}
                color={this.backgroundColor}
                value={{
                    id: this.id,
                    content: this.content,
                    type: this.type,
                    margin: this.margin,
                    padding: this.padding,
                }}
                droppedItemsDispatch={droppedItemsDispatch}
            />
        );
    
    }

    deepClone(): TextWidget {
        return new TextWidget(
            this.id,
            this.content,
            this.backgroundColor,
            this.margin,
            this.padding,
        );
    }
}

export class ImageWidget extends BaseWidget {
    imageContent: {src: string};

    constructor(
        id: Uuid,
        content: {src: string},
        backgroundColor: string,
        margin: Positions,
        padding: Positions,
    ) {
        super(id, WidgetType.image, "Image", margin, padding, backgroundColor);
        this.imageContent = content;
    }

    static getHumanReadableName(): string {
        return "Image Widget";
    }

    getComponent(
        droppedItemsDispatch: React.Dispatch<any>,
        items: Widgetinstance[],
    ): JSX.Element {
        return (
            <ImageComponent
                color={this.backgroundColor}
                value={{
                    id: this.id,
                    content: this.imageContent,
                    type: this.type,
                    margin: this.margin,
                    padding: this.padding,
                }}
                handleClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => this.handleClick(droppedItemsDispatch, this.id, event)}
                droppedItemsDispatch={droppedItemsDispatch}
            />
        );
    }

    deepClone(): ImageWidget {
        return new ImageWidget(
            this.id,
            {...this.imageContent},
            this.backgroundColor,
            this.margin,
            this.padding,
        );
    }
}

export class VideoWidget extends BaseWidget {
    videoContent: {src: string};

    constructor(
        id: Uuid,
        content: {src: string},
        backgroundColor: string,
        margin: Positions,
        padding: Positions,
    ) {
        super(id, WidgetType.video, "Video", margin, padding, backgroundColor);
        this.videoContent = content;
    }

    static getHumanReadableName(): string {
        return "Video Widget";
    }

    getComponent(
        droppedItemsDispatch: React.Dispatch<any>,
        items: Widgetinstance[],
    ): JSX.Element {
        return (
            <VideoComponent
                color={this.backgroundColor}
                handleClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => this.handleClick(droppedItemsDispatch, this.id, event)}
                value={{
                    id: this.id,
                    content: this.videoContent,
                    type: this.type,
                    margin: this.margin,
                    padding: this.padding,
                }}
                droppedItemsDispatch={droppedItemsDispatch}
            />
        );
    }

    deepClone(): VideoWidget {
        return new VideoWidget(
            this.id,
            {...this.videoContent},
            this.backgroundColor,
            this.margin,
            this.padding,
        );
    }
}

export class OneDropLayout extends BaseWidget {
    children: Widgetinstance[] | null;

    constructor(
        id: Uuid,
        children: Widgetinstance[] | null,
        backgroundColor: string,
        margin: Positions,
        padding: Positions,
    ) {
        super(
            id,
            WidgetType.oneDropLayout,
            "OneDrop Layout",
            margin,
            padding,
            backgroundColor,
        );
        this.children = children;
    }

    static getHumanReadableName(): string {
        return "One Drop Layout";
    }

    getComponent(
        droppedItemsDispatch: React.Dispatch<any>,
        items: Widgetinstance[],
    ): JSX.Element {
        return (
            <OneDrop
                color={"#1ECBE1"}
                droppedItemsDispatch={droppedItemsDispatch}
                items={items}
                parentId={this.id}
                parentType={this.type}
                handleClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => this.handleClick(droppedItemsDispatch, this.id, event)}
            />
        );
    }

    deepClone(): OneDropLayout {
        return new OneDropLayout(
            this.id,
            this.children
                ? this.children.map((child) => child.deepClone())
                : null,
            this.backgroundColor,
            this.margin,
            this.padding,
        );
    }
}

export class OneColumnLayout extends BaseWidget {
    children: Widgetinstance[] | null;

    constructor(
        id: Uuid,
        children: Widgetinstance[] | null,
        backgroundColor: string,
        margin: Positions,
        padding: Positions,
    ) {
        super(
            id,
            WidgetType.oneColumnLayout,
            "OneColumn Layout",
            margin,
            padding,
            backgroundColor,
        );
        this.children = children;
    }

    static getHumanReadableName(): string {
        return "One Column Layout";
    }

    getComponent(
        droppedItemsDispatch: React.Dispatch<any>,
        items: Widgetinstance[],
    ): JSX.Element {
        return (
            <VerticalStack
                color={"#372952"}
                droppedItemsDispatch={droppedItemsDispatch}
                items={items}
                parentId={this.id}
                parentType={this.type}
                handleClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => this.handleClick(droppedItemsDispatch, this.id, event)}
            />
        );
    }

    deepClone(): OneColumnLayout {
        return new OneColumnLayout(
            this.id,
            this.children
                ? this.children.map((child) => child.deepClone())
                : null,
            this.backgroundColor,
            this.margin,
            this.padding,
        );
    }
}

export class TwoColumnLayout extends BaseWidget {
    leftChildren: Widgetinstance[] | null;
    rightChildren: Widgetinstance[] | null;

    constructor(
        id: Uuid,
        leftChildren: Widgetinstance[] | null,
        rightChildren: Widgetinstance[] | null,
        backgroundColor: string,
        margin: Positions,
        padding: Positions,
    ) {
        super(
            id,
            WidgetType.twoColumnLayout,
            "Two Layout",
            margin,
            padding,
            backgroundColor,
        );
        this.leftChildren = leftChildren;
        this.rightChildren = rightChildren;
    }

    static getHumanReadableName(): string {
        return "Two Column Layout";
    }

    getComponent(
        droppedItemsDispatch: React.Dispatch<any>,
        items: Widgetinstance[],
    ): JSX.Element {
        return (
            <TwoLayoutComponent
                color={"#0D0506"}
                droppedItemsDispatch={droppedItemsDispatch}
                items={items}
                parentId={this.id}
                handleClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => this.handleClick(droppedItemsDispatch, this.id, event)}
            />
        );
    }

    deepClone(): TwoColumnLayout {
        return new TwoColumnLayout(
            this.id,
            this.leftChildren
                ? this.leftChildren.map((child) => child.deepClone())
                : null,
            this.rightChildren
                ? this.rightChildren.map((child) => child.deepClone())
                : null,
            this.backgroundColor,
            this.margin,
            this.padding,
        );
    }
}

export class Carousel extends BaseWidget {
    children: Widgetinstance[] | null;

    constructor(
        id: Uuid,
        children: Widgetinstance[] | null,
        backgroundColor: string,
        margin: Positions,
        padding: Positions,
    ) {
        super(
            id,
            WidgetType.carousel,
            "Carousel",
            margin,
            padding,
            backgroundColor,
        );
        this.children = children;
    }

    static getHumanReadableName(): string {
        return "Carousel Layout";
    }

    getComponent(
        droppedItemsDispatch: React.Dispatch<any>,
        items: Widgetinstance[],
    ): JSX.Element {
        return (
            <HorizontalStacking
                color={"#ECA31C"}
                droppedItemsDispatch={droppedItemsDispatch}
                items={items}
                parentId={this.id}
                parentType={this.type}
                handleClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => this.handleClick(droppedItemsDispatch, this.id, event)}
            />
        );
    }

    deepClone(): Carousel {
        return new Carousel(
            this.id,
            this.children
                ? this.children.map((child) => child.deepClone())
                : null,
            this.backgroundColor,
            this.margin,
            this.padding,
        );
    }
}

export type NormalizedWidgetsState = {
    derivedState: {[key: Uuid]: Widgetinstance};
    widgets: Widgetinstance[];
    selectedWidgetId: Uuid | null;
};

// TODO: This will be removed
export type Widget =
    | typeof TextWidget
    | typeof ImageWidget
    | typeof VideoWidget
    | typeof OneDropLayout
    | typeof OneColumnLayout
    | typeof TwoColumnLayout
    | typeof Carousel;
export type Widgetinstance =
    | TextWidget
    | ImageWidget
    | VideoWidget
    | OneDropLayout
    | OneColumnLayout
    | TwoColumnLayout
    | Carousel;

type DropPayload = {
    item: Widgetinstance;
    index?: number;
    parentId?: Uuid;
    parentType?: WidgetType;
    childType?: string;
};

type ReorderPayload = {
    item: Widgetinstance;
    index?: number;
    parentId?: Uuid;
    parentType?: WidgetType;
    childType?: string;
    fromIndex: number;
    toIndex: number;
};

type SelectPayload = {
    selectedId: Uuid;
};
type EditContentPayload = {
    content: string;
    type: WidgetType;
};

type EditMarginAndPadddingPayload = {
    margin?: Positions;
    padding?: Positions;
};
type SetBackgroundColorPayload = {
    color: string;
    colors: {[key: string]: string};
};
type DeleteWidgetPayload = {
    selectedId: Uuid;
};

export type DropAction = {
    type: "dropped";
    payload: DropPayload;
};

export type ReorderAction = {
    type: "reorder";
    payload: ReorderPayload;
};

export type SelectAction = {
    type: "selected";
    payload: SelectPayload;
};

export type EditContent = {
    type: "editContent";
    payload: EditContentPayload;
};

export type EditMarginAndPaddding = {
    type: "editMarginAndPadding";
    payload: EditMarginAndPadddingPayload;
};

export type SetBackgroundColor = {
    type: "setBackgroundColor";
    payload: SetBackgroundColorPayload;
};

export type DeleteWidget = {
    type: "deleteWidget";
    payload: DeleteWidgetPayload;
};

export type Action =
    | DropAction
    | ReorderAction
    | SelectAction
    | EditContent
    | EditMarginAndPaddding
    | SetBackgroundColor
    | DeleteWidget;

export const allWidgets = [
    TextWidget,
    ImageWidget,
    VideoWidget,
    OneColumnLayout,
    OneDropLayout,
    TwoColumnLayout,
    Carousel,
];

export const allElementWidgets = [TextWidget, ImageWidget, VideoWidget];

export const allLayoutWidgets = [
    OneColumnLayout,
    OneDropLayout,
    TwoColumnLayout,
    Carousel,
];
