import React from "react";
import { Plus } from "react-bootstrap-icons";
import {useDrag, useDrop} from "react-dnd";
import { createWidgetInstance } from "~/routes/_index";
import { DragTypes, WidgetType } from "~/routes/widgetDefinition";
import { Widget, Widgetinstance } from "~/routes/widgets";
import { Uuid } from "~/utilities/utilities";


type OneDropProps = {
    color: string;
    droppedItemsDispatch: React.Dispatch<any>;
    items: Widgetinstance[];
    parentId: Uuid;
    parentType: WidgetType;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export function OneDrop({
    color,
    droppedItemsDispatch,
    items,
    parentId,
    parentType,
    handleClick,
}: OneDropProps) {
    console.log("I have been called from One Drop", items);

    const handleDrop = (WidgetClass: Widget, index?: number): void => {
        const item = createWidgetInstance(WidgetClass);
        droppedItemsDispatch({
            type: "dropped",
            payload: {item, parentId, parentType, index},
        });
    };

    const renderElement = items.find(
        (item: Widgetinstance) => item.id === parentId,
    );
    if (!renderElement || renderElement.type !== WidgetType.oneDropLayout) {
        return null;
    }

    console.log("render Element", renderElement);

    return (
        <div
            style={{backgroundColor: color}}
            onClick={handleClick}
            className={`tw-w-full  tw-grid tw-min-h-[200px] `}
        >
            <DroppableArea
                handleDrop={handleDrop}
                items={renderElement.children || []}
                droppedItemsDispatch={droppedItemsDispatch}
            />
        </div>
    );
}

type DroppableAreaProps = {
    handleDrop: (WidgetClass: Widget, index?: number) => void;
    items: Widgetinstance[];
    droppedItemsDispatch: React.Dispatch<any>;
};

function DroppableArea({
    handleDrop,
    items,
    droppedItemsDispatch,
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
        <div
            className={`tw-min-w-[300px] tw-w-full tw-relative tw-bg-[#C4C4C4] tw-h-full tw-col-span-3 hover:tw-border-2 hover:tw-border-solid hover:tw-border-blue-600
           ${
                isOver
                    ? "tw-bg-blue-200 tw-text-blue-600 tw-p-4"
                    : "tw-border-[#383838] tw-text-[#383838]"
            }`}
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
            {items.length === 0 &&                 
                <div
                    ref={dropRef}
                    className={`tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-border-solid tw-border-2`}
                >
                    <div className=" tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-semibold tw-bg-blue-200 tw-px-3 tw-py-1 tw-rounded-sm">
                        <Plus size="30" />
                        Drop a Layout
                    </div>
                </div>
            }
        </div>
    );
}

type DroppableZoneProps = {
    handleDrop: (WidgetClass: Widget, index?: number) => void;
    index: number;
    item: Widgetinstance;
    items: Widgetinstance[];
    droppedItemsDispatch: React.Dispatch<any>;
};

function DroppableZone({
    handleDrop,
    index,
    item,
    items,
    droppedItemsDispatch,
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
                    payload: {fromIndex: draggedItem.index!, toIndex: index},
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
        <div
            className={`tw-relative ${
                isOver && canDrop ? "tw-bg-blue-200" : ""
            }`}
        >
            <div ref={dragRef}>
                <div
                    className={`tw-absolute  tw-h-1 tw-mt-2 tw-rounded-lg tw-w-full tw-text-center ${
                        isOver ? " tw-bg-[#0d0199]" : " tw-hidden "
                    }`}
                ></div>
                <div
                    className={`tw-absolute  tw-h-[20%] tw-w-full tw-text-center   `}
                ></div>
                {Component}
            </div>
        </div>
    );
}
