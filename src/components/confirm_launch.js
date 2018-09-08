import YourDialog from "./confirm";
import {createConfirmation} from "react-confirm";

const confirm = createConfirmation(YourDialog);


export default function(confirmation, options = {}) {
    // You can pass whatever you want to the component. These arguments will be your Component's props
    return confirm({ confirmation, options });
}