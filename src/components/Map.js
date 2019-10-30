import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocalTrails from './LocalTrails';
import '../App.css';
import GoogleMapReact from 'google-map-react';
import star from '../images/star.png'
import dot from '../images/dot.png'
import '../css/map.css';
import PropTypes from 'prop-types';



const Marker = ({ text }) => <div><img className={dot} src={dot}></img><h5>{text}</h5></div>
const Marker2 = ({ text }) => <div><img className={star} src={star}></img><h5>{text}</h5></div>

const Map = () => {

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [location, setLocation] = useState(null);
  const [trails, setTrails] = useState([]);
  const [search, setSearch] = useState('');
  const key = 'AIzaSyCyeLljiH3AH4KNaHNu8n08TnAR4xpjwMI';
  const zoom = 11;


  let center = {
      lat: lat,
      lng: lng
  }


  const getLocation = async () => {
      axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${key}&considerIp=false`)
          .then(res => {
              console.log(res);
              setLat(res.data.location.lat);
              setLng(res.data.location.lng);
              axios.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.data.location.lat},${res.data.location.lng}&key=${key}&result_type=locality`)
                  .then(res => {
                      setLocation(res.data.results[0].formatted_address);
                  })
                  .catch(err => {
                      console.log(err);
                  })
              axios.get(`https://www.hikingproject.com/data/get-trails?lat=${res.data.location.lat}&lon=${res.data.location.lng}&maxDistance=40&key=200527848-412c158b9fff68cfde1976462075c115&maxResults=25`)
                  .then(res => {
                      setTrails(res.data.trails);
                      console.log(res.data.trails);
                  })
                  .catch(err => {
                      console.log(err);
                  })
          })
          .catch(err => {
              console.log(err);
          })
  };

  const getSearchLocation = async () => {
      axios.post(`https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=AIzaSyCyeLljiH3AH4KNaHNu8n08TnAR4xpjwMI`)
          .then(res => {
              console.log(res.data.results[0].geometry);
              setLat(res.data.results[0].geometry.location.lat);
              setLng(res.data.results[0].geometry.location.lng)
              axios.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.data.results[0].geometry.location.lat},${res.data.results[0].geometry.location.lng}&key=AIzaSyCMo-oGIC5PMRgNpeq2sjYQjjUaBP7PHYI&result_type=locality`)
                  .then(res => {
                      setLocation(res.data.results[0].geometry.formatted_address);
                  })
                  .catch(err => {
                      console.log(err);
                  })
              axios.get(`https://www.hikingproject.com/data/get-trails?lat=${res.data.results[0].geometry.location.lat}&lon=${res.data.results[0].geometry.location.lng}&maxDistance=40&key=200527848-412c158b9fff68cfde1976462075c115&maxResults=25`)
                  .then(res => {
                      setTrails(res.data.trails);
                      console.log(res.data.trails);
                  })
                  .catch(err => {
                      console.log(err);
                  })
          })
          .catch(err => {
              console.log(err);
          })
  }

  useEffect(() => {
      getLocation();
    },[]);

  return (
    <div>
     <div id="backgroundContainer">
                <header id="background"></header>
                <div id="searchBarContainer">
                    <h2>Trailhead</h2>
                    <input id="searchBar" placeholder="Search for trails" value={search} onChange={e => { setSearch(e.target.value) }}></input>
                    <button onClick={() => getSearchLocation()} className="button"><i class="fa fa-search"></i></button>
                </div>
            </div>

    <div className="container">
      <div id="divider">
      </div>
      <div className="hikingRw">
        <h3> ⛰️ Hiking trails in your area 🌲</h3>
      </div>
      {lat !== null && lng !== null && location !== null && trails.length !== 0 &&
                <div class="row justify-content-center">
                    <div class="col-8">
                        <div className="card">
                                <div>
                                    <div style={{ height: '100vh', width: '100%' }}>
                                        <GoogleMapReact
                                            bootstrapURLKeys={{ key: key }}
                                            center={center}
                                            defaultZoom={zoom}
                                        >
                                            {trails.map((x,i) =>
                                                <Marker lat={x.latitude} lng={x.longitude}  />
                                            )}
                                            <Marker2
                                                lat={lat}
                                                lng={lng}
                                                // onClick={}
                                            />
                                        </GoogleMapReact>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <LocalTrails trails={trails} />
                    </div>
                </div>}
            </div>
        </div>
  );
}

export default Map;
