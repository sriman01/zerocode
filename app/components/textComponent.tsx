import {Positions, WidgetType} from "~/routes/widgetDefinition";
import React from "react";
import {Trash} from "react-bootstrap-icons";
import {useGlobalVariables} from "~/context/GlobalVariablesContext";
import { Uuid } from "~/utilities/utilities";

export function TextComponent({
    handleClick,
    color,
    value,
    droppedItemsDispatch,
}: {
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    color: string;
    value: {
        id: Uuid;
        content: string;
        type: WidgetType;
        margin: Positions;
        padding: Positions;
    };
    droppedItemsDispatch: React.Dispatch<any>;
}) {
    const {colors} = useGlobalVariables();
    const {margin, padding} = value;
    const {
        top: marginTop,
        bottom: marginBottom,
        left: marginLeft,
        right: marginRight,
    } = margin;
    const {
        top: paddingTop,
        bottom: paddingBottom,
        left: paddingLeft,
        right: paddingRight,
    } = padding;
    console.log("colorText", color);

    return (
        <div
            onClick={handleClick}
            style={{
                backgroundColor: color !== undefined ? colors[color] : "#fff",
                marginTop: `${marginTop}px`,
                marginBottom: `${marginBottom}px`,
                marginRight: `${marginRight}px`,
                marginLeft: `${marginLeft}px`,
                paddingTop: `${paddingTop}px`,
                paddingBottom: `${paddingBottom}px`,
                paddingRight: `${paddingRight}px`,
                paddingLeft: `${paddingLeft}px`,
            }}
            className={`tw-relative tw-min-w-[300px] tw-w-full tw-grid  tw-min-h-[100px] tw-text-wrap tw-text-3xl tw-font-bold tw-text-gray-700 hover:tw-border-2 hover:tw-border-solid hover:tw-border-blue-600`}
        >
            <div
                className={`tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center`}
            >
                {value.content}
            </div>
            <div
                className=" tw-absolute tw-z-30 tw-right-1 tw-top-1 tw-text-2xl tw-cursor-pointer tw-text-red-600 tw-opacity-0 hover:tw-opacity-100 "
                onClick={(e) => {
                    e.stopPropagation();
                    droppedItemsDispatch({
                        type: "deleteWidget",
                        payload: {selectedId: value.id},
                    });
                }}
            >
                <Trash />
            </div>
        </div>
    );
}
