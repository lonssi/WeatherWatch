import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/css/index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';

import fontawesome from '@fortawesome/fontawesome';
import {
	faMapMarkerAlt, faSearch, faQuestion, faEllipsisV,
	faSun, faThermometerHalf, faTint, faClock,
	faBullseye, faCloud, faMoon, faFlag
} from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(
	faMapMarkerAlt, faSearch, faClock, faQuestion, faEllipsisV, faSun,
	faThermometerHalf, faTint, faFlag, faBullseye, faCloud, faMoon
);

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
