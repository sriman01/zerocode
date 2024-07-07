import React, {useState} from "react";
import {
    Button,
    TextInput,
    Box,
    List,
    ListItem,
    ColorInput,
    Select,
} from "@mantine/core";
import {useGlobalVariables} from "~/context/GlobalVariablesContext";
import {ColorFormat} from "node_modules/@mantine/core/lib/components/ColorPicker/ColorPicker.types";
import {Pencil} from "react-bootstrap-icons";

const AddGlobalVariable = () => {
    const {colors, setColors} = useGlobalVariables();
    const [format, setFormat] = useState<ColorFormat>("hex");
    const [key, setKey] = useState("");
    const [color, setColor] = useState("#ffffff");
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const handleAddVariable = () => {
        if (key) {
            setColors({...colors, [key]: color});
            setKey("");
            setColor("#ffffff");
            setEditingKey(null);
        }
    };

    const handleEditVariable = (key: string) => {
        setKey(key);
        setColor(colors[key]);
        setEditingKey(key);
    };

    const handleUpdateVariable = () => {
        if (editingKey) {
            const updatedColors = {...colors, [key]: color};
            if (key !== editingKey) {
                delete updatedColors[editingKey];
            }
            setColors(updatedColors);
            setKey("");
            setColor("#ffffff");
            setEditingKey(null);
        }
    };

    const handleCancelEdit = () => {
        setKey("");
        setColor("#ffffff");
        setEditingKey(null);
    };

    return (
        <Box>
            <TextInput
                label="Key"
                value={key}
                onChange={(event) => setKey(event.currentTarget.value)}
                placeholder="Enter variable key"
            />
            <Box mt="md">
                <ColorInput
                    defaultValue="#C5D899"
                    format={format}
                    value={color}
                    onChange={setColor}
                />
                <Select
                    label="Choose Format"
                    placeholder="Pick value"
                    data={["rgb", "rgba", "hex", "hexa", "hsl", "hsla"]}
                    value={format}
                    onChange={setFormat}
                />
            </Box>
            {editingKey ? (
                <div className=" tw-flex tw-gap-4">
                    <Button
                        className=" tw-mr-2"
                        mt="md"
                        color="gray"
                        onClick={handleUpdateVariable}
                    >
                        Update Variable
                    </Button>
                    <Button
                        mt="md"
                        variant="outline"
                        color="gray"
                        onClick={handleCancelEdit}
                    >
                        Cancel
                    </Button>
                </div>
            ) : (
                <Button
                    mt="md"
                    color="gray"
                    onClick={handleAddVariable}
                >
                    Add Variable
                </Button>
            )}
            <Box mt="md">
                <h3>Current Variables:</h3>
                <List size="md">
                    {Object.entries(colors).map(([key, value]) => (

                        <ListItem key={key}>
                            {key}:{" "}
                            <span
                                style={{
                                    backgroundColor: value,
                                    padding: "0 10px",
                                }}
                            >
                                {value}
                            </span>
                            <Button
                                m={"md"}
                                size="xs"
                                color="gray"
                                onClick={() => handleEditVariable(key)}
                            >
                                <Pencil />
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default AddGlobalVariable;
