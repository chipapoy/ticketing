"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { md5 } from 'js-md5';
import axios from 'axios';
import { Input, Typography } from "@material-tailwind/react";
import Image from 'next/image';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form_renew_password from '@/Component/Forms/Form_renew_password';

const Login = () => {

  const router = useRouter()

  const [user, setuser] = useState({
    username: null,
    password: null,
  })

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('id') !== null) {
      router.push('/dashboard')
    }
  }, [])

  // useEffect(()=>{
  //   console.log(user.password)
  // },[user.password])
  
  const modalCallback = (data) => {

    setOpenModal(data.open)

    if(data.passwordUpdated){
      window.location.reload()
    }

  }

  const handleForm = (e) => {
    setuser(prev => ({
      ...prev,
      [e.target.name]: e.target.name == "password" ? md5(e.target.value) : e.target.value
    }))
  }

  const accessLogsHandler = async (data) => {
    axios.post('/api/Access/logs', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const loginUser = (e) => {

    e.preventDefault();

    const url = '/api/Access/login';

    setIsLoading(true)

    axios.post(url, user, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {

        if (response.data.result[0] != undefined) {

          const data = response.data.result[0];

          if (data.is_default_pass == 1) {
            setIsLoading(false)
            setOpenModal(true)
            setUserId(data.id)
          }
          else {
            localStorage.setItem('id', data.id);
            localStorage.setItem('name', data.name);
            localStorage.setItem('email_add', data.email_add);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role_id', data.role_id);
            localStorage.setItem('tech_id', data.tech_id);

            // localStorage.setItem('data',JSON.stringify(data))

            accessLogsHandler({
              username: data.username,
              login_date: moment().format('YYYY-MM-DD HH:mm')
            })

            // setIsLoading(true)

            switch (data.role_id) {
              case 1:
                router.push('/dashboard')
                break;
              case 2:
                router.push('/dashboard')
                break;
              case 3:
                router.push('/tickets')
                break;
              case 4:
                router.push('/tickets')
                break;
              case 5:
                router.push('/tickets')
                break;
              case 6:
                router.push('/tickets')
                break;
              case 7:
                router.push('/tickets')
                break;
              case 8:
                router.push('/tickets')
                break;

              default:
                break;
            }
          }
        }
        else {

          toast.error('Username/password is incorrect!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            style: {
              fontSize: 14
            },
            onClose: () => {
              setIsLoading(false)
            }
          });
        }
      })
      .catch(error => {
        console.log(error.message)
        setIsLoading(false)
        setErrorMsg('')
      })
  }

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className="flex bg-white flex-col px-6 pb-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">

          <div className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            <Image
              className="h-15 w-15 inline mr-4"
              src="/tmg.png"
              width={100}
              height={100}
              alt="The Moment Group"
            />
            Ticketing System
          </div>
        </div>
        <div className="mt-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={loginUser}>
            <div>
              <div className="mb-5">
                <div className="flex flex-col items-end gap-6">
                  <Input
                    id="username"
                    name="username"
                    label="Username"
                    type="text"
                    size="md"
                    required={true}
                    // value={user.username}
                    onChange={handleForm}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="mb-5">
                <div className="flex flex-col items-end gap-6">
                  <Input
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    size="md"
                    required={true}
                    // value={user.password}
                    onChange={handleForm}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="mt-2">
                <button
                  type="submit"
                  className={`${isLoading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-500'}  flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  disabled={isLoading}
                >
                  {
                    isLoading ? 'Logging in...' : 'Login'
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Form_renew_password isOpen={openModal} modalCallback={modalCallback} userId={userId}/>
      <ToastContainer />
    </div>
  )
}

export default Login