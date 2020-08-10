import React, { useState } from 'react';
import { Button, Icon, Form, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { validateEmail } from '../../../utils/Validations';
import firebase from '../../../utils/Firebase';
import 'firebase/auth';

import './RegisterForm.scss';

export default function RegisterForm(props) {

    const { setSelectedForm} = props;

    const [formData, setFormData] = useState(defaultValueForm());
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handlerShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onChange = e => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        });
    }

    const onSubmit = () => {

        setFormError({});
        let errors = {};
        let formOk = true;

        if(!validateEmail(formData.email)){
            errors.email = true;
            formOk = false;
        }

        if(formData.password.length < 6){
            errors.password = true;
            formOk = false;
        }

        if(!formData.nombre){
            errors.nombre = true;
            formOk = false;
        }

        setFormError(errors);

        if(formOk){
            setIsLoading(true);
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    changeUserName();
                    sendVerificationEmail();
                })
                .catch(() => {
                    toast.error("Error al crear la cuenta");
                })
                .finally(() => {
                    setIsLoading(false);
                    setSelectedForm(null);
                });
        }
    }

    const changeUserName = () => {
        firebase.auth().currentUser.updateProfile({
            displayName: formData.nombre
        }).catch(() => {
            toast.error("Error al asignar nombre de usuario.");
        });
    }

    const sendVerificationEmail = () => {
        firebase.auth().currentUser.sendEmailVerification()
            .then(() => {
                toast.success("Se envio email de verificación.")
            })
            .catch(() => {
                toast.error("Error al enviar email de verificación.")
            });
    }

    return (
        <div className="register-form">
            <h1>Empieza a escuchar con una cuenta de Musicfy gratis.</h1>
            <Form onSubmit={onSubmit} onChange={onChange}>
            <Form.Field>
                    <Input 
                        type="text"
                        name="nombre"
                        placeholder="Nombre Completo"
                        icon="user circle outline"
                        error={formError.nombre}
                    />
                    {formError.nombre && (
                        <span className="error-text">
                            El nombre no puede ir vacío
                        </span>
                    )}
                </Form.Field>
                <Form.Field>
                    <Input 
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        icon="mail outline"
                        error={formError.email}
                    />
                    {formError.email && (
                        <span className="error-text">
                            Introduce un correo electrónico válido
                        </span>
                    )}
                </Form.Field>
                <Form.Field>
                    <Input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        icon={showPassword ? (
                            <Icon name="eye slash outline" link onClick={handlerShowPassword} />
                        ) : (
                            <Icon name="eye" link onClick={handlerShowPassword} />
                        )}
                        error={formError.password}
                    />
                    {formError.password && (
                        <span className="error-text">
                            El password debe contener al menos 6 caracteres
                        </span>
                    )}
                </Form.Field>
                <Button type="submit" loading={isLoading}>
                    Registrarme
                </Button>
            </Form>
            <div className="register-form__options">
                <p onClick={() => setSelectedForm(null)}>Regresar</p>
                <p>¿Ya tienes cuenta? 
                    <span onClick={() => setSelectedForm("login")}> Iniciar Sesión</span>
                </p>
            </div>
        </div>
    )
}

function defaultValueForm(){
    return{
        nombre: "",
        email: "",
        password: ""
    }
}
