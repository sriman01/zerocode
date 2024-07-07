import {Group, NativeSelect, Select, TextInput, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import AddGlobalVariable from "~/components/addGlobalVariables";
import {useGlobalVariables} from "~/context/GlobalVariablesContext";
import {Positions} from "./widgetDefinition";
import { NormalizedWidgetsState } from "./widgets";

export default function RightPane({
    droppedItems,
    droppedItemsDispatch,
}: {
    droppedItems: NormalizedWidgetsState;
    droppedItemsDispatch: React.Dispatch<any>;
}) {
    const [content, setContent] = useState("");
    const [color, setColor] = useState("");
    const [margin, setMargin] = useState<Positions>({
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
    });
    const [padding, setPadding] = useState<Positions>({
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
    });
    const {colors} = useGlobalVariables();
    const {derivedState, selectedWidgetId} = droppedItems;

    useEffect(() => {
        if (selectedWidgetId) {
            const selectedWidget = derivedState[selectedWidgetId];

            setContent(selectedWidget.content || "");
            setMargin(
                selectedWidget.margin || {
                    top: "0",
                    bottom: "0",
                    left: "0",
                    right: "0",
                },
            );
            setPadding(
                selectedWidget.padding || {
                    top: "0",
                    bottom: "0",
                    left: "0",
                    right: "0",
                },
            );
            setColor(selectedWidget.backgroundColor);
        }
    }, [selectedWidgetId]);
    useEffect(() => {
        selectedWidgetId !== null &&
            droppedItemsDispatch({
                type: "editContent",
                payload: {
                    content: content,
                    type: derivedState[selectedWidgetId].type,
                },
            });
        selectedWidgetId !== null &&
            droppedItemsDispatch({
                type: "editMarginAndPadding",
                payload: {margin: margin, padding: padding},
            });
    }, [content, margin, padding]);

    useEffect(() => {
        selectedWidgetId !== null &&
            droppedItemsDispatch({
                type: "setBackgroundColor",
                payload: {color: color, colors: colors},
            });
    }, [color, colors]);

    return (
        <div className=" tw-flex tw-flex-col tw-min-h-screen tw-bg-gray-900 tw-gap-4 tw-px-4 ">
            <div className=" tw-w-[100%]  tw-bg-gray-900">
                <AddGlobalVariable />
            </div>
            <div>
                {selectedWidgetId && (
                    <EditWidgets
                        content={content}
                        setContent={setContent}
                        margin={margin}
                        setMargin={setMargin}
                        colors={colors}
                        color={color}
                        setColor={setColor}
                        padding={padding}
                        setPadding={setPadding}
                    />
                )}
            </div>
        </div>
    );
}

export function EditWidgets({
    content,
    setContent,
    margin,
    setMargin,
    colors,
    color,
    setColor,
    padding,
    setPadding,
}: {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    margin: Positions;
    setMargin: React.Dispatch<React.SetStateAction<Positions>>;
    color: string;
    colors: {[key: string]: string};
    setColor: React.Dispatch<React.SetStateAction<string>>;
    padding: Positions;
    setPadding: React.Dispatch<React.SetStateAction<Positions>>;
}) {
    const handleMarginChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        position: keyof Positions,
    ) => {
        const value = e.target.value;
        setMargin((prevMargin) => ({
            ...prevMargin,
            [position]: value,
        }));
    };

    const handlePaddingChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        position: keyof Positions,
    ) => {
        const value = e.target.value;
        setPadding((prevPadding) => ({
            ...prevPadding,
            [position]: value,
        }));
    };
    return (
        <div className="tw-flex tw-gap-4 tw-flex-col">
            <div>
                <TextInput
                    width={500}
                    label="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div>
                <Title order={5}>Margin</Title>
                <Group wrap="wrap">
                    <TextInput
                        size="xs"
                        label="Top"
                        value={margin.top}
                        inputSize="1"
                        onChange={(e) => handleMarginChange(e, "top")}
                    />
                    <TextInput
                        size="xs"
                        label="Bottom"
                        value={margin.bottom}
                        inputSize="1"
                        onChange={(e) => handleMarginChange(e, "bottom")}
                    />
                    <TextInput
                        size="xs"
                        label="Left"
                        value={margin.left}
                        inputSize="1"
                        onChange={(e) => handleMarginChange(e, "left")}
                    />
                    <TextInput
                        size="xs"
                        label="Right"
                        value={margin.right}
                        inputSize="1"
                        onChange={(e) => handleMarginChange(e, "right")}
                    />
                </Group>
            </div>
            <div>
                <Title order={5}>Padding</Title>
                <Group wrap="wrap">
                    <TextInput
                        size="xs"
                        label="Top"
                        value={padding.top}
                        inputSize="1"
                        onChange={(e) => handlePaddingChange(e, "top")}
                    />
                    <TextInput
                        size="xs"
                        label="Bottom"
                        value={padding.bottom}
                        inputSize="1"
                        onChange={(e) => handlePaddingChange(e, "bottom")}
                    />
                    <TextInput
                        size="xs"
                        label="Left"
                        value={padding.left}
                        inputSize="1"
                        onChange={(e) => handlePaddingChange(e, "left")}
                    />
                    <TextInput
                        size="xs"
                        label="Right"
                        value={padding.right}
                        inputSize="1"
                        onChange={(e) => handlePaddingChange(e, "right")}
                    />
                </Group>
            </div>
            <div>
                <Select
                    label="Background Color"
                    placeholder="Choose from global variables"
                    value={color}
                    data={[...Object.keys(colors)]}
                    onChange={(_value, option) => setColor(_value)}
                />
                {/* <TextInput
                    width={500}
                    label="Custom"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                /> */}
            </div>
        </div>
    );
}
