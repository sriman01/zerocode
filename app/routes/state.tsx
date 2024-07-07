import { Uuid } from "~/utilities/utilities";
import {WidgetType} from "./widgetDefinition";
import {
    Action,
    DeleteWidget,
    DropAction,
    EditContent,
    EditMarginAndPaddding,
    NormalizedWidgetsState,
    ReorderAction,
    SelectAction,
    SetBackgroundColor,
    type Widgetinstance,
} from "./widgets";
import {useGlobalVariables} from "~/context/GlobalVariablesContext";

// const {colors} = useGlobalVariables();

export const initialState: NormalizedWidgetsState = {
    derivedState: {},
    widgets: [],
    selectedWidgetId: null,
};

export const droppedItemsReducer = (
    state: NormalizedWidgetsState = initialState,
    action: Action,
): NormalizedWidgetsState => {
    switch (action.type) {
        case "dropped":
            return handleDropAction(state, action.payload);
        case "reorder":
            return handleReorderAction(state, action.payload);
        case "selected":
            return handleSelection(state, action.payload);
        case "editContent":
            return handleEditContent(state, action.payload);
        case "editMarginAndPadding":
            return handleMarginAndPadding(state, action.payload);
        case "setBackgroundColor":
            return handleBackgroundColor(state, action.payload);
        case "deleteWidget":
            return handleDeleteAction(state, action.payload);
        default:
            throw new Error("Unhandled action type");
    }
};

const handleDropAction = (
    state: NormalizedWidgetsState,
    payload: DropAction["payload"],
) => {
    const {parentId, parentType, item, index, childType} = payload;

    if (parentId) {
        return updateStateForParent(
            state,
            state.widgets,
            parentId,
            parentType,
            item,
            index,
            childType,
        );
    } else {
        if (index === undefined) {
            const updatedwidgets = [...state.widgets, item];
            const newDerivedState = getNewDerivedState(updatedwidgets);
            return {
                ...state,
                widgets: updatedwidgets,
                derivedState: newDerivedState,
            };
        } else {
            const updatedwidgets = [...state.widgets];
            updatedwidgets.splice(index, 0, item);
            const newDerivedState = getNewDerivedState(updatedwidgets);
            return {
                ...state,
                widgets: updatedwidgets,
                derivedState: newDerivedState,
            };
        }
    }
};

const updateStateForParent = (
    normalizeState: NormalizedWidgetsState,
    state: Widgetinstance[],
    parentId: Uuid,
    parentType: WidgetType,
    newItem: Widgetinstance,
    index?: number,
    childType?: string,
) => {
    const updatedwidgets = state.map((item) => {
        if (item.id === parentId) {
            return cloneWithUpdatedChildren(item, newItem, index, childType);
        } else if (item.children || item.leftChildren || item.rightChildren) {
            const updatedGlobal = cloneWithUpdatedNestedChildren(
                normalizeState,
                item,
                parentId,
                parentType,
                newItem,
                index,
                childType,
            );
            return updatedGlobal;
        }
        return item;
    });

    const newDerivedState = getNewDerivedState(updatedwidgets);

    return {
        ...normalizeState,
        widgets: updatedwidgets,
        derivedState: newDerivedState,
    };
};

const cloneWithUpdatedChildren = (
    item: Widgetinstance,
    newItem: Widgetinstance,
    index?: number,
    childType?: string,
): Widgetinstance => {
    const updatedItem = item.deepClone();

    switch (item.type) {
        case WidgetType.carousel:
        case WidgetType.oneColumnLayout:
        case WidgetType.oneDropLayout:
            updatedItem.children =
                index === undefined
                    ? [...(item.children || []), newItem]
                    : [
                          ...(item.children || []).slice(0, index),
                          newItem,
                          ...(item.children || []).slice(index),
                      ];
            break;
        case WidgetType.twoColumnLayout:
            if (childType === "left") {
                updatedItem.leftChildren =
                    index === undefined
                        ? [...(item.leftChildren || []), newItem]
                        : [
                              ...(item.leftChildren || []).slice(0, index),
                              newItem,
                              ...(item.leftChildren || []).slice(index),
                          ];
            } else if (childType === "right") {
                updatedItem.rightChildren =
                    index === undefined
                        ? [...(item.rightChildren || []), newItem]
                        : [
                              ...(item.rightChildren || []).slice(0, index),
                              newItem,
                              ...(item.rightChildren || []).slice(index),
                          ];
            }
            break;
        default:
            throw new Error("Unhandled widget type");
    }
    return updatedItem;
};

