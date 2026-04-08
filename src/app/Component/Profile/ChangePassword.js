import React, {useState, useEffect} from 'react'

import { md5 } from 'js-md5';
import { redirect } from 'next/navigation'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import axios from 'axios'

import { updateToast } from '../../utils/toast'; 

function isPasswordCorrect( refPassword, toCheckPassword, isEncrypted = true )
{
	// disables the input fields when at least one of them is empty
	if (refPassword == '' || toCheckPassword == '') return true

	return isEncrypted ? md5(toCheckPassword) != refPassword : toCheckPassword != refPassword
}

const ChangePassword = (props) => {
	const [oldInputPassword, setOldInputPassword] = useState('')
	const [newInputPassword, setNewInputPassword] = useState('')
	const [retypedPassword, setRetypedPasswoed] = useState('')

	const userID = localStorage.id


	const submitForm = (e) => {
		e.preventDefault()
		
		const url = `/api/Users/changePassword`

		const data = {
			password: md5(newInputPassword),
			is_default_pass: 0,
			id: userID
		}

		props.toggleCallback({
				open: false,
				module: '',
				title: '',
				content: null
			}
		)

		axios.post( url, data, {
			headers: {
				'Content-Type' : 'multipart/form-data'
			}
		}).then(response => {
			if (!response.data.result.error)
			{
				updateToast('Password successfully changed!', 'success', 3000, 
				() => {
					redirect('/profile')
				})
			} 
			else 
			{
				updateToast(response.data.result.error.code, 'error', 1500)
			}
		}).catch(error => {
			updateToast(error.message, 'error', 1500,
			() => {
				redirect('/profile')
			})
		})
	}

	return (
		<>
		<Box
			component='form'
			autoComplete='off'
			onSubmit={submitForm}
			>

			<div className='my-4'>		
			<TextField 
				type='password'
				label='Enter Old Password' 
				variant='standard'
				onChange={(e)=>{setOldInputPassword(e.target.value)}}
				error={(isPasswordCorrect(Object.values(props.password), oldInputPassword))}
				required
				/>
			</div>
			<div className='my-4'>
			<TextField 
				type='password'
				label='Enter New Password' 
				variant='standard'
				onChange={(e)=>{setNewInputPassword(e.target.value)}}
				disabled={(isPasswordCorrect(Object.values(props.password), oldInputPassword))}
				required
				/>
			</div>
			<div className='my-4'>
			<TextField 
				type='password'
				label='Retype New Password' 
				variant='standard'
				onChange={(e) => {setRetypedPasswoed(e.target.value)}}
				disabled={(isPasswordCorrect(Object.values(props.password), oldInputPassword))}
				required
				/>
			</div>
			<Button
				type='submit'
				disabled={(isPasswordCorrect(newInputPassword, retypedPassword, false))}
				className="absolute right-28 bottom-3 justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
				>
				submit
			</Button>
		</Box>
		</>
	)
}

export default ChangePassword