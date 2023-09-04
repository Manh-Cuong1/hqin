import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux/es/exports';
import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './components/GlobalStyle';
import { changeDeviceMode, changeSize } from './redux/deviceModeSlice';
import publicRoutes from './routes';
import privateRoutes from './routes/privateRoutes';
import LoginForm from './layouts/Auth/LoginForm';
import Register from './layouts/Auth/Register';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './page/Checkout/Payment';

function App() {
    const dispatch = useDispatch();
    const [stripeApiKey, setStripeApiKey] = useState('');

    const ElementsCheckout = () => {
        return (
            <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
            </Elements>
        );
    };
    async function getStripeApiKey() {
        const { data } = await axios.get('http://localhost:4000/api/v1/stripeapikey');
        console.log(data.stripeApiKey);
        setStripeApiKey(data.stripeApiKey);
    }
    useEffect(() => {
        getStripeApiKey();
    }, []);

    useEffect(() => {
        dispatch(changeSize(window.innerWidth));
        dispatch(changeDeviceMode(window.innerWidth >= 992 ? 'large' : 'small'));

        const handleEvent = () => {
            dispatch(changeSize(window.innerWidth));
            dispatch(changeDeviceMode(window.innerWidth >= 992 ? 'large' : 'small'));
        };

        window.addEventListener('resize', handleEvent);
        return () => {
            window.removeEventListener('scroll', handleEvent);
        };
    }, []);

    return (
        <>
            <GlobalStyle>
                <Routes>
                    {publicRoutes.map((route) => {
                        let Component = route.component;
                        let Layout = route.layout;
                        return (
                            <Route
                                key={route.path.toString}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Component />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </GlobalStyle>
            <Routes>
                {privateRoutes.map((route) => {
                    let Component = route.component;
                    let Layout = route.layout;
                    return (
                        <Route
                            key={route.path.toString}
                            path={route.path}
                            element={
                                <Layout>
                                    <Component />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<Register />} />
                <Route path="/payment" element={<ElementsCheckout />} />
            </Routes>
        </>
    );
}

export default App;
