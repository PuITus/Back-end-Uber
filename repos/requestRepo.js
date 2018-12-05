var db = require('../fn/mysql-db');

exports.loadAll = () => {
	var sql = 'select * from requests';
	return db.load(sql);
}
exports.loadAllWithDriver = () =>
{
	var sql = 'select requests.ID, requests.Name,  requests.Phone,  requests.Adress,  requests.Note,  requests.Status,  requests.Latitude,  requests.Longitude, requests.Driver_ID, requests.Driver_lng, requests.Driver_lat, users.Name as Driver_name  from requests LEFT JOIN users ON requests.Driver_ID=users.ID';
	return db.load(sql);
}
exports.getUnlocated = () => {
	var sql = 'select * from requests where Status = 0 limit 1';
	return db.load(sql);
}
exports.setStatus = (ID,Status) => {
	var sql = `UPDATE requests
SET Status = '${Status}' WHERE ID = '${ID}';`;
	return db.load(sql);
}
exports.setDriver = (ID,Driver_ID,Driver_lat,Driver_lng) => {
	var sql = `
    UPDATE requests
SET Status = '3', Driver_ID = '${Driver_ID}', Driver_lat = '${Driver_lat}',Driver_lng = '${Driver_lng}' WHERE ID = '${ID}';`;
	return db.load(sql);
}
exports.load = () => {
	var sql = 'select * from requests where Status = 0';
	return db.load(sql);
}
exports.getByID = (ID) => {
	var sql = `select * from requests where ID = ${ID}`;
	return db.load(sql);
}
exports.updateAttitude = (Latitude,Longitude,ID) =>
{
    var sql = `
    UPDATE requests
SET Latitude = '${Latitude}', Longitude = '${Longitude}',Status = 2 WHERE ID = '${ID}';`;
    return db.insert(sql);
}
exports.add = requestEntity => {
    var sql = `insert into requests(Name, Phone, Adress, Note, Status,Latitude, Longitude) values('${requestEntity.Name}', '${requestEntity.Phone}','${requestEntity.Adress}','${requestEntity.Note}','0','${requestEntity.Latitude}','${requestEntity.Longitude}');`;
   return db.insert(sql);

}
