import React from 'react'

const Main_content = ({pageContent}) => {
  return (
    <main>
      <div className=" mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {pageContent}
      </div>
    </main>
  )
}

export default Main_content