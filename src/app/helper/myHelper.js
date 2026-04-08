import moment from "moment";

const toggleModal = (data) => {
	setModalInfo({
		open: data.open,
		module: data.module,
		title: data.title,
		content: data.content
	});
};

 // returns the the moment date instead of the whole ticket
export function IsOverDue(ticket) {
	const inputString = ticket.sla;
 
	// Use a regular expression to extract the hours value
	const hoursMatch = inputString?.match(/\d+/);
	let currentDate;
	let addedDate;
	if (hoursMatch) {
	    const hours = parseInt(hoursMatch[0], 10); // Convert the matched value to an integer
 
	    currentDate = moment(ticket.open_date);
	    addedDate = moment(currentDate).add(hours, 'hours').format('YYYY-MM-DD HH:mm:ss');
 
	} else {
	    console.log("No hours value found in the input string.");
	}
 
	if (ticket.closed_date != null) {
	    return moment(ticket.closed_date).isAfter(addedDate);
	} else {
	    return moment().isAfter(addedDate);
	}
 }

 // returns the whole ticket instead of the moment date
export function IsBeyondSLA(ticket) {
	const inputString = ticket.sla;

	// Use a regular expression to extract the hours value
	const hoursMatch = inputString?.match(/\d+/);
	let currentDate;
	let addedDate;
	if (hoursMatch) 
	{
		const hours = parseInt(hoursMatch[0], 10); // Convert the matched value to an integer

		currentDate = moment(ticket.open_date);
		addedDate = moment(currentDate).add(hours, 'hours').format('YYYY-MM-DD HH:mm:ss');
	} 
	else 
	{
		console.log("No hours value found in the input string.");
	}

	if (ticket.closed_date != null) 
	{
		if (moment(ticket.closed_date).isAfter(addedDate))
			return ticket;
	} 
	else 
	{
		if(moment().isAfter(addedDate))
			return ticket;
	}
}
