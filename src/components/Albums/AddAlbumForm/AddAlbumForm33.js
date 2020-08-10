import React, { useState, useCallback, useEffect} from 'react';
import { Form, Input, Button, Image, Dropdown } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';

import NoImage from '../../../assets/png/no-image.png';

import './AddAlbumForm.scss';


export default function AddAlbumForm(props) {

    const { setShowModal } = props;

    const [albumImage, setAlbumImage] = useState(null);
    const [file, setFile] = useState(null);


    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setFile(file);
        setAlbumImage(URL.createObjectURL(file));
      }, []);



    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/jpeg, image/png",
        noKeyboard: true,
        onDrop
    });

    const onSubmit = () => {
        console.log(file);
        console.log ("enviando form")
    }

    return (
       <Form className="add-album-form" onSubmit={onSubmit}>
           
           <Form.Group>
               <Form.Field className="album-avatar" width={5}>
                    <div 
                            { ...getRootProps() }
                            className="avatar"
                            style={{ backgroundImage: `url('${albumImage}')` }}
                        />
                    <input 
                        {...getInputProps()}
                    />
                        { !albumImage && <Image src={NoImage} />}
               </Form.Field>
               
               <Form.Field className="album-inputs" width={11}>
                <Input placeholder="Nombre del album"  />
                <Dropdown placeholder="El album pertenece..." search/>
               </Form.Field>

           </Form.Group>

           <Button type="submit">
               Añadir Album
           </Button>

       </Form>
    )
}