const cloneWithUpdatedNestedChildren = (
    state: NormalizedWidgetsState,
    item: Widgetinstance,
    parentId: Uuid,
    parentType: WidgetType,
    newItem: Widgetinstance,
    index?: number,
    childType?: string,
): Widgetinstance => {
    const updatedItem = item.deepClone();

    switch (item.type) {
        case WidgetType.twoColumnLayout:
            updatedItem.leftChildren = updateStateForParent(
                state,
                item.leftChildren || [],
                parentId,
                parentType,
                newItem,
                index,
                childType,
            ).widgets;
            updatedItem.rightChildren = updateStateForParent(
                state,
                item.rightChildren || [],
                parentId,
                parentType,
                newItem,
                index,
                childType,
            ).widgets;

            break;
        case WidgetType.oneColumnLayout:
        case WidgetType.oneDropLayout:
        case WidgetType.carousel:
            updatedItem.children = updateStateForParent(
                state,
                item.children || [],
                parentId,
                parentType,
                newItem,
                index,
                childType,
            ).widgets;
            break;
        default:
            return item;
    }

    return updatedItem;
};

const handleSelection = (
    state: NormalizedWidgetsState,
    payload: SelectAction["payload"],
): NormalizedWidgetsState => {
    const {selectedId} = payload;
    return {
        ...state,
        selectedWidgetId: selectedId,
    };
};

const handleEditContent = (
    state: NormalizedWidgetsState,
    payload: EditContent["payload"],
): NormalizedWidgetsState => {
    const {content, type} = payload;
    const {derivedState, selectedWidgetId} = state;

    if (type === WidgetType.text) {
        derivedState[selectedWidgetId].content = content;
    } else if (type === WidgetType.image) {
        derivedState[selectedWidgetId].imageContent.src = content;
    } else if (type === WidgetType.video) {
        derivedState[selectedWidgetId].videoContent.src = content;
    }

    return {...state};
};

const handleMarginAndPadding = (
    state: NormalizedWidgetsState,
    payload: EditMarginAndPaddding["payload"],
): NormalizedWidgetsState => {
    const {margin, padding} = payload;

    const {derivedState, selectedWidgetId} = state;
    derivedState[selectedWidgetId].margin = margin;
    derivedState[selectedWidgetId].padding = padding;

    return {...state};
};

const handleBackgroundColor = (
    state: NormalizedWidgetsState,
    payload: SetBackgroundColor["payload"],
): NormalizedWidgetsState => {
    const {color: key, colors} = payload;
    const {derivedState, selectedWidgetId} = state;
    derivedState[selectedWidgetId].backgroundColor = key;

    return {...state};
};

const getNewDerivedState = (
    widgets: Widgetinstance[],
): {[id: string]: Widgetinstance} => {
    const derivedState: {[id: string]: Widgetinstance} = {};
    const processChildren = (widgets: Widgetinstance[], parentId?: string) => {
        widgets.forEach((widget) => {
            switch (widget.type) {
                case WidgetType.text:
                case WidgetType.image:
                case WidgetType.video:
                    derivedState[widget.id] = widget;
                    widget.parent = parentId;
                    break;

                case WidgetType.oneColumnLayout:
                case WidgetType.oneDropLayout:
                case WidgetType.carousel:
                    derivedState[widget.id] = widget;
                    widget.parent = parentId;
                    if (widget.children) {
                        processChildren(widget.children, widget.id);
                    }
                    break;

                case WidgetType.twoColumnLayout:
                    derivedState[widget.id] = widget;
                    widget.parent = parentId;
                    if (widget.leftChildren) {
                        processChildren(widget.leftChildren, widget.id);
                    }
                    if (widget.rightChildren) {
                        processChildren(widget.rightChildren, widget.id);
                    }
                    break;

                default:
                    throw new Error(`Unhandled widget type: ${widget.type}`);
            }
        });
    };

    processChildren(widgets);
    return derivedState;
};

