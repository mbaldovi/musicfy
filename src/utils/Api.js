import firebaseApp from './Firebase';
import * as firebase from 'firebase';
const db = firebase.firestore(firebaseApp);

//Funcion para saber si el usuario es administrador o no
export async function isUserAdmin(uid){
    const response = await db
        .collection("admins")
        .doc(uid)
        .get(); 
   // console.log(response);
    return response.exists;
}

//Función para reautenticar
export const reauthenticate = password => {

    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
        user.email, password
    );
    return user.reauthenticateWithCredential(credentials);
    
}


