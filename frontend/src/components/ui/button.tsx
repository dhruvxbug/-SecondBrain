
//sample structure code file 

import type { ComponentType, ReactElement } from "react";

export interface ButtonProps{
    title: string;
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?: ComponentType<{ size?: string }>;
    endIcon?: ReactElement;
    onClick: () => void;
}

const sizeStyles = {
    "lg": "px-8 py-4 text-xl rounded-xl",
    "md": "px-6 py-3 text-lg rounded-lg",
    "sm": "px-4 py-2 text-sm rounded-sm"
}

const buttonVariants = {
    "primary": "bg-[] text-black",
    "secondary": "bg-[] text-white"
}

const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center"

export default function Button(props: ButtonProps){
    const Comp = props.startIcon;
   return <button onClick={props.onClick} className={`${sizeStyles[props.size]} ${defaultStyles } ${buttonVariants[props.variant]}`}>
    <div className="flex items-center">
        <span className="text-xs">
           {Comp ? <Comp size={props.size} /> : null}
        </span>
        <div className="pl-2 pr-2">
             {props.title}
        </div>
        {props.endIcon ? <div className="p-2"> {props.endIcon} </div> : null}
    </div>
   </button>
}

{/* <Button variant="primary" size="md" text={} startIcon={} endIcon={} onClick={} /> */}