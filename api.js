var util = require('util');
var Client = require('mysql').Client;
var sql = new Client();

var db = 'dbname';
sql.host = '127.0.0.1';
//sql.port = 3306;
sql.user = 'root';
sql.password = 'root';

function Api(properties) {}
exports.Api = new Api();


// get 50 first (or more)
exports.Api.give = function(tableName, okCallback, errorCallback, offset, limit)
{
	if(!limit) 	limit = 50;
	if(!offset) offset = 0;
	
	var q = 'SELECT * FROM '+ tableName + ' LIMIT ' + offset + ', ' + limit;
	doQuery(q, okCallback, errorCallback);
}


// find
exports.Api.find = function(tableName, whereClause, okCallback, errorCallback, offset, limit)
{
	if(!limit) 	limit = 50;
	if(!offset) offset = 0;
	
	var q = 'SELECT * FROM ' + tableName + ' WHERE ' + whereClause + ' LIMIT ' + offset + ', ' + limit;
	console.log(q);
	doQuery(q, okCallback, errorCallback);
}


// add
exports.Api.add = function(tableName, object, okCallback, errorCallback)
{
	var cols = '';
	var vals = '';
	
	for (var p in object) {
		cols += p + ','; // formatting the set
		vals += '\'' + object[p] + '\',';
	}
	
	cols = cols.slice(0, -1); // remove last comma
	vals = vals.slice(0, -1); // remove last comma
	
	var q = 'INSERT INTO ' + tableName + '('+cols+') VALUES ('+vals+')';
	
	doQuery(q, okCallback, errorCallback);
}


// remove
exports.Api.remove = function(tableName, id, okCallback, errorCallback)
{
	if(!_is_int(id)) {
		errorCallback('-- dba.remove: id not an integer.');
		return;
	}
	
	var q = 'DELETE FROM ' + tableName + ' WHERE id = \'' + parseInt(id) + '\'';
	
	doQuery(q, okCallback, errorCallback);
}


// edit
exports.Api.edit = function(tableName, object, okCallback, errorCallback)
{
	if(!object.id) {
		errorCallback('-- dba.edit: no id given in object');
		return;
	}
	
	if(!_is_int(object.id)) {
		errorCallback('-- dba.edit: id not an integer.');
		return;
	}
	
	var sets = '';
	
	for (var key in object)
	{
		sets += key + ' = \'' + object[key] + '\',';
	}
	
	sets = sets.slice(0, -1);

	var q = 'UPDATE ' + tableName + ' SET ' + sets + ' WHERE id = \'' + parseInt(object.id) + '\' LIMIT 1';
	
	doQuery(q, okCallback, errorCallback);
}




function doQuery(query, okCallback, errorCallback) 
{
	sql.connect();
	sql.query('USE '+ db);

	sql.query(query,
		function selectCb(err, response) 
		{
			if (err)
			{
				sql.end();
				errorCallback(err);
				return;
			}
			
			sql.end();
			okCallback(response);
		}
	)
}


function _is_int(value)
{ 
	if((parseFloat(value) == parseInt(value)) && !isNaN(value)) 
		return true;
	else 
		return false;
}
