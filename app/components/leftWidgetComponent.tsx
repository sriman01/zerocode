import { Carousel, ImageWidget, OneColumnLayout, OneDropLayout, TextWidget, TwoColumnLayout, VideoWidget, Widget } from "~/routes/widgets";
import { CarouselSvg, ImageSvg, OneColumnLayoutSvg, OneDropSvg, TextSvg, TwoLayoutSvg, VideoSvg } from "./svgContainer";

export default function LeftWidgetComponent({ WidgetClass } : {WidgetClass: Widget}) {
    const getSvgAndTitle = (): { title: string, svg: JSX.Element | null}  => {
            switch(WidgetClass){
                case TextWidget:{
                    return { title:"Text", svg: <TextSvg />}
                }
                case ImageWidget:{
                    return { title:"Image", svg: <ImageSvg />}
                }
                case VideoWidget:{
                    return { title:"Video", svg: <VideoSvg />}
                }
                case Carousel:{
                    return { title:"Carousel", svg: <CarouselSvg />}
                }
                case OneColumnLayout:{
                    return { title:"One Column", svg: <OneColumnLayoutSvg />}
                }
                case OneDropLayout:{
                    return { title:"One Drop", svg: <OneDropSvg />}
                }
                case TwoColumnLayout:{
                    return { title:"Two Column", svg: <TwoLayoutSvg />}
                }
                default:{
                    return { title: "Not Exists", svg: null}
                }
            }
    }
    return (
        <div className="tw-flex tw-items-center tw-justify-center">
            <div className=" tw-flex tw-flex-col tw-border-2  tw-border-solid tw-bg-[#fff]  tw-items-center tw-justify-center tw-w-[100%] tw-p-2  ">
                <div className=" tw-ml-1 tw-w-[50%] ">
                    {getSvgAndTitle().svg}
                </div>
                    <div className="  tw-mt-1 tw-text-black tw-text-xs">{getSvgAndTitle().title}</div>
             </div>
        </div>
    )
}