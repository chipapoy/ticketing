import { toast } from 'react-toastify';
import { redirect } from 'next/dist/server/api-utils';

// sets up the toast 
export const updateToast = (msg, toastType, delayTime = 1500, onClose = null) => {
   const notif = toast.loading("Processing...")
   setTimeout(() => {
      toast.update(notif, {
         render: msg,
         type: toastType === 'success' ? 'success' : 'error',
         delay: undefined,
         isLoading: false,
         position: "top-right",
         autoClose: 1500,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: false,
         draggable: true,
         progress: undefined,
         theme: "dark",
         style: {
            fontSize: 14
         },
         onClose: onClose
      })
   }, delayTime)
}