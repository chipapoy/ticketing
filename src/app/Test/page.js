'use client'

import  { useEffect,useState } from 'react';
import useDrivePicker from 'react-google-drive-picker'


const App = () => {
  const [openPicker, authResponse] = useDrivePicker();  
  const [uploadFiles, setUploadFiles] = useState();  
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: "155006878396-rc8u5rf6mu96tl7nkumnl5to94evf3po.apps.googleusercontent.com",
      developerKey: "AIzaSyBzaAhFqknNVNLtQi9I2s-s8Oa1zD9g8a8",
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      disableDefaultView: true,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      setParentFolder: '1sXCXBQOU0YOUGWYRxphrdhXmqLPyV4q3',
      // customViews: customViewsArray, // custom view
      customScopes:[
        // 'https://www.googleapis.com/auth/drive.apps.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.install'
      ],
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log(data.docs)

        setUploadFiles(data.docs)
      },
    })
  }


  
  return (
    <div className='flex items-center'>
        <button onClick={() => handleOpenPicker()}>Files</button>
        <ul>
          {
            uploadFiles ? (
              uploadFiles.map( (val) => (
                <li key={val}>{val.url}</li>
              ))
            )
            :
            null
          }
        </ul>
    </div>
  );
}

export default App;