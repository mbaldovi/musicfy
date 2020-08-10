import React, { useState, useEffect } from 'react';
import BannerHome from "../../components/BannerHome";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import { map } from 'lodash';
import './Home.scss';
import firebase from '../../utils/Firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebase);

export default function Home() {
  const [artists, setArtists] = useState([]);
   // console.log(artists);

  useEffect(() => {
    db.collection("artists")
        .get()
        .then((response) => {
          // declara. array que guarda los artistas
            const arrayArtists = [];
            //solicitud info map (desde dependencia loadsh)
            map(response?.docs, artist => {
              //guarda info artist
                const data = artist.data();
                //extrae id artist
                data.id = artist.id;
                //pasa  info al array arrayArtists
                arrayArtists.push(data);
            });
            //  muestra en arrayArtist info artistas
            setArtists(arrayArtists);
        })
}, []);

    return (
      //el uso del fragment permite poder enviar varios objetos
      <>
        <BannerHome />
        <div className="home">
          <BasicSliderItems 
            title="Ultimos Artistas" 
            data={artists} 
            folderImage="artist" 
            urlName="artist"
          />
          <h2> Mas... </h2>
        </div>
      </>
      
    );
}
