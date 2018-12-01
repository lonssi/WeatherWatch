import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/css/index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons/faThermometerHalf';
import { faTint } from '@fortawesome/free-solid-svg-icons/faTint';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faCloud } from '@fortawesome/free-solid-svg-icons/faCloud';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';

library.add(
	faMapMarkerAlt, faSearch, faClock, faQuestion, faCog, faSun,
	faThermometerHalf, faTint, faFlag, faBullseye, faCloud, faMoon
);

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
