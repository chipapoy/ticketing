import React from 'react'

const Form_Item_outputtext = ({labelName, outputText}) => {
  return (
    <div>
        <h3>
            {labelName}
        </h3>
        <p>
            {outputText}
        </p>
    </div>
  )
}

export default Form_Item_outputtext