/*Initialize variables and required libraries*/
'use strict';
var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs');

var csvWriter = require('csv-write-stream');
var writer = csvWriter({headers: ["permssion", "url", "ext"]});
writer.pipe(fs.createWriteStream('output.csv'));

/*Input URLs*/
var url = 'http://substack.net/images/';

/*Fetch Data*/
request(url, function(err, res, body){
	if (err){
		console.log(err);
	}
	var $ = cheerio.load(body);
	var html_list = $('tr');
	html_list.each(function(i, row){
		extractData($(this));
	});

	function extractData(data){
		// console.log(data.html());
		var file_permission = data.find('code').html();
		var the_url = data.find('a').attr('href').split('/images').join('');
		var file_extention = data.find('a').html().split('.')[1];
		// console.log(file_extention);
		writeToFile(file_permission, url + the_url, file_extention);
	}

	function writeToFile(permission, the_url, extention){
		writer.write([permission, the_url, extention]);
	}

});