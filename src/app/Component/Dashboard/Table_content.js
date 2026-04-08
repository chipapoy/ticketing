import React from 'react'

import {
    Card, 
    Title, 
    Table,
    TableHeader,
    TableHeaderCell,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    Text
} from '@tremor/react'



const Table_content = ({cardTitle, listOfItems, headerNames}) => {
    const tempHeader = ["Name", "Value"];

    return (
        <Card className='justify-center' decoration="top" decorationColor="indigo">
            <Title>{cardTitle}</Title>
            <Table className='mt-5'>
                <TableHead>
                    <TableRow>
                        {headerNames.map((name, index) => (
                            <TableHeaderCell key={index} className='text-center'>{name}</TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listOfItems.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className='text-center'>{index + 1}</TableCell>
                            <TableCell className='text-center'>{item.typeName}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default Table_content