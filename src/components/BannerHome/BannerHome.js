import React, { useState, useEffect } from 'react';
import firebase from '../../utils/Firebase';
import 'firebase/storage';

import "./BannerHome.scss";

export default function BannerHome() {

    const [bannerUrl, setBannerUrl] = useState(null);

    useEffect(() => {
        firebase
            .storage()
            .ref("other/banner-home.jpg")
           // obtiene la url del banner
            .getDownloadURL()
            //devuelve la url del banner
            .then(url => {
               // console.log(bannerUrl);
                setBannerUrl(url);
            })
            //el catch vacio permite no generar err conexión
            .catch(() => {

            });
    }, []);

    //si no existe un banner en la dB retornara null
    if(!bannerUrl){
        return null;
    }

    return (
        <div 
            className="banner-home"
            style={{backgroundImage: `url('${bannerUrl}')`}}
        />
    )
}
