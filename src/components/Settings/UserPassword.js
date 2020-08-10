import React, { useState } from 'react';
import { Form, Input, Icon, Button } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { reauthenticate } from '../../utils/Api';
import AlertErrors from '../../utils/AlertErrors';
import firebase from '../../utils/Firebase';
import 'firebase/auth';

export default function UserPassword(props) {

    const { setShowModal, setTitleModal, setContentModal } = props;

    const onEdit = () => {
        setTitleModal("Actualizar Password");
        setContentModal(<ChangePasswordForm setShowModal={setShowModal}/>);
        setShowModal(true);
    }

    return (
        <div className="user-password">
            <h3>Password: *** *** *** ***</h3>
            <Button circular onClick={onEdit}>Actualizar</Button>
        </div>
    )
}

function ChangePasswordForm(props){

    const { setShowModal } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(DefaultValuesForm());
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        if(!formData.currentPassword || !formData.newPassword || !formData.repeatNewPassword){
            toast.warning("Los password no pueden estar vacías");
        }else if(formData.currentPassword === formData.newPassword){
            toast.warning("El nuevo password no puede ser igual al actual");
        }else if(formData.newPassword != formData.repeatNewPassword){
            toast.warning("Nuevo password y repetir password no coinciden");
        }else if(formData.newPassword.length < 6){
            toast.warning("El nuevo password debe contener al menos 6 caracteres");
        }else{
            setIsLoading(true);
            reauthenticate(formData.currentPassword).then(() => {
                const currentUser = firebase.auth().currentUser;

                currentUser.updatePassword(formData.newPassword).then(() => {
                    toast.success("Password actualizado");
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                })
                .catch(err => {
                    AlertErrors(err?.code);
                    setIsLoading(false);
                })
            })
            .catch(err => {
                AlertErrors(err?.code);
                setIsLoading(false);
            })
        }
    }

    return(
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password actual"
                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                    icon={ 
                        <Icon 
                            name={ showPassword ? "eye slash outline" : "eye" } 
                            link 
                            onClick={ () => setShowPassword(!showPassword) }
                        />}
                />
            </Form.Field>
            <Form.Field>
                <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Nuevo password"
                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                    icon={ 
                        <Icon 
                            name={ showPassword ? "eye slash outline" : "eye" } 
                            link 
                            onClick={ () => setShowPassword(!showPassword) }
                        />}
                />
            </Form.Field>
            <Form.Field>
                <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Repetir nuevo password"
                    onChange={e => setFormData({ ...formData, repeatNewPassword: e.target.value })}
                    icon={
                        <Icon 
                            name={ showPassword ? "eye slash outline" : "eye" } 
                            link 
                            onClick={ () => setShowPassword(!showPassword) }
                        />}
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>Actualizar password</Button>
        </Form>
    )
}

function DefaultValuesForm(){
    return{
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: ""
    }
}
