import React from "react";
import {Plus} from "react-bootstrap-icons";
import {useDrag, useDrop} from "react-dnd";
import { createWidgetInstance } from "~/routes/_index";
import { DragTypes, WidgetType } from "~/routes/widgetDefinition";
import { Widget, Widgetinstance } from "~/routes/widgets";
import { Uuid } from "~/utilities/utilities";


interface TwoColumnLayoutProps {
    color: string;
    droppedItemsDispatch: React.Dispatch<any>;
    items: Widgetinstance[];
    parentId: Uuid;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export function TwoLayoutComponent({
    color,
    droppedItemsDispatch,
    items,
    parentId,
    handleClick,
}: TwoColumnLayoutProps) {
    const renderElement = items.find((item) => item.id === parentId);
    if (!renderElement || renderElement.type !== WidgetType.twoColumnLayout) {
        return null;
    }

    return (
        <div
            style={{backgroundColor: color}}
            className="tw-min-w-[200px] tw-w-full tw-grid tw-grid-cols-2  tw-min-h-[200px]"
            onClick={handleClick}
        >
            <ColumnArea
                color="#33ffff"
                droppedItemsDispatch={droppedItemsDispatch}
                items={renderElement.leftChildren || []}
                parentId={parentId}
                childType="left"
            />
            <ColumnArea
                color="#ffff33"
                droppedItemsDispatch={droppedItemsDispatch}
                items={renderElement.rightChildren || []}
                parentId={parentId}
                childType="right"
            />
        </div>
    );
}

interface ColumnAreaProps {
    color: string;
    droppedItemsDispatch: React.Dispatch<any>;
    items: Widgetinstance[];
    parentId: Uuid;
    childType: string;
}

function ColumnArea({
    color,
    droppedItemsDispatch,
    items,
    parentId,
    childType,
}: ColumnAreaProps) {
    const handleDrop = (WidgetClass: Widget, index?: number): void => {
        const item = createWidgetInstance(WidgetClass);
        const temp =
            childType === "left" ? item.leftChildren : item.rightChildren;
        droppedItemsDispatch({
            type: "dropped",
            payload: {
                item,
                parentId,
                parentType: WidgetType.twoColumnLayout,
                index,
                childType,
            },
        });
    };

    return (
        <div
            style={{backgroundColor: color}}
            className="tw-w-full tw-grid"
        >
            <DroppableArea
                handleDrop={handleDrop}
                items={items}
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
    console.log("items", items);

    return (
        <div className={`tw-min-w-[300px] tw-w-full tw-relative tw-bg-[#C4C4C4] tw-h-full tw-overflow-y-auto tw-col-span-3 hover:tw-border-2 hover:tw-border-solid hover:tw-border-blue-600`}>
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
            {items.length === 0 && (
                <div
                    ref={dropRef}
                    className={`tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-border-solid tw-border-2`}
                >
                    <div className=" tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-semibold tw-bg-blue-200 tw-px-3 tw-py-1 tw-rounded-sm tw-text-gray-800 tw-text-opacity-90">
                        <Plus size="30" />
                        Drop a Layout
                    </div>
                </div>
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
                        parentId: parentId,
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
        return null;
    }

    const Component = item.getComponent(droppedItemsDispatch, items);
    return (
        <div
            className={`tw-relative  ${isOver && canDrop ? "tw-bg-blue-200" : ""}`}>
            <div ref={dragRef}>
                <div className={`tw-h-1 tw-rounded-lg  ${isOver ? " tw-block tw-bg-[#0d0199]" : " tw-hidden"}`}></div>
                {Component}
            </div>
        </div>
    );
}
