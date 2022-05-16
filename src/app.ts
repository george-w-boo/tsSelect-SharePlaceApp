import axios from 'axios';
import { Loader } from "@googlemaps/js-api-loader";

const form = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyC-R0Du7DnU62f_n8vCLR28-Qgfmi9L6Zc";

type GoogleGeocodingResponse = {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();

  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status === "OK") {
        const coordinates = response.data.results[0].geometry.location;
        console.log('coordinates', coordinates);

        const loader = new Loader({
          apiKey: GOOGLE_API_KEY,
        });
        
        loader.load().then(() => {
          console.log('in maps', coordinates);
          const map = new google.maps.Map(document.getElementById("map")! as HTMLElement, {
            center: coordinates,
            zoom: 16,
          });
          
          // The marker, positioned at coordinates
          const marker = new google.maps.Marker({
            position: coordinates,
            map: map,
          });
        });
      } else {
        throw new Error("Couldn't fetch the location :(");
      }
    })
    .catch((error) => alert(error.message));
}

form.addEventListener("submit", searchAddressHandler);
