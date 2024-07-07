import {useEffect, useReducer, useState} from "react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {droppedItemsReducer, initialState} from "./state";
import {DragTypes} from "./widgetDefinition";

import {Plus} from "react-bootstrap-icons";
import LeftWidgetComponent from "~/components/leftWidgetComponent";
import {
    GlobalVariablesProvider,
    useGlobalVariables,
} from "~/context/GlobalVariablesContext";
import LeftPane from "./leftPanel";
import RightPane from "./rightPanel";
import { Button } from "@mantine/core";
import CodeGeneratorFunction from "./codeGenerator";
import { Carousel, ImageWidget, OneColumnLayout, OneDropLayout, TextWidget, TwoColumnLayout, VideoWidget, Widget, Widgetinstance } from "./widgets";
import { generateUuid } from "~/utilities/utilities";

export default function () {
    const [droppedItems, droppedItemsDispatch] = useReducer(
        droppedItemsReducer,
        initialState,
    );
    console.log("dropped items", droppedItems.widgets)
    CodeGeneratorFunction(droppedItems.widgets, droppedItems.derivedState);
    
    const handleCodeGenerate = () => {
        CodeGeneratorFunction(droppedItems.widgets, droppedItems.derivedState);
    }

    const handleDrop = (WidgetClass: Widget, index?: number): void => {
        const item: Widgetinstance = createWidgetInstance(WidgetClass);
        console.log("I am called handleDrop", index);
        droppedItemsDispatch({type: "dropped", payload: {item, index}});
    };

    return (
        <GlobalVariablesProvider>
            <DndProvider backend={HTML5Backend}>
                <div className="tw-min-h-screen tw-grid tw-grid-flow-col tw-grid-cols-5">
                    <div className=" tw-col-span-1">
                        <LeftPane droppedItems={droppedItems.widgets} />
                        {/* <Button onClick={handleCodeGenerate}>Code</Button> */}
                    </div>
                    <DroppableArea
                        handleDrop={handleDrop}
                        items={droppedItems.widgets}
                        droppedItemsDispatch={droppedItemsDispatch}
                    />
                    <div className=" tw-col-span-1">
                        <RightPane
                            droppedItems={droppedItems}
                            droppedItemsDispatch={droppedItemsDispatch}
                        />
                    </div>
                </div>
            </DndProvider>
        </GlobalVariablesProvider>
    );
}

