import { toast } from 'react-toastify';

export default function alertErrors(type){
    switch (type) {
        case "auth/wrong-password":
            toast.error("El password es incorrecto")
            break;
        
         case "auth/email-already-in-use":
            toast.error("El email ya existe");
            break;
            
        default:
            toast.error("Error del servidor, intentalo mas tarde");
            break;
    }
}