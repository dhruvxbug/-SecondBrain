
//practice strcuture code file 

import type {IconProps} from "./props";
import {IconSizeVariant} from "./props";

export const PlusIcon = (props : IconProps) => {
    return <div>
         <svg xmlns="https://www.w3.org/2000/svg" 
         fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="colour" className={IconSizeVariant[props.size]}/>
    </div>
}