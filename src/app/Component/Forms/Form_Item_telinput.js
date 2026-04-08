import { Combobox } from '@headlessui/react'
import { React, useState, useEffect } from 'react'

const Form_Item_telinput = (props) => {

	const [inputVal, setInputVal] = useState('')

	useEffect(() => {
		props.getValueCallback(inputVal)
	}, [inputVal])

	return (
		<Combobox className="mt-3">
			<div className='lg:flex lg:justify-between lg:gap-4 lg:mt-4'>
				<Combobox.Label>
					<h6 className="text-sm font-medium leading-tight">
						{props.labelName}
					</h6>
				</Combobox.Label>
				<div className="">
					<input
						onChange={e => setInputVal(e.target.value)}
						value={props.defaultValue}
						type={props.inputType}
						name={props.labelName}
						id={props.labelName}
						placeholder={props.placeHolder}
						required={props.isInputRequired}
						pattern="[0-9]{10}"
						className="w-[20rem] shadow-lg outline-none rounded-lg border-none py-1 pl-2 pr-10 text-xs leading-5 text-gray-900 focus:ring-0"
						maxLength={12}
					/>
				</div>
			</div>
		</Combobox>
	)
}

export default Form_Item_telinput