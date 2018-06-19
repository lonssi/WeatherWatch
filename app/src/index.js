import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/css/index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';

import fontawesome from '@fortawesome/fontawesome';
import faMapMarkerAlt from '@fortawesome/fontawesome-free-solid/faMapMarkerAlt';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestion';
import faEllipsisV from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import faSun from '@fortawesome/fontawesome-free-solid/faSun';
import faThermometerHalf from '@fortawesome/fontawesome-free-solid/faThermometerHalf';
import faTint from '@fortawesome/fontawesome-free-solid/faTint';
import faFlag from '@fortawesome/fontawesome-free-solid/faFlag';
import faBullseye from '@fortawesome/fontawesome-free-solid/faBullseye';
import faCloud from '@fortawesome/fontawesome-free-solid/faCloud';
import faMoon from '@fortawesome/fontawesome-free-solid/faMoon';

fontawesome.library.add(
	faMapMarkerAlt, faSearch, faClock, faQuestion, faEllipsisV, faSun,
	faThermometerHalf, faTint, faFlag, faBullseye, faCloud, faMoon
);

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
