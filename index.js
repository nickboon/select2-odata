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

// test Select2 with prefetch data
$.getJSON({
	url: baseUrl,
}).then((response) => {
	const value = propertyInput.val();
	const text = propertyInput.val();
	const html = response.value
		.map((x) => `<option value="${x[value]}">${x[text]}</option>`)
		.join('');
	$('.js-example-basic-single').html(html);
	$('.js-example-basic-single').select2();
});

// test Select2 autocomplete with odata filter
$('.js-data-example-ajax').select2({
	ajax: {
		url: baseUrl,
		dataType: 'json',
		delay: 250,
		data: function (params) {
			const property = propertyInput.val();
			return {
				$filter: `contains(${property}, '${params.term}') eq true`,
				page: params.page,
			};
		},
		processResults: function (data, params) {
			params.page = params.page || 1;
			const id = propertyInput.val();
			const text = propertyInput.val();

			return {
				results: data.value.map((item) => ({
					id: item[id],
					text: item[text],
				})),
				pagination: {
					more: params.page * 30 < data.value.total_count,
				},
			};
		},
		cache: true,
	},
	minimumInputLength: 2,
});
