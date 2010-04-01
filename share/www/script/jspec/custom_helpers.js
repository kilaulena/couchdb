function stubAlert(){
  if(typeof(old_alert) == 'undefined'){
    old_alert = alert;
  }
  alert = function(msg){
    // console.log('alert: ', msg)
  };
}

function destubAlert(){
  alert = old_alert;
}

function errorCallback(status, error, reason){
  console.log("Unexpected " + status + " error: " + error + " - " + reason)
  throw("Unexpected " + status + " error: " + error + " - " + reason);
}

function successCallback(resp){
  console.log("No error message here unexpectedly, successful response instead.")
  throw("No error message here unexpectedly, successful response instead.");
}

function useTestUserDb(){
  users_db = new CouchDB("spec_users_db", {"X-Couch-Full-Commit":"false"});
  var allDbs = CouchDB.allDbs();
  var db_exists = false;
  for (var i = 0; i < allDbs; i++) {
    if (allDbs[i] == "spec_users_db") {
      db_exists = true;
    }
  }
  if (db_exists) {
    users_db.createDb();
  };
  var xhr = CouchDB.request("PUT", "/_config/couch_httpd_auth/authentication_db", {
    body: JSON.stringify("spec_users_db"),
    headers: {"X-Couch-Persist": "false"}
  });
  if(typeof(old_value) == 'undefined'){
    old_value = xhr.responseText.replace(/\n/,'').replace(/"/g,'');
  }
}

function useOldUserDb(){
  CouchDB.request("PUT", "/_config/couch_httpd_auth/authentication_db", {
    body: JSON.stringify(old_value),
    headers: {"X-Couch-Persist": "false"}
  });
}