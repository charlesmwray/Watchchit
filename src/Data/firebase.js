/*eslint no-undef: 0*/
var config = {
    apiKey: "AIzaSyBmdypyXBSh6_Pble2-3o8alfVogwi3yIs",
    authDomain: "sweltering-fire-733.firebaseapp.com",
    databaseURL: "https://sweltering-fire-733.firebaseio.com/",
    projectId: "sweltering-fire-733",
    storageBucket: "sweltering-fire-733.appspot.com",
    messagingSenderId: "379353179305"
};

firebase.initializeApp(config);

const data = firebase.database().ref('movies')

export default data;
