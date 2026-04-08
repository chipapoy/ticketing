import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { md5 } from 'js-md5';
import { ToastContainer } from 'react-toastify'

import Modal_window from '@/Component/UI/Modal_window';
import ChangePassword from './ChangePassword';

const ProfileContent = () => {
	const [password, setPassword] = useState('')
	const [modalInfo, setModalInfo] = useState({
      open: false,
      module: '',
      title: '',
      content: null
   });
	const [userID, setUserID] = useState()
	const [name, setName] = useState()
	const [userEmail, setUserEmail] = useState()
	const [username, setUsername] = useState()


	useEffect(() => {
		setUserID(localStorage.id)
		setName(localStorage.getItem('name'))
		setUserEmail(localStorage.getItem('email_add'))
		setUsername(localStorage.getItem('username'))
	},[])

	const toggleCallback = (data) =>{
		setModalInfo({
			open: data.open,
			module: data.module,
			title: data.title,
			content: data.content
		})
	}

	const getPassword = async() => {

		const url = `/api/Users/getPassword`;

		axios.post(url, {
			id: userID
		}, {
			headers: {
			'Content-Type': 'multipart/form-data'
			}
		}).then((response) => {
			setPassword(response.data.result)
			toggleCallback({
				open: true,
				module: 'change password',
				title: 'Change password',
				content: <ChangePassword 
					toggleCallback={toggleCallback}
					password={response.data.result}
				/>
			})
		})
	}

	return (
		<>
		
			<Box className='grid grid-cols-2'>
				<div className='cols-span-1 gap-4 h-full'>
					<Paper 
						elevation={3}
						square={false}
						className='p-8 ml-8 mr-4 mt-4 h-full'
					>
						{/* PROFILE INFORMATION */}
						<Typography 
							variant='h6'
							className='font-semibold'
						>
							{name}
						</Typography>
						<Typography
							variant='subtitle1'
						>
							username: {username}
						</Typography>
						<Typography
							variant='subtitle1'
						>
							email: {userEmail}
						</Typography>
					</Paper>
				</div>
				<div className='cols-span-1 h-full'>
					<Paper 
						elevation={3}
						square={false}
						className='p-8 mr-8 ml-4 mt-4 h-full'
					>
						<Typography 
							variant='h6'
							className='font-semibold'
						>
							Password
						</Typography>
						<div
							className='mt-4'
						>

							<Button
								size='small'
								variant='outlined'
								color='error'
								
								onClick={getPassword}
							>
								change password
							</Button>
						</div>
					</Paper>
				</div>

			</Box>
			<Modal_window 
				modalWindowTitle={modalInfo.title}
				formContent={modalInfo.content}
				modalInfo={modalInfo}
				toggleCallback={toggleCallback}
				modalWidth={'720px'}
			/>
		</>
		
	)
}

export default ProfileContent