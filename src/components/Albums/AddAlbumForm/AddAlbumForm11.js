import React from 'react';
import { Form, Input, Button, Image, Dropdown } from 'semantic-ui-react';

import NoImage from '../../../assets/png/no-image.png';

import './AddAlbumForm.scss';


export default function AddAlbumForm(props) {

    

    
    const onSubmit = () => {
        
        console.log ("enviando form")
    }

    return (
       <Form className="add-album-form" onSubmit={onSubmit}>
           
           <Form.Group>
               <Form.Field className="album-avatar" width={5}>
                <h2>AVATAR</h2>    
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


