"use client"

import { Provider } from 'react-redux'
import { store } from './store'
import MainCard from './mainCard/mainCard';
import { AL30Data } from './page';

export default function App ({ AL30Data }: { AL30Data: AL30Data }) {
    // Redux include
    return(
        <Provider store={store}>
            <MainCard AL30Data={AL30Data} />
        </Provider>
    )
}