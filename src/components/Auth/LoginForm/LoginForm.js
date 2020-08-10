import React, { useState } from 'react';
import { Button, Icon, Form, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { validateEmail } from '../../../utils/Validations';
import firebase from '../../../utils/Firebase';
import 'firebase/auth';

import './LoginForm.scss';

export default function LoginForm(props) {

    const { setSelectedForm } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValuesForm());
    const [formError, setFormError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userActive, setUserActive] = useState(true);
    const [user, setUser] = useState(null);

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

        setFormError(errors);

        if(formOk){
            setIsLoading(true);
            firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
                .then(response => {
                    setUser(response.user);
                    setUserActive(response.user.emailVerified);
                    if(!response.user.emailVerified){
                        toast.warning("Para ingresar a Musicfy necesitas verificar tu correo electrónico.")
                    }
                })
                .catch(err => {
                    handlerErrors(err.code);
                }) 
                .finally(() => {
                    setIsLoading(false);
                })
        }
    }

    return (
        <div className="login-form">
            <h1>Música para todos</h1>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Form.Field>
                    <Input 
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        icon="mail outline"
                        error={formError.email}
                    />
                    {formError.email && (
                        <span className="error-text">Introduce un correo electrónico válido</span>
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
                        <span className="error-text">El password debe contener al menos 6 caracteres</span>
                    )}
                </Form.Field>
                <Button type="submit" loading={isLoading}>
                    Iniciar Sesión
                </Button>
            </Form>

            {!userActive && (
                <ButtonResetSendEmailVerification 
                    user={user}
                    setIsLoading={setIsLoading}
                    setUserActive={setUserActive}
                />
            )}

            <div className="login-form__options">
                <p onClick={() => setSelectedForm(null)}>Regresar</p>
                <p>¿No tienes cuenta?
                    <span onClick={() => setSelectedForm("register")}> Registrarme</span>
                </p>
            </div>
        </div>
    )
}

function ButtonResetSendEmailVerification(props){
    const { user, setIsLoading, setUserActive } = props;

    const resendVerificationEmail = () => {
        user.sendEmailVerification().then(() => {
            toast.success("Se ha enviado el email de verificación.")
        }).catch(err => {
            handlerErrors(err.code);
        })
        .finally(() => {
            setIsLoading(false);
            setUserActive(true);
        })
        
    }

    return (
        <div className="resend-verification-email">
            <p>Si no has recibido el email de verificación puedes volver a enviarlo haciendo click <span onClick={resendVerificationEmail}>aquí</span>.</p>
        </div>
    )
}

function handlerErrors(code){
    switch (code) {
        case "auth/wrong-password":
            toast.warning("Email o password incorrectos.")
            break;
        case "auth/too-many-requests":
            toast.warning("Se ha enviado email de verificación demasiado en poco tiempo.")
            break;
        case "auth/user-not-found":
            toast.warning("Email o password incorrectos.")
            break;
        default:
            break;
    }
}

function defaultValuesForm(){
    return{
        email: "",
        password: ""
    };
}