export function NewWidgetDraggables({WidgetClass}: {WidgetClass: Widget}) {
    const [{isDragging}, dragRef] = useDrag(() => ({
        type: DragTypes.newItem,
        item: {widgetClass: WidgetClass},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={dragRef}
            style={{opacity: isDragging ? 0.4 : 1}}
            className=" tw-text-[#fff] tw-font-semibold  tw-cursor-copy tw-w-full tw-text-center"
        >
            <LeftWidgetComponent WidgetClass={WidgetClass} />
        </div>
    );
}

function DroppableArea({
    handleDrop,
    items,
    droppedItemsDispatch,
}: {
    handleDrop: (WidgetClass: Widget, index?: number) => void;
    items: Widgetinstance[];
    droppedItemsDispatch: React.Dispatch<any>;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [{isOver}, dropRef] = useDrop({
        accept: [DragTypes.newItem, DragTypes.moving],
        drop: (
            item: {widgetClass?: Widget; index?: number; id?: string},
            monitor,
        ) => {
            if (monitor.getItemType() === DragTypes.newItem) {
                handleDrop(item.widgetClass!);
            }
        },
        hover: () => setIsHovered(true),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            className={`tw-w-full tw-relative tw-bg-[#C4C4C4] tw-min-h-full tw-p-4 tw-overflow-y-auto tw-col-span-3  ${
                items.length === 0
                    ? " tw-flex tw-items-center tw-justify-center"
                    : ""
            } `}
        >
            {items.map((item, index) => (
                <DroppableZone
                    key={item.id}
                    index={index}
                    handleDrop={handleDrop}
                    item={item}
                    items={items}
                    droppedItemsDispatch={droppedItemsDispatch}
                />
            ))}
            {items.length === 0 ? (
                <div
                    ref={dropRef}
                    className={`tw-w-full tw-h-full tw-border-2 tw-border-dashed  tw-flex tw-items-center tw-justify-center ${
                        isOver
                            ? "tw-border-blue-600 tw-text-blue-600"
                            : "tw-border-[#383838] tw-text-[#383838]"
                    }`}
                >
                    <div className=" tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-semibold tw-bg-blue-200 tw-px-3 tw-py-1 tw-rounded-sm">
                        <Plus size="30" />
                        Drop a Layout
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <div
                            className={`tw-h-1 tw-mt-2 tw-rounded-lg  ${
                                isOver
                                    ? " tw-block tw-bg-[#0d0199]"
                                    : " tw-hidden"
                            }`}
                        ></div>
                        <div
                            ref={dropRef}
                            className={` tw-inset-0 tw-py-3 tw-w-full tw-h-[50px] tw-text-center tw-bottom-2`}
                        ></div>
                    </div>
                </>
            )}
        </div>
    );
}

function DroppableZone({
    handleDrop,
    index,
    item,
    items,
    droppedItemsDispatch,
}: {
    handleDrop: (WidgetClass: Widget, index?: number) => void;
    index: number;
    item: Widgetinstance;
    items: Widgetinstance[];
    droppedItemsDispatch: React.Dispatch<any>;
}) {
    let newItem = deepCloneWithPrototype(item);

    const [{isDragging}, dragRef] = useDrag({
        type: DragTypes.moving,
        item: {index, ...newItem},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const [{isOver, canDrop}, dropRef] = useDrop({
        accept: [DragTypes.newItem, DragTypes.moving],
        drop: (
            draggedItem: {widgetClass?: Widget; index?: number; id?: string},
            monitor,
        ) => {
            if (monitor.getItemType() === DragTypes.newItem) {
                handleDrop(draggedItem.widgetClass!, index);
            } else if (monitor.getItemType() === DragTypes.moving) {
                droppedItemsDispatch({
                    type: "reorder",
                    payload: {
                        fromIndex: draggedItem.index!,
                        toIndex: index,
                    },
                });
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });

    const Component = newItem.getComponent(droppedItemsDispatch, items);
    console.log("dropped Component", Component)
    if (!Component) return null;

    return (
        <div className={`tw-relative ${isOver && canDrop ? "" : ""}`}>
            <div ref={dragRef}>
                <div
                    className={`tw-h-1 tw-rounded-lg tw-mb-2  ${
                        isOver ? " tw-block tw-bg-[#0d0199]" : " tw-hidden"
                    }`}
                ></div>
                <div
                    ref={dropRef}
                    className={`tw-absolute tw-inset-0 tw-py-4 tw-w-[100%] tw-h-[10%] tw-text-center tw-z-20   `}
                ></div>
                {Component}
            </div>
        </div>
    );
}

export function createWidgetInstance(WidgetClass: Widget): any {
    switch (WidgetClass) {
        case TextWidget:
            return new TextWidget(generateUuid(), "Sample Text");
        case ImageWidget:
            return new ImageWidget(generateUuid(), {src: ""});
        case VideoWidget:
            return new VideoWidget(generateUuid(), {src: ""});
        case TwoColumnLayout:
            return new TwoColumnLayout(generateUuid(), [], []);
        case OneColumnLayout:
            return new OneColumnLayout(generateUuid(), []);
        case Carousel:
            return new Carousel(generateUuid(), []);
        case OneDropLayout:
            return new OneDropLayout(generateUuid(), null);
        default:
            throw new Error("Unhandled widget type");
    }
}
const deepCloneWithPrototype = (obj: any): any => {
    if (obj === null || typeof obj !== "object") return obj;
    const copy = Object.create(Object.getPrototypeOf(obj));
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCloneWithPrototype(obj[key]);
        }
    }
    return copy;
};
