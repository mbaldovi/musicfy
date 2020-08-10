import React, { useState } from 'react';
import {Button, Form, Icon, Input} from "semantic-ui-react";
import { toast } from 'react-toastify';
import {reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserEmail (props) {
    const {user, setShowModal, setTitleModal, setContentModal} =props; 

    const onEdit= () => {
        setTitleModal("Actualizar Email");
        setContentModal(<ChangeEmailFrom  email={user.email} setShowModal={setShowModal} />);
        setShowModal(true);
    }

    return (
        <div className="user-email">
            <h3>Email: {user.email}</h3> 
            <Button circular onClick={onEdit}>
                Actualizar
            </Button> 
        </div>
    );
}

function ChangeEmailFrom(props){ 
    const {email, setShowModal}=props;
    const [formData, setFormData] = useState({email:"", password:""});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const onSubmit = () => {
        if(!formData.email || formData.email === email){
            toast.warning("El email no puede ser el mismo o estar vacío");
        }else if(!formData.password){
            toast.warning("El password no puede estar vacío");
        }else{
            setIsLoading(true);
            reauthenticate(formData.password).then(() => {
                const currentUser = firebase.auth().currentUser;
                currentUser.updateEmail(formData.email).then(() => {
                    toast.success("Email actualizado");
                    setIsLoading(false);
                    setShowModal(false);

                    currentUser.sendEmailVerification().then(() => {
                        firebase.auth().signOut();
                    });

                })
                .catch(err => {
                    alertErrors(err?.code);
                    setIsLoading(false);
                })
            })
            .catch(err => {
                alertErrors(err?.code);
                setIsLoading(false);
            })
        }
    }
    return(
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <Input
                    defaultValue={email} 
                    type="text"
                    //a traves del expres operator podemos modificar los valores del email
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                 />
            </Form.Field>
            <Form.Field>
                <Input 
                    placeholder="Password"
                     type={showPassword ? "text" : "password"}
                     onChange={e => setFormData({...formData, password: e.target.value})} 
                     icon={
                        <Icon
                            name={showPassword ? "eye slash outline" : "eye"}
                            link 
                            onClick= { () => setShowPassword(!showPassword)}
                        />
                    }
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>
                    Actualizar Email
            </Button>
        </Form>
    );
}