import {Reorder} from "framer-motion";
import React, {useState} from "react";
import {Plus} from "react-bootstrap-icons";
import {useDrag, useDrop} from "react-dnd";
import { createWidgetInstance } from "~/routes/_index";
import { DragTypes, WidgetType } from "~/routes/widgetDefinition";
import { Widget, Widgetinstance } from "~/routes/widgets";
import { Uuid } from "~/utilities/utilities";


type VerticalStackProps = {
    color: string;
    droppedItemsDispatch: React.Dispatch<any>;
    items: Widgetinstance[];
    parentId: Uuid;
    parentType: WidgetType;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export function VerticalStack({
    color,
    droppedItemsDispatch,
    items,
    parentId,
    parentType,
    handleClick,
}: VerticalStackProps) {
    const handleDrop = (WidgetClass: Widget, index?: number): void => {
        const item = createWidgetInstance(WidgetClass);
        droppedItemsDispatch({
            type: "dropped",
            payload: {
                item,
                parentId,
                parentType,
                index,
            },
        });
    };

    const renderElement = items.find((item) => item.id === parentId);
    if (!renderElement || renderElement.type !== WidgetType.oneColumnLayout) {
        return null;
    }

    return (
        <div
            style={{backgroundColor: color}}
            className="tw-w-full tw-grid tw-min-h-[200px] "
            onClick={handleClick}
        >
            <DroppableArea
                handleDrop={handleDrop}
                items={renderElement.children || []}
                droppedItemsDispatch={droppedItemsDispatch}
                parentId={parentId}
            />
        </div>
    );
}

type DroppableAreaProps = {
    handleDrop: (WidgetClass: Widget, index?: number) => void;
    items: Widgetinstance[];
    droppedItemsDispatch: React.Dispatch<any>;
    parentId: Uuid | null;
};

function DroppableArea({
    handleDrop,
    items,
    droppedItemsDispatch,
    parentId,
}: DroppableAreaProps) {
    // const [anima, setAnima] = useState(Array.from(items.keys()));
    const [{isOver}, dropRef] = useDrop({
        accept: [DragTypes.newItem, DragTypes.moving],
        drop: (item: {widgetClass: Widget}, monitor) => {
            if (monitor.getItemType() === DragTypes.newItem) {
                handleDrop(item.widgetClass);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    return (
        <div
            className={`tw-min-w-[300px] tw-w-full tw-relative tw-bg-[#C4C4C4] tw-h-full  tw-overflow-y-auto tw-col-span-1 hover:tw-border-2 hover:tw-border-solid hover:tw-border-blue-600 ${
                isOver
                    ? "tw-bg-blue-200 tw-text-blue-600"
                    : " tw-text-[#383838]"
            }`}
        >
            {/* <Reorder.Group axis='y' values={anima} onReorder={setAnima}> */}
            {items.map((item, index) => (
                // <Reorder.Item key={item.id} value={index} >
                <DroppableZone
                    key={item.id}
                    index={index}
                    handleDrop={handleDrop}
                    item={item}
                    items={items}
                    droppedItemsDispatch={droppedItemsDispatch}
                    parentId={parentId}
                />
                // </Reorder.Item>
            ))}
            {/* </Reorder.Group> */}
            {items.length === 0 ? (
                <div
                    ref={dropRef}
                    className={`tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-border-solid tw-border-2`}
                >
                    <div className=" tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-semibold tw-bg-blue-200 tw-px-3 tw-py-1 tw-rounded-sm">
                        <Plus size="30" />
                        Drop a Layout
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className={`tw-h-[100%] tw-inset-0  tw-rounded-lg tw-z-20  ${
                            isOver
                                ? "tw-absolute tw-bg-[#0d0199] tw-opacity-15"
                                : " tw-hidden"
                        }`}
                    ></div>
                    <div
                        ref={dropRef}
                        className={`tw-absolute tw-h-5 tw-w-full tw-text-center tw-bottom-0 tw-z-30 `}
                    ></div>
                </>
            )}
        </div>
    );
}

type DroppableZoneProps = {
    handleDrop: (WidgetClass: Widget, index?: number) => void;
    index: number;
    item: Widgetinstance;
    items: Widgetinstance[];
    droppedItemsDispatch: React.Dispatch<any>;
    parentId: Uuid | null;
};

function DroppableZone({
    handleDrop,
    index,
    item,
    items,
    droppedItemsDispatch,
    parentId,
}: DroppableZoneProps) {
    const [{isDragging}, dragRef] = useDrag({
        type: DragTypes.moving,
        item: {index, ...item},
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
                        parentId,
                    },
                });
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });

    if (item == null) {
        return;
    }

    const Component = item.getComponent(droppedItemsDispatch, items);
    return (
        <div className={`tw-relative ${isOver && canDrop ? "" : ""}`}>
            <div ref={dragRef}>
                <div
                    className={`tw-absolute tw-z-30  tw-h-1 tw-top-2 tw-rounded-lg tw-w-full tw-text-center   ${
                        isOver ? " tw-bg-[#0d0199]" : " tw-hidden "
                    }`}
                ></div>
                <div
                    ref={dropRef}
                    className={` tw-top-4 tw-absolute tw-h-[30px] tw-w-full tw-text-cente tw-z-20   `}
                ></div>
                {Component}
            </div>
        </div>
    );
}
