import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import BannerArtist from '../../components/Artists/BannerArtist';
import firebase from '../../utils/Firebase';
import 'firebase/firestore';

import "./Artist.scss";

const db = firebase.firestore(firebase);


 function Artist(props) {
     //match propiedad que contiene: params, path, url. Del artista
    const { match } = props;
    const [artist, setArtist] = useState(null);
    
    //console.log(artist);
    //console.log(props);

    useEffect(() => {
        db.collection("artists")
            .doc(match?.params?.id)
            .get()
            .then(response => {
               setArtist(response.data());
            });
    }, [match]);

    
    return (
        <div className="artist">
           { artist && (
                <BannerArtist artist={artist}/>
            )}

            <h2>Mas información</h2>
        </div>
    );
}

export default withRouter(Artist);
