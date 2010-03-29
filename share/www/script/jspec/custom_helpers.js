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