const handleReorderAction = (
    state: NormalizedWidgetsState,
    payload: ReorderAction["payload"],
): NormalizedWidgetsState => {
    const {parentId, fromIndex, toIndex} = payload;

    if (!parentId) {
        const updatedWidgets = reorderChildren(
            state.widgets,
            fromIndex,
            toIndex,
        );

        const newDerivedState = getNewDerivedState(updatedWidgets);
        return {
            ...state,
            widgets: updatedWidgets,
            derivedState: newDerivedState,
        };
    }

    const updatedWidgets = reorderNestedWidgets(
        state.widgets,
        parentId,
        fromIndex,
        toIndex,
    );

    const newDerivedState = getNewDerivedState(updatedWidgets);

    return {
        ...state,
        widgets: updatedWidgets,
        derivedState: newDerivedState,
    };
};

const reorderChildren = (
    children: Widgetinstance[],
    fromIndex: number,
    toIndex: number,
) => {
    const updatedChildren = [...children];
    const [movedItem] = updatedChildren.splice(fromIndex, 1);
    updatedChildren.splice(toIndex, 0, movedItem);
    return updatedChildren;
};

const reorderNestedWidgets = (
    widgets: Widgetinstance[],
    parentId: Uuid,
    fromIndex: number,
    toIndex: number,
) => {
    return widgets.map((widget) => {
        const updatedWidget = widget.deepClone();
        if (updatedWidget.id === parentId) {
            if (widget.children) {
                updatedWidget.children = reorderChildren(
                    updatedWidget.children,
                    fromIndex,
                    toIndex,
                );
            } else if (
                updatedWidget.leftChildren ||
                updatedWidget.rightChildren
            ) {
                if (updatedWidget.leftChildren) {
                    updatedWidget.leftChildren = reorderChildren(
                        updatedWidget.leftChildren,
                        fromIndex,
                        toIndex,
                    );
                }
                if (updatedWidget.rightChildren) {
                    updatedWidget.rightChildren = reorderChildren(
                        updatedWidget.rightChildren,
                        fromIndex,
                        toIndex,
                    );
                }
            }
            return updatedWidget;
        } else if (
            widget.children ||
            widget.leftChildren ||
            widget.rightChildren
        ) {
            if (widget.children) {
                updatedWidget.children = reorderNestedWidgets(
                    updatedWidget.children,
                    parentId,
                    fromIndex,
                    toIndex,
                );
            }
            if (widget.leftChildren) {
                updatedWidget.leftChildren = reorderNestedWidgets(
                    widget.leftChildren,
                    parentId,
                    fromIndex,
                    toIndex,
                );
            }
            if (widget.rightChildren) {
                updatedWidget.rightChildren = reorderNestedWidgets(
                    widget.rightChildren,
                    parentId,
                    fromIndex,
                    toIndex,
                );
            }
            return updatedWidget;
        }
        return widget;
    });
};

const handleDeleteAction = (
    state: NormalizedWidgetsState,
    payload: DeleteWidget["payload"],
): NormalizedWidgetsState => {
    const {selectedId} = payload;

    const removeWidgetById = (
        widgets: Widgetinstance[],
        widgetId: Uuid,
    ): Widgetinstance[] => {
        return widgets.reduce<Widgetinstance[]>((acc, widget) => {
            if (widget.id === widgetId) {
                return acc;
            }

            const updatedWidget = widget.deepClone();

            if (widget.children) {
                updatedWidget.children = removeWidgetById(
                    widget.children,
                    widgetId,
                );
            }

            if (widget.leftChildren) {
                updatedWidget.leftChildren = removeWidgetById(
                    widget.leftChildren,
                    widgetId,
                );
            }

            if (widget.rightChildren) {
                updatedWidget.rightChildren = removeWidgetById(
                    widget.rightChildren,
                    widgetId,
                );
            }

            acc.push(updatedWidget);
            return acc;
        }, []);
    };

    const updatedWidgets = removeWidgetById(state.widgets, selectedId);
    const newDerivedState = getNewDerivedState(updatedWidgets);

    return {
        ...state,
        widgets: updatedWidgets,
        derivedState: newDerivedState,
        selectedWidgetId: null,
    };
};
