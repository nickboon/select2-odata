import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import select2 from 'select2';
select2($);

const term = $('#term');
const propertyInput = $('#property');
const result = $('#results');
const baseUrl =
	'https://services.odata.org/V4/(S(wptr35qf3bz4kb5oatn432ul))/TripPinServiceRW/People';
const getSearchFilter = () =>
	`?$filter=contains(${property},%20%27${term.val()}%27)%20eq%20true`;

// Test endpoint
$('#search').on('click', () => {
	const property = propertyInput.val();
	$.ajax({
		url: `${baseUrl}?${getSearchFilter()}`,
	}).then((response) => {
		result.html(
			response.value.map((x) => `<span>${x[property]}</span>`).join(', ')
		);
	});
});

// Test Select2
$.getJSON({
	url: baseUrl,
}).then((response) => {
	const property = propertyInput.val();
	const html = response.value
		.map((x) => `<option value="${x[property]}">${x[property]}</option>`)
		.join('');
	console.log(html);
	$('.js-example-basic-single').html(html);
	$('.js-example-basic-single').select2();
});
