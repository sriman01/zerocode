import { WidgetType } from "./widgetDefinition";

export function generateHtmlAndCss(widgetArray, derivedState) {
    console.log("Array", widgetArray);
    console.log("derived State", derivedState);

    function getStyles(styles) {
        const defaultStyles = {
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
        };
        styles = styles || defaultStyles;
        const margin = styles.margin || defaultStyles.margin;
        const padding = styles.padding || defaultStyles.padding;
        
        return `margin: ${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px; 
                padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;`;
    }

    function renderWidget(widget) {
        if (!widget) return "";

        let style = getStyles(widget.styles);
        switch (widget.type) {
            case WidgetType.text:
                return `<div class="tw-relative tw-min-w-[300px] tw-w-full tw-grid tw-min-h-[100px] tw-text-wrap tw-text-3xl tw-font-bold tw-text-gray-700">
                            <div class="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center" style="${style}">
                                 ${widget.content ?? ''}
                            </div>
                        </div>`;

            case WidgetType.video:
                return `<div class="tw-w-full tw-grid tw-justify-items-center tw-content-center tw-min-h-[200px] tw-min-w-[300px]">
                            <div class="tw-flex tw-justify-center tw-items-center tw-h-full tw-w-full">
                                <video src="${widget.videoContent?.src ?? ''}" style="${style}" class="tw-w-full w-object-cover tw-bg-no-repeat" controls>
                                   Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>`;

            case WidgetType.image:
                return `<div class="tw-w-full tw-grid tw-justify-items-center tw-content-center tw-min-h-[200px] tw-min-w-[300px]">
                            <div class="tw-flex tw-justify-center tw-items-center tw-h-full tw-w-full">
                                <img src="${widget.imageContent?.src ?? ''}" alt="image-section" style="${style}" class="tw-w-full tw-object-cover tw-bg-no-repeat">
                            </div>
                        </div>`;

            case WidgetType.oneColumnLayout:
                let oneColumnChildren = (widget.children || []).map(child => renderWidget(child)).join("");
                return `<div style="${style}">${oneColumnChildren}</div>`;

            case WidgetType.twoColumnLayout:
                let leftChildren = (widget.leftChildren || []).map(child => renderWidget(child)).join("");
                let rightChildren = (widget.rightChildren || []).map(child => renderWidget(child)).join("");
                return `<div style="display: flex; ${style}">
                            <div style="flex: 1;">${leftChildren}</div>
                            <div style="flex: 1;">${rightChildren}</div>
                        </div>`;

            case WidgetType.carousel:
                let carouselItems = (widget.children || []).map(child => renderWidget(child)).join("");
                return `<div class="carousel" style="${style}">${carouselItems}</div>`;

            case WidgetType.oneDropLayout:
                let oneDropChild = renderWidget(widget.child);
                return `<div style="${style}">${oneDropChild}</div>`;

            default:
                return "";
        }
    }

    return widgetArray.map(item => renderWidget(item)).join("");
}

export default function CodeGeneratorFunction(widgetArray, derivedState) {
    generateHtmlAndCss(widgetArray, derivedState);
}
