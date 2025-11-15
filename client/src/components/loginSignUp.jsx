import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function LoginSignUp() {
    const navigate = useNavigate();

    const [loginSignup, setLoginSignup] = useState(true);

    const [username, setUsername] = useState("Harsh");
    const [email, setEmail] = useState("Harsh@gmail.com");
    const [password, setPassword] = useState("1234");

    const handleLogin = async () => {
        try {
            await axios.post("http://localhost:8080/auth/login", { email, password }, { withCredentials: true });

            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignUp = async () => {
        try {
            await axios.post("http://localhost:8080/auth/register", { username, email, password });

            setLoginSignup(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();

        if (!window.google) {
            console.error("Google Identity Services SDK not loaded");
            return;
        }

        const client = window.google.accounts.oauth2.initCodeClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: "openid email profile",
            ux_mode: "popup",
            callback: async (response) => {
                try {
                    const { code } = response;

                    await axios.post(`http://localhost:8080/auth/google`, { code }, { withCredentials: true });

                    navigate("/");

                } catch (err) {
                    console.error("Google login error:", err);
                }
            },
        });

        client.requestCode();
    };

    return (
        <div className='flex justify-center items-center h-screen w-screen '>

            <div className='p-3 rounded-xl bg-gray-100'>

                {loginSignup &&
                    <div className='flex flex-col gap-2'>

                        <div className='text-xl text-center font-bold'>SignUp</div>

                        <div className='flex flex-col'>
                            <label>Username</label>
                            <input type="text" name="username" className='indent-1 rounded bg-gray-300' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className='flex flex-col'>
                            <label>Email</label>
                            <input type="text" name="email" className='indent-1 rounded bg-gray-300' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className='flex flex-col'>
                            <label>Password</label>
                            <input type="password" name="password" className='indent-1 rounded bg-gray-300' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div>
                            <p className='text-[12px] text-center'>Already have an account? <span className='text-blue-600' onClick={() => setLoginSignup(false)}>Login</span></p>
                        </div>

                        <div className='flex justify-center'>
                            <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={handleSignUp}>SignUp</button>
                        </div>

                        <div className='flex items-center'>
                            <div className='flex-1 h-[1px] bg-black'></div>
                            <div className='text-center text-[10px] mx-1'>OR</div>
                            <div className='flex-1 h-[1px] bg-black'></div>
                        </div>

                        <div className='flex justify-center'>
                            <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={handleGoogleSignIn}>SignIn with Google</button>
                        </div>

                    </div>
                }

                {!loginSignup &&
                    <div className='flex flex-col gap-2'>

                        <div className='text-xl text-center font-bold'>Login</div>

                        <div className='flex flex-col'>
                            <label>Email</label>
                            <input type="text" name="email" className='indent-1 rounded bg-gray-300' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className='flex flex-col'>
                            <label>Password</label>
                            <input type="password" name="password" className='indent-1 rounded bg-gray-300' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div>
                            <p className='text-[12px] text-center'>Don't have account? <span className='text-blue-600' onClick={() => setLoginSignup(true)}>SignUp</span></p>
                        </div>

                        <div className='flex justify-center'>
                            <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={handleLogin}>Login</button>
                        </div>

                        <div className='flex items-center'>
                            <div className='flex-1 h-[1px] bg-black'></div>
                            <div className='text-center text-[10px] mx-1'>OR</div>
                            <div className='flex-1 h-[1px] bg-black'></div>
                        </div>

                        <div className='flex justify-center'>
                            <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={handleGoogleSignIn}>SignIn with Google</button>
                        </div>

                    </div>
                }

            </div>

        </div>
    )
}

export default LoginSignUp;
