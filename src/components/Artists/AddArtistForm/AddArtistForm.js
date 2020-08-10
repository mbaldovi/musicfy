import React, { useState,useCallback } from 'react';
import {Form, Input, Image, Button} from "semantic-ui-react";
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../../utils/Firebase';
import 'firebase/storage';
import 'firebase/firestore';

import NoImage from '../../../assets/png/no-image.png';
import "./AddArtistForm.scss";

const db = firebase.firestore(firebase);


export default function AddArtistForm(props) {
   // console.log(uuidv4()); 
    const { setShowModal } = props;
    const [formData, setFormData] = useState(initialValueForm());
    const [banner, setBanner] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    //console.log(banner); 
    //console.log(formData);


    const onDrop = useCallback(acceptedFile => {
        const file = acceptedFile[0];
        setFile(file);
        setBanner(URL.createObjectURL(file));
    });



    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/jpeg, image/png",
        noKeyboard: true,
        onDrop
    });

    // recibe el nombre del fichero y sube la imagen al storage firebase
    const uploadImage = fileName => {
        const ref = firebase
            .storage()
            .ref()
            .child(`artist/${fileName}`);

        return ref.put(file);
    }

    const onSubmit = () => {
        if(!formData.name){
            toast.warning("Añadir el nombre del artista");
        }else if(!file){
            toast.warning("Añadir el imagen del artista");
        }else{
            setIsLoading(true);
            const fileName = uuidv4();
            uploadImage(fileName)
            .then(() => {
                db.collection("artists")
                .add({ name: formData.name , banner: fileName })
                .then(() => {
                    toast.success("Artista añadido correctamente");
                    resetForm();
                    setIsLoading(false);
                    setShowModal(false);
                })
                .catch(() => {
                    toast.error("Error al añadir el artista");
                    setIsLoading(false);
                }) 
            })

            .catch(() => {
                console.log("imagen ERRROR"); 
            })
        }
    }

    const resetForm = () => {
        setFormData(initialValueForm());
        setFile(null);
        setBanner(null);
    }

    return (
        <Form className="add-artist-form" onSubmit={onSubmit}>
            <Form.Field className="artist-banner">
                <div 
                    { ...getRootProps() } 
                    className="banner" 
                    style={{ backgroundImage: `url('${banner}')`}}
                />
                 <input { ...getInputProps() } />
                { !banner && <Image src={NoImage} /> }
            </Form.Field>
            <Form.Field className="artist-avatar">
                <div 
                    className="avatar" 
                    style={{ backgroundImage: `url('${banner ? banner : NoImage}')`}}
                />
            </Form.Field>
            <Form.Field className="artist-banner">
                <Input 
                    type="text"
                    placeholder="Nombre del artista"
                    onChange={e => setFormData({ name: e.target.value })}
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>
                Crear Artista
            </Button>


        </Form>
    )
}

function initialValueForm(){
    return{
        name: ""
    }
}