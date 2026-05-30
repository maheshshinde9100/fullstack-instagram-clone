import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { doesUsernameExist } from '../services/firebase';

const Signup = () => {
    const navigate = useNavigate();
    const { firebase } = useContext(FirebaseContext);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isInvalid = password === '' || emailAddress === '';

    const handleSignup = async (event) => {
        event.preventDefault();
        setError('');

        const usernameExists = await doesUsernameExist(username);

        if (!usernameExists) {
            try {
                const createdUserResult = await firebase.auth().createUserWithEmailAndPassword(emailAddress, password);

                await createdUserResult.user.updateProfile({
                    displayName: username,
                });

                // Add new user document in Firestore
                await firebase.firestore().collection('users').doc(createdUserResult.user.uid).set({
                    userId: createdUserResult.user.uid,
                    username: username.toLowerCase(),
                    fullName,
                    emailAddress: emailAddress.toLowerCase(),
                    following: [],
                    followers: [],
                    saved: [],
                    dateCreated: Date.now()
                });

                navigate(ROUTES.DASHBOARD);
            } catch (error) {
                console.error(error);
                if (error.code === 'auth/email-already-in-use') {
                    setError('Email is already in use.');
                } else if (error.code === 'auth/invalid-email') {
                    setError('Invalid email address.');
                } else {
                    setError('An error occurred. Please try again.');
                }
            }
        } else {
            setError('Username already exists. Please choose another.');
        }
    };

    useEffect(() => {
        document.title = 'Sign Up - Instagram';
    }, []);

    return (
        <div className='container flex justify-center mx-auto max-w-screen items-center h-screen'>
            <div className='flex w-2/5'>
                <img src="/images/iphone-with-profile.jpg" alt='iphone with instagram app' />
            </div>
            <div className='flex flex-col w-2/5'>
                <h1>
                    <img src="/images/logo.png" alt="instagram" className="mt-2 w-6/12 mb-4" />
                </h1>
                {error && <p className='text-xs text-red-primary mb-4'>{error}</p>}
                <form onSubmit={handleSignup} method='POST'>
                    <input
                        aria-label="Enter your username"
                        type="text"
                        placeholder="Username"
                        className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                        onChange={({ target }) => setUsername(target.value)}
                        value={username}
                    />

                    <input
                        aria-label="Enter your full name"
                        type="text"
                        placeholder="Full name"
                        className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                        onChange={({ target }) => setFullName(target.value)}
                        value={fullName}
                    />

                    <input
                        aria-label="Enter your email address"
                        type="text"
                        placeholder="Email address"
                        className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                        onChange={({ target }) => setEmailAddress(target.value)}
                        value={emailAddress}
                    />

                    <input
                        aria-label="Enter your password"
                        type="password" // Updated to 'password' type for security
                        placeholder="Password"
                        className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                        onChange={({ target }) => setPassword(target.value)}
                        value={password}
                    />

                    <button
                        disabled={isInvalid}
                        type="submit"
                        className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${isInvalid && "opacity-50"}`}
                    >
                        Sign up
                    </button>
                    <div className='flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary mt-4'>
                        <p>
                            Already have an account?{' '}
                            <Link className='font-bold text-blue-medium' to={ROUTES.LOGIN}>
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
