import { VideoSvg } from "./svgContainer";
import { Trash } from "react-bootstrap-icons";
import { Positions, WidgetType } from "~/routes/widgetDefinition";
import { useGlobalVariables } from "~/context/GlobalVariablesContext";
import { Uuid } from "~/utilities/utilities";

export function VideoComponent({
    color,
    handleClick,
    value,
    droppedItemsDispatch
}: {
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    color: string;
    value: {
        id: Uuid;
        content: {src: string};
        type: WidgetType;
        margin: Positions;
        padding: Positions;
    };
    droppedItemsDispatch: React.Dispatch<any>;
}) {
    const {colors} = useGlobalVariables();
    const { content } = value;
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
    console.log(padding);
    return (
        <div
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
            className="tw-w-full tw-grid tw-justify-items-center tw-content-center tw-min-h-[200px] tw-min-w-[300px] hover:tw-border-2 hover:tw-border-solid hover:tw-border-blue-600"
            onClick={handleClick}
        >
            {content.src === '' ? 
                <div className="tw-max-w-[150px] tw-max-h-[150px] tw-flex tw-justify-center tw-items-center">
                    <VideoSvg /> 
                </div> : 
                <div className="tw-flex tw-justify-center tw-items-center tw-h-full tw-w-full">
                    <video src={content.src} className="tw-w-full w-object-cover tw-bg-no-repeat " controls>
                        Your browser does not support the video tag.
                    </video>
                </div>}
            <div
                className=" tw-absolute tw-z-30 tw-right-1 tw-top-1 tw-text-2xl tw-cursor-pointer tw-text-red-600 tw-opacity-0 hover:tw-opacity-100 "
                onClick={(e) => {
                    e.stopPropagation()
                    droppedItemsDispatch({ type: "deleteWidget", payload: { selectedId: value.id } })
                }}
            >
                <Trash />
            </div>
        </div>
    );
}
