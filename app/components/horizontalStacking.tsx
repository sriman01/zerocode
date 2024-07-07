import {Reorder} from "framer-motion";
import React, {useState} from "react";
import {Plus} from "react-bootstrap-icons";
import {useDrag, useDrop} from "react-dnd";
import { createWidgetInstance } from "~/routes/_index";
import { DragTypes, WidgetType } from "~/routes/widgetDefinition";
import { Widget, Widgetinstance } from "~/routes/widgets";
import { Uuid } from "~/utilities/utilities";


interface HorizontalStackingProps {
    color: string;
    droppedItemsDispatch: React.Dispatch<any>;
    items: Widgetinstance[];
    parentId: Uuid;
    parentType: WidgetType;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export function HorizontalStacking({
    color,
    droppedItemsDispatch,
    items,
    parentId,
    parentType,
    handleClick,
}: HorizontalStackingProps) {
    const handleDrop = (WidgetClass: Widget, index?: number): void => {
        const item = createWidgetInstance(WidgetClass);
        droppedItemsDispatch({
            type: "dropped",
            payload: {item, parentId, parentType, index},
        });
    };

    const renderElement = items.find((item) => item.id === parentId);
    if (!renderElement || renderElement.type !== WidgetType.carousel) {
        return null;
    }

    return (
        <div
            // style={{backgroundColor: color}}
            className="tw-w-full tw-grid tw-min-h-[200px]"
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

interface DroppableAreaProps {
    handleDrop: (WidgetClass: Widget, index?: number) => void;
    items: Widgetinstance[];
    droppedItemsDispatch: React.Dispatch<any>;
    parentId: Uuid | null;
}

function DroppableArea({
    handleDrop,
    items,
    droppedItemsDispatch,
    parentId,
}: DroppableAreaProps) {
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
        <div className={`tw-min-w-[300px] tw-w-full tw-grid tw-grid-flow-col  tw-relativetw-bg-[#C4C4C4] tw-h-auto tw-min-h-full tw-overflow-y-auto tw-col-span-3 hover:tw-border-2 hover:tw-border-solid hover:tw-border-blue-600 ${items.length !== 0 && 'tw-auto-cols-max'}`}>
            {items.map((item, index) => (
                <DroppableZone
                    key={item.id}
                    index={index}
                    handleDrop={handleDrop}
                    item={item}
                    items={items}
                    droppedItemsDispatch={droppedItemsDispatch}
                    parentId={parentId}
                />
            ))}
            {items.length === 0 ? (
                <div
                    ref={dropRef}
                    className={`tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-border-solid tw-border-2`}
                >
                    <div className=" tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-semibold tw-bg-blue-200 tw-px-3 tw-py-1 tw-rounded-sm tw-text-gray-800 tw-text-opacity-90">
                        <Plus size="30" />
                        Drop a Layout
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className={`tw-h-full tw-w-1 tw-rounded-lg  ${
                            isOver ? " tw-block tw-bg-[#0d0199]" : " tw-hidden"
                        }`}
                    ></div>
                    <div
                        ref={dropRef}
                        className={` tw-h-full tw-py-2 tw-w-[10px] tw-text-center tw-bg-blue-600`}
                    ></div>
                </>
            )}
        </div>
    );
}

interface DroppableZoneProps {
    handleDrop: (WidgetClass: Widget, index?: number) => void;
    index: number;
    item: Widgetinstance;
    items: Widgetinstance[];
    droppedItemsDispatch: React.Dispatch<any>;
    parentId: Uuid | null;
}

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
                console.log("from dropzone", index);
                handleDrop(draggedItem.widgetClass!, index);
            } else if (monitor.getItemType() === DragTypes.moving) {
                console.log(
                    "reordering item from",
                    draggedItem.index,
                    "to",
                    index,
                );
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
        <div className={`tw-relative`}>
            <div
                ref={dragRef}
                className=" tw-flex"
            >
                <div>
                    <div
                        className={`tw-h-full tw-w-1 tw-rounded-lg  ${
                            isOver ? " tw-block tw-bg-[#0d0199]" : " tw-hidden"
                        }`}
                    ></div>
                    <div
                        ref={dropRef}
                        className={`tw-absolute tw-inset-0 tw-px-4 tw-w-[20%] tw-h-full tw-text-center tw-left-0  `}
                    ></div>
                </div>
                {Component}
            </div>
        </div>
    );
}